import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { Card, Select, Row, Col, List, Tabs, Button } from 'antd';
import EventSource from 'eventsource';
import { EventSourcePolyfill } from 'event-source-polyfill';
import Cookies from 'js-cookie';
import uuid from 'uuid';
import { injectIntl } from 'react-intl';
import Cicon from '../../../shared/components/Cicon';
import { decodeUnicode, sleep, consoleMe } from '../../../utils';

import { API_URL, proxy, isProd } from '../../../constants/config';

import VideoJsPlayer from '../../../shared/components/VideoJsPlayer';
import ChartsBar from '../../../shared/components/ChartsBar';

import './index.less';

import MonitorList from './List';
import MonitorDetailCard from './MonitorDetailCard';

const ES = EventSource || EventSourcePolyfill;

let _isMounted = false;
let _isEsError = false;

const POLLING_TIME = 5000;

// 不同浏览器 hidden 名称
const hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null; // eslint-disable-line no-nested-ternary
// 不同浏览器的事件名
// const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

class Monitor extends PureComponent {
  static propTypes = {
    fetchActiveTask: func.isRequired,
    fetchMonitorPlayPath: func.isRequired,
    fetchMonitorAnalysis: func.isRequired,
    fetchMonitorData: func.isRequired,
    startMonitor: func.isRequired,
    stopMonitor: func.isRequired,
    showLoading: func.isRequired,
    intl: object.isRequired,
    resetMonitorData: func.isRequired,
  }

  constructor(props) {
    super(props);
    this.es = null;
    this.timerId = null;
  }

  state = {
    vehicle: [],
    person: [],
    originalTasks: [],
    originalTaskId: '',
    originalTaskName: '',
    monitor: '',
    detailCardVisible: false,
    type: 2, // 1 person 2 vehicle
    url: '',
    forceReset: false,
    analysis: [],
    isMonitorStarted: false,
  }

  componentDidMount() {
    _isMounted = true;
    this.handleFetchActiveTask();

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

  handleFetchMonitorAnalysis = async () => {
    const { fetchMonitorAnalysis } = this.props;
    const { originalTaskId } = this.state;
    if (originalTaskId) {
      const { response } = await fetchMonitorAnalysis(originalTaskId);
      if (response) {
        this.handleEsMonitorAnalysisMessage({ data: response });
      }
    }
  }

  handleFetchActiveTask = async () => {
    const { fetchActiveTask } = this.props;
    const { response } = await fetchActiveTask();
    if (response && response.length > 0) {
      const { originalTaskId, originalTaskName } = response[0];
      await this.setState({
        originalTaskId,
        originalTaskName,
        originalTasks: response,
      });
      this.flushMonitor();
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

  handleFetchMonitorData = async () => {
    const { fetchMonitorData } = this.props;
    const { originalTaskId } = this.state;
    if (originalTaskId) {
      const { response } = await fetchMonitorData(originalTaskId);
      if (response) {
        this.handleEsMonitorDataMessage({ data: response });
      }
    }
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

      this.es = new ES(`${url}/sse/register/monitor/${id}`, { headers: { token: Cookies.get('token') } });
      this.es.onerror = error => {
        consoleMe(error, 'warn', `EventSource is error when monitor id is ${id}`);
        _isEsError = true;
      };
      this.es.addEventListener('open', event => {
        consoleMe(event, 'warn', `EventSource is open when monitor id is ${id}`);
        if (_isEsError) {
          this.setState({ forceReset: true });
        }
      });
      this.es.addEventListener('monitorData', event => {
        this.handleEsMonitorDataMessage(event);
      });
      this.es.addEventListener('monitorAnalysis', event => {
        this.handleEsMonitorAnalysisMessage(event);
      });
    }
  }

  flushMonitor = () => {
    const { originalTaskId } = this.state;
    if (originalTaskId) {
      this.handleFetchMonitorPlayPath();
    }
  }

  clearMonitor = async () => {
    const { originalTaskId, isMonitorStarted } = this.state;
    const { stopMonitor } = this.props;
    // this.handlePollingData(true, false);
    if (originalTaskId && isMonitorStarted) {
      if (!_isMounted) {
        this.clearEventSource();
        stopMonitor({ originTaskId: originalTaskId, functionType: 'task' });
      } else {
        const { status } = await stopMonitor({ originTaskId: originalTaskId, functionType: 'task' });
        if (status === 200 && _isMounted) {
          this.setState({
            isMonitorStarted: false,
          });
        }
      }
    }
  }

  asyncMonitors = async (name, arr, isSleep = true) => {
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

  handleEsMonitorAnalysisMessage = event => {
    const { intl } = this.props;
    const { originalTaskId } = this.state;
    if (originalTaskId) {
      try {
        const { analysis, taskId } = JSON.parse(event.data);
        if (taskId === originalTaskId) {
          this.setState({
            analysis: Object.keys(analysis).map(key =>
              ({
                name: intl.formatMessage({ id: `App.public.struct.${key}` }),
                value: analysis[key],
              })),
          });
        }
      } catch (error) {
        consoleMe(error, 'warn', 'monitor analysis is error');
      }
    }
  }

  handleEsMonitorDataMessage = event => {
    // 新来的直接依次循环处理
    const { originalTaskName, type, originalTaskId } = this.state;
    try {
      const data = JSON.parse(event.data);
      let { vehicle = [], person = [] } = data;
      const { taskId } = data;
      if (taskId === originalTaskId) {
        const { time } = data;
        // 解析结构
        vehicle = vehicle.map(v => ({
          key: uuid.v4(),
          ...v,
          time,
          attri: Object.keys(v.attri).reduce((obj, key) =>
            ({ ...obj, [key]: decodeUnicode(v.attri[key]), originalTaskName }), {}),
        }));
        person = person.map(p => ({
          key: uuid.v4(),
          ...p,
          time,
          attri: Object.keys(p.attri).reduce((obj, key) =>
            ({ ...obj, [key]: decodeUnicode(p.attri[key]), originalTaskName }), {}),
        }));

        this.asyncMonitors('vehicle', vehicle, type === 2);
        this.asyncMonitors('person', person, type === 1);
      }
    } catch (error) {
      consoleMe(error, 'warn', 'parse monitor data is error');
    }
  }

  handleShowMonitorDetail = async (key, type) => {
    const { person, vehicle } = this.state;
    let monitor = null;
    if (type === 1) { // person
      monitor = person.find(p => p.key === key);
    } else {
      monitor = vehicle.find(v => v.key === key);
    }
    if (monitor) {
      await this.setState({
        monitor,
      });
      this.setState({
        detailCardVisible: true,
      });
    }
  }

  handleChange = async value => {
    await this.clearMonitor();
    const { originalTaskId, originalTasks } = this.state;
    if (originalTaskId !== value) {
      const originalTask = originalTasks.find(o => o.originalTaskId === value);
      if (originalTask) {
        await this.setState({
          originalTaskId: originalTask.originalTaskId,
          originalTaskName: originalTask.originalTaskName,
          vehicle: [],
          person: [],
          analysis: [],
          url: '',
        });
        this.flushMonitor();
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

  handleCloseDetailCard = () => {
    this.setState({
      detailCardVisible: false,
    });
  }

  handlePollingData = (isReset = false, isStart = true) => {
    if (isReset) {
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = null;
    }
    if (isStart) {
      if (!this.timerId) {
        this.timerId = setInterval(
          () => {
            this.handleFetchMonitorAnalysis();
            this.handleFetchMonitorData();
          }, POLLING_TIME,
        );
      }
    }
  }

  handleVideoPlay = async () => {
    const { originalTaskId, isMonitorStarted } = this.state;
    if (!isMonitorStarted) {
      const { startMonitor, showLoading } = this.props;
      const { status } = await startMonitor({ originTaskId: originalTaskId, functionType: 'task' });
      if (status === 200) {
        await this.setState({
          isMonitorStarted: true,
        });
        showLoading('Loading', 5 * 1000);
        this.startEventSource();
        // this.handlePollingData(true);
      }
    }
  }

  handleVideoEnded = () => {
    this.clearMonitor();
  }

  handleVideoForceReset = forceReset => {
    this.setState({ forceReset });
  }

  // 重置
  handleReset= () => {
    const { resetMonitorData } = this.props;
    const { analysis } = this.state;

    resetMonitorData(this.state.originalTaskId).then(({ isOk }) => {
      if (isOk) {
        // this.handlePollingData(true, false);
        // setTimeout(() => {
        //   this.handlePollingData(true);
        // }, POLLING_TIME);
        this.setState({
          analysis: analysis.map(item => ({
            ...item,
            value: 0,
          })),
          person: [],
          vehicle: [],
        });
      }
    });
  }

  render() {
    const {
      vehicle, person, originalTasks, monitor, detailCardVisible,
      url, analysis, type, originalTaskId, forceReset,
    } = this.state;
    const { intl } = this.props;

    const analysisRight = analysis.map(item => {
      const classNameVal = 'textColorWhite';
      return {
        ...item,
        classNameVal,
      };
    });

    return (
      <React.Fragment >
        <div className="app-page app-monitor">
          <Card
            bordered={false}
            className="app-card app-monitor__content"
          >
            <div>
              <Row>
                <Col span={12}>
                  <div className="app-monitor__content__title">
                    <div className="app-monitor__content__title-bg">
                      {intl.formatMessage({ id: 'App.smartapp.monitor.RTTask' })}
                    </div>
                    <Select
                      value={`${originalTaskId}`}
                      className="app-monitor__content__select"
                      showSearch
                      placeholder={intl.formatMessage({ id: 'App.smartapp.monitor.selectRunningTask' })}
                      optionFilterProp="children"
                      onChange={this.handleChange}
                      filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {originalTasks.map(o =>
                          (
                            <Select.Option
                              key={o.originalTaskId}
                              value={o.originalTaskId}
                            >
                              {o.originalTaskName}
                            </Select.Option>
                          ))}
                    </Select>
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
                      {intl.formatMessage({ id: 'App.smartapp.monitor.targetNum' })}
                    </div>
                    <Button ghost className="reset-btn" onClick={this.handleReset}><Cicon type="therefresh" />{intl.formatMessage({ id: 'App.control.reset' })}</Button>
                    <Row>
                      <Col span={20}>
                        <div className="ml-r-36">
                          <ChartsBar
                            data={analysis}
                            height={240}
                            xName="name"
                            yName="value"
                            isTooltip={false}
                          />
                        </div>
                      </Col>
                      <Col span={4}>
                        <div className="app-monitor__content__analysisRight">
                          <List
                            dataSource={analysisRight}
                            renderItem={item => (
                              <List.Item key={item.name}>
                                <div className="w-80 app-monitor__content__text">{item.name}</div>
                                <div className={`${item.classNameVal} fs-12`}>{item.value}</div>
                              </List.Item>
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </Col>
                <Col span={11} offset={1} className="fr">
                  <div className="app-monitor__content__analysis">
                    <div className="app-monitor__content__analysis__border" />
                    <Tabs className="app-monitor__content__analysis__tab" defaultActiveKey={`${type}`} onTabClick={this.handleTabClick}>
                      <Tabs.TabPane tab={intl.formatMessage({ id: 'App.smartapp.monitor.vehicleRec' })} key="2">
                        {type === 2 &&
                        <MonitorList
                          monitors={vehicle}
                          type={2}
                          onShowMonitorDetail={key => this.handleShowMonitorDetail(key, 2)}
                        />
                        }
                      </Tabs.TabPane>
                      <Tabs.TabPane tab={intl.formatMessage({ id: 'App.smartapp.monitor.personRec' })} key="1">
                        {type === 1 &&
                          <MonitorList
                            monitors={person}
                            type={1}
                            onShowMonitorDetail={key => this.handleShowMonitorDetail(key, 1)}
                          />
                        }
                      </Tabs.TabPane>
                    </Tabs >
                  </div>
                </Col>
              </Row>
            </div>
            {detailCardVisible &&
              <div className="monitor-detail-card_index">
                <MonitorDetailCard
                  monitor={monitor}
                  close={this.handleCloseDetailCard}
                  intl={intl}
                />
              </div>
            }
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default injectIntl(Monitor);
