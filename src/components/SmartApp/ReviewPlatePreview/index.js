import React, { PureComponent } from 'react';
import { func, object, array } from 'prop-types';
import { Card, Select, Row, Col, Tabs, Button, Modal } from 'antd';
import EventSource from 'eventsource';
import { EventSourcePolyfill } from 'event-source-polyfill';
import Cookies from 'js-cookie';
import uuid from 'uuid';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { sleep, consoleMe } from '../../../utils';

import { API_URL, proxy, isProd, BASE64_IMG_JPEG } from '../../../constants/config';

import VideoJsPlayer from '../../../shared/components/VideoJsPlayer';
import ResultDetail from '../../../shared/containers/ResultDetail';

import './index.less';

import ReviewPlatePreviewList from './List';

const ES = EventSource || EventSourcePolyfill;

let _isMounted = false;
let _isEsError = false;

const POLLING_TIME = 5000;

// 不同浏览器 hidden 名称
const hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null; // eslint-disable-line no-nested-ternary
// 不同浏览器的事件名
// const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

class ReviewPlatePreview extends PureComponent {
  static propTypes = {
    fetchMonitorPlayPath: func.isRequired,
    startMonitor: func.isRequired,
    stopMonitor: func.isRequired,
    showLoading: func.isRequired,
    getReviewPlateTask: func.isRequired,
    getReviewPlateResults: func.isRequired,
    getReviewPlateTasks: func.isRequired,
    updateFilter: func.isRequired,
    putReviewPlateTaskStart: func.isRequired,
    intl: object.isRequired,
    originalTasks: array.isRequired,
    results: array.isRequired,
    location: object.isRequired,
  }

  constructor(props) {
    super(props);
    this.es = null;
  }

  state = {
    results: [],
    statistics: {
      vehicleNums: 0,
      identifiedNums: 0,
      unidentifiedNums: 0,
    },
    originalTaskId: '',
    originalTaskName: '',
    originalTaskStatusTxt: '',
    isRunningTask: false,
    url: '',
    forceReset: false,
    isMonitorStarted: false,
    progress: 0,
    page: 1,
    pageSize: 200,
    currResult: '', // 当前操作的结果
    modalVisible: false, // 详细信息界面
  }

  async componentDidMount() {
    _isMounted = true;

    let originalTaskId = this.props.location.state.taskId;
    let originalTaskName = this.props.location.state.name;
    if (this.props.originalTasks.length <= 0) {
      await this.handleGetReviewPlateTasks();
    }
    if (!originalTaskId && this.props.originalTasks.length > 0) {
      originalTaskId = this.props.originalTasks[0].id;
      originalTaskName = this.props.originalTasks[0].name;
    }
    let { response: task, key } = await this.props.getReviewPlateTask(originalTaskId); // eslint-disable-line

    if (task) {
      task = task.entities[key][originalTaskId];
      if (task.status !== 1) {
        await this.props.putReviewPlateTaskStart(originalTaskId, { status: 1 });
        task.status = 1;
      }
      const originalTaskStatusTxt = task.status === 3 ? '识别完成' : (task.status === 1 ? '正在识别' : '关闭'); // eslint-disable-line

      // 此处延迟5秒保证任务已经开始
      this.props.showLoading('Loading', 6 * 1000);
      setTimeout(() => {
        this.setState({
          originalTaskId,
          originalTaskName,
          isRunningTask: true,
          originalTaskStatusTxt,
        }, () => {
          this.flushMonitor();
        });
      }, 5 * 1000);
    }

    // document.addEventListener(visibilityChangeEvent, this.handleVisibilityChange);
    window.onbeforeunload = this.handleBeforeunload;
  }

  componentWillUnmount() {
    _isMounted = false;
    _isEsError = false;
    this.clearMonitor();
    // document.removeEventListener(visibilityChangeEvent, this.handleVisibilityChange);
    window.onbeforeunload = null;
  }

  handleGetReviewPlateTasks = async () => {
    const { getReviewPlateTasks } = this.props;
    const {
      page, pageSize,
    } = this.state;

    const filters = {
      page,
      pageSize,
    };

    await this.updateFilter(filters);

    await getReviewPlateTasks();
  }

  updateFilter = async values => {
    const { updateFilter } = this.props;

    await updateFilter('reviewPlateTasks', values);
  }

  handleGetReviewPlateResults = async taskId => {
    const { getReviewPlateResults } = this.props;
    const {
      page, pageSize,
    } = this.state;

    const filters = {
      page,
      pageSize,
    };

    await this.updateFilter(filters);

    await getReviewPlateResults({ taskId });
  }

  updateFilter = async values => {
    const { updateFilter } = this.props;

    await updateFilter('reviewPlateResults', values);
  }

  showModal = record => {
    this.setState({
      currResult: { ...record, image: `${BASE64_IMG_JPEG}${record.image}` },
      modalVisible: true,
    });
  }

  hideModal = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleBeforeunload = () => {
    _isMounted = false;
    _isEsError = false;
    this.clearMonitor();
  }

  handleVisibilityChange = () => {
    if (!document[hiddenProperty]) {
      this.flushMonitor();
    } else {
      this.clearMonitor();
    }
  }

  handleFetchMonitorPlayPath = async () => {
    const { fetchMonitorPlayPath, showLoading } = this.props;
    const { originalTaskId } = this.state;
    const { status, response } = await fetchMonitorPlayPath(originalTaskId);
    if (response) {
      this.setState({
        url: response.url,
      });
    }
    if (status === 200) showLoading('Loading', 5 * 1000);
  }

  clearEventSource = () => {
    if (this.es && this.es.readyState !== 2 && EventSource) {
      this.es.close();
    }
    this.es = null;
  }

  startEventSource = () => {
    if (!this.es) {
      const { originalTaskId } = this.state;
      const url = isProd ? API_URL : proxy;
      const id = `${originalTaskId}-${uuid.v4().replace(new RegExp('-', 'g'), '')}`;

      this.es = new ES(`${url}/sse/register/review/${id}`, { headers: { token: Cookies.get('token') } });
      this.es.onerror = error => {
        consoleMe(error, 'warn', `EventSource is error when review id is ${id}`);
        _isEsError = true;
      };
      this.es.addEventListener('open', event => {
        consoleMe(event, 'warn', `EventSource is open when review id is ${id}`);
        if (_isEsError) {
          this.setState({ forceReset: true });
        }
      });
      this.es.addEventListener('reviewPlateResult', event => {
        this.handleEsReviewPlateResultMessage(event);
      });
      this.es.addEventListener('reviewPlateStatistics', event => {
        this.handleEsReviewPlateStatisticsMessage(event);
      });
      this.es.addEventListener('videoProgress', event => {
        this.handleEsVideoProgressMessage(event);
      });
    }
  }

  flushMonitor = () => {
    const { originalTaskId, isRunningTask } = this.state;
    if (originalTaskId && isRunningTask) {
      this.handleFetchMonitorPlayPath();
    }
  }

  clearMonitor = async () => {
    const { originalTaskId, isMonitorStarted } = this.state;
    const { stopMonitor } = this.props;
    if (originalTaskId && isMonitorStarted) {
      if (!_isMounted) {
        this.clearEventSource();
        stopMonitor({ originTaskId: originalTaskId, functionType: 'reviewTask' });
      } else {
        const { status } = await stopMonitor({ originTaskId: originalTaskId, functionType: 'reviewTask' });
        if (status === 200 && _isMounted) {
          this.setState({
            isMonitorStarted: false,
          });
        }
      }
    }
  }

  asyncDatas = async (name, arr, isSleep = true) => {
    /* eslint-disable no-restricted-syntax,no-await-in-loop */
    for (const m of arr) {
      this.state[name].unshift(m);
      if (this.state[name].length > 20) {
        this.state[name].pop();
      }
      if (!_isMounted || !this.state.isMonitorStarted) {
        break;
      }
      await this.setState({
        [name]: this.state[name].slice(0),
      });
      if (isSleep) {
        await sleep(POLLING_TIME / arr.length);
      }
    }
  }

  handleEsVideoProgressMessage = event => {
    const { originalTaskId } = this.state;
    if (originalTaskId) {
      try {
        const progresses = JSON.parse(event.data);
        const { taskId, progress } = progresses;
        if (taskId === originalTaskId && `${progress}` === '100') {
          this.setState({
            originalTaskStatusTxt: '识别完成',
          });
          this.handleGetReviewPlateTasks();
        }
      } catch (error) {
        consoleMe(error, 'warn', 'review plate progress is error');
      }
    }
  }

  handleEsReviewPlateStatisticsMessage = event => {
    const { originalTaskId } = this.state;
    if (originalTaskId) {
      try {
        const statisticsTemp = JSON.parse(event.data);
        const { taskId } = statisticsTemp;
        if (taskId === originalTaskId) {
          this.setState({
            statistics: { ...statisticsTemp },
          });
        }
      } catch (error) {
        consoleMe(error, 'warn', 'review plate statistics is error');
      }
    }
  }

  handleEsReviewPlateResultMessage = event => {
    // 新来的直接依次循环处理
    const { originalTaskId } = this.state;
    try {
      const data = JSON.parse(event.data);
      const { taskId } = data;
      if (taskId === originalTaskId) {
        // this.state.statistics.vehicleNums++;
        // if (data.result && data.plate) {
        //   this.state.statistics.identifiedNums++;
        // } else {
        //   this.state.statistics.unidentifiedNums++;
        // }
        // this.setState({
        //   statistics: { ...this.state.statistics },
        // });
        this.asyncDatas('results', [data]);
      }
    } catch (error) {
      consoleMe(error, 'warn', 'parse review plate result data is error');
    }
  }

  handleChange = async value => {
    await this.clearMonitor();
    const { originalTaskId } = this.state;
    const { originalTasks } = this.props;
    if (originalTaskId !== value) {
      const originalTask = originalTasks.find(o => o.id === value);
      if (originalTask) {
        if (originalTask.status !== 1) {
          await this.props.putReviewPlateTaskStart(originalTask.id, { status: 1 });
          originalTask.status = 1;
        }
        this.setState({
          originalTaskId: originalTask.id,
          originalTaskName: originalTask.name,
          isRunningTask: true,
          originalTaskStatusTxt: originalTask.status === 3 ? '识别完成' : (originalTask.status === 1 ? '正在识别' : '关闭'), // eslint-disable-line
          results: [],
          statistics: {},
          url: '',
        }, () => {
          this.flushMonitor();
        });
      }
    }
  }

  handleTabClick = key => {
    if (+key !== this.state.type) {
      this.setState({
        type: +key,
      });
    }
  }

  handleVideoPlay = async () => {
    const { originalTaskId, isMonitorStarted } = this.state;
    if (!isMonitorStarted) {
      const { startMonitor, showLoading } = this.props;
      const { status } = await startMonitor({ originTaskId: originalTaskId, functionType: 'reviewTask' });
      if (status === 200) {
        await this.handleGetReviewPlateResults(originalTaskId);
        await this.setState({
          results: this.props.results,
          isMonitorStarted: true,
        });
        showLoading('Loading', 5 * 1000);
        this.startEventSource();
      }
    }
  }

  handleVideoEnded = () => {
    this.clearMonitor();
  }

  handleVideoForceReset = forceReset => {
    this.setState({ forceReset });
  }

  render() {
    const {
      results, statistics, originalTaskStatusTxt,
      url, originalTaskId, forceReset, currResult,
    } = this.state;
    const { intl: { formatMessage }, originalTasks } = this.props;

    return (
      <React.Fragment >
        <div className="app-page reviewPlatePreview">
          <Card
            bordered={false}
            className="app-card app-monitor__content"
          >
            <div>
              <Row>
                <Col span={12}>
                  <div className="app-monitor__content__title">
                    <div className="app-monitor__content__title-bg">
                      复审任务
                    </div>
                    <Select
                      value={`${originalTaskId}`}
                      className="app-monitor__content__select"
                      showSearch
                      placeholder="请选择任务"
                      optionFilterProp="children"
                      onChange={this.handleChange}
                      filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {originalTasks.map(o =>
                          (
                            <Select.Option
                              key={o.id}
                              value={o.id}
                            >
                              {o.name}
                            </Select.Option>
                          ))}
                    </Select>
                    <Link to={{ pathname: '/smartapp/reviewplate/tasks' }}>
                      <Button ghost className="reset-btn">查看列表</Button>
                    </Link>
                  </div>
                  <Row>
                    <Col span={24}>
                      <div className="app-monitor__content__player">
                        <VideoJsPlayer
                          url={url}
                          width="100%"
                          height="423px"
                          controls={false}
                          forceReset={forceReset}
                          onPlay={this.handleVideoPlay}
                          onEnded={this.handleVideoEnded}
                          onForceReset={this.handleVideoForceReset}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row span={13} offset={1} className="mt-20">
                    <div className="app-monitor__content__title-bg">
                      {formatMessage({ id: 'App.smartapp.monitor.targetNum' })}
                    </div>
                    <span className="identifySuc">{originalTaskStatusTxt}</span>
                    <Row>
                      <Col span={24}>
                        <div className="ml-r-36 statictis">
                          <span>总识别车辆：{statistics.vehicleNums}</span>
                          <span>有车牌数：{statistics.identifiedNums}</span>
                          <span>无车牌数：{statistics.unidentifiedNums}</span>
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </Col>
                <Col span={11} offset={1} className="fr">
                  <div className="app-monitor__content__analysis">
                    <div className="app-monitor__content__analysis__border" />
                    <Tabs className="app-monitor__content__analysis__tab" defaultActiveKey="1" onTabClick={this.handleTabClick}>
                      <Tabs.TabPane tab="过车记录" key="1">
                        <ReviewPlatePreviewList
                          results={results}
                          onShowResultDetail={this.showModal}
                        />
                      </Tabs.TabPane>
                    </Tabs >
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
          {this.state.modalVisible &&
            <Modal
              width={790}
              title={formatMessage({ id: 'App.results.resultDetail' })}
              visible={this.state.modalVisible}
              onCancel={this.hideModal}
              footer={null}
            >
              <ResultDetail
                currResult={currResult}
              />
            </Modal>}
        </div>
      </React.Fragment>
    );
  }
}

export default injectIntl(ReviewPlatePreview);
