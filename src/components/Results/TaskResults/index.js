import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Modal, message, Card } from 'antd';
import { injectIntl } from 'react-intl';

import Sider from '../../../containers/layout/Sider';

import Cicon from '../../../shared/components/Cicon';

import ResultList from '../../../shared/containers/ResultList';
import ResultStructSearch from '../../../shared/containers/ResultStructSearch';
import ResultFeatureSearch from '../../../shared/components/ResultFeatureSearch';

import Filter from './Filter';
import List from './List';

import './index.less';


class TaskResults extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    filter: object.isRequired,
    meta: object.isRequired,
    taskresults: object.isRequired,
    fetchTaskResults: func.isRequired,
    updateFilter: func.isRequired,
    deleteTaskResults: func.isRequired,
    clearDatas: func.isRequired,
  }

  state = {
    currTask: {}, // 当前row的任务
    modalVisible: false, // 详细信息界面
    modalVisibleStructSearch: false, // 结构化检索界面
    modalVisibleFeatureSearch: false, // 以图搜图检索界面
    search: '', // 关键字
    type: 0, // 默认0是全部 任务类型
    struct: '', // 结构化以逗号分割的字符串
    target: '',
    page: 1, // 当前页
    pageSize: 8, // 当前页数量
    begin: '', // 开始时间
    end: '', // 结束时间
    selectedKeys: [], // 选中ID
    delSize: 0, // 一个用户删除个数，用来避免最后一页删除后，还是请求的没有用的
    isReset: false, // 是否显示重置刷新按钮
  }

  componentDidMount() {
    this.handleFetchTaskResults();
  }

  componentWillUnmount() {
    const { clearDatas } = this.props;
    clearDatas('results');
  }

  handleFetchTaskResults = () => {
    const { fetchTaskResults, meta } = this.props;
    const {
      search, type, struct, target, page, pageSize, begin, end, delSize,
    } = this.state;

    let pageTemp = Math.ceil((meta.total - delSize) / pageSize);
    pageTemp = page > pageTemp ? (page - 1) : page;
    pageTemp = pageTemp <= 0 ? 1 : pageTemp;

    const filters = {
      search,
      struct,
      target,
      type,
      page: pageTemp,
      pageSize,
      begin,
      end,
    };

    this.updateFilter(filters);

    fetchTaskResults();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('taskresults', values);
  }

  handleSearch = values => {
    const options = {
      search: '',
      struct: '',
      target: '',
      type: 0,
      page: 1,
      begin: null,
      end: null,
      isReset: true,
      ...values,
    };
    this.setState({
      ...options,
    }, () => {
      this.handleFetchTaskResults();
    });
  }

  handleReset = () => {
    this.handleSearch({ isReset: false });
  }

  handlePaginationClick = page => {
    this.setState({
      page,
    }, () => {
      this.handleFetchTaskResults();
    });
  }

  showModal = record => {
    this.setState({
      currTask: record,
      modalVisible: true,
    });
  }

  hideModal = () => {
    this.setState({
      modalVisible: false,
    });
  }

  showModalStructSearch = () => {
    this.setState({
      modalVisibleStructSearch: true,
    });
  }

  hideModalStructSearch = () => {
    this.setState({
      modalVisibleStructSearch: false,
    });
  }

  showModalFeatureSearch = () => {
    this.setState({
      modalVisibleFeatureSearch: true,
    });
  }

  hideModalFeatureSearch = () => {
    this.setState({
      modalVisibleFeatureSearch: false,
    });
  }

  handleDelete = ids => {
    const self = this;
    const {
      intl, taskresults, deleteTaskResults,
    } = this.props;
    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });

    this.setState({
      delSize: ids.length,
    });

    const taskresultsTemp = [];
    ids.forEach(id => {
      const taskresult = taskresults.get(id);
      if (taskresult && !taskresultsTemp.some(item => item.id === taskresult.id)) {
        taskresultsTemp.push(taskresult);
      }
    });
    const title = (
      <span>
        {msg}?&nbsp;&nbsp;
        {/**
        {taskresultsTemp.map(item =>
          <span key={item.id}>任务编号：{item.id}&nbsp;&nbsp;
          <Tag color="orange">{item.name}</Tag></span>)}？
        */}
      </span>
    );
    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteTaskResults(ids)
          .then(({ isOk }) => {
            if (isOk) {
              self.setState({
                selectedKeys: [],
              });
              message.success(successMsg);
              self.handleFetchTaskResults();
            }
          });
      },
    });
  }

  render() {
    const {
      meta, taskresults, filter, intl: { formatMessage },
    } = this.props;
    const { selectedKeys, currTask, isReset } = this.state;
    return (
      <React.Fragment>
        <Sider selectedKey="results-task" />
        <div className="app-page">
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">
              {formatMessage({ id: 'App.results.taskList' })}
            </h1>
            <Filter
              filter={filter}
              onSearch={this.handleSearch}
            />
            <div className="app-page__actions buttons-group">
              <Button
                type="primary"
                onClick={this.showModalStructSearch}
              >
                <Cicon type="structuredsearc" />{formatMessage({ id: 'App.results.structSearch' })}
              </Button>
              <Button
                style={{ display: 'none' }}
                type="primary"
                onClick={this.showModalFeatureSearch}
              >
                <Cicon type="search" />{formatMessage({ id: 'App.results.searchByPic' })}
              </Button>
              <Button
                style={{ display: (isReset ? '' : 'none') }}
                type="primary"
                onClick={this.handleReset}
              >
                <Cicon type="therefresh" />{formatMessage({ id: 'App.control.reset' })}
              </Button>
            </div>
            <List
              taskresults={taskresults}
              meta={meta}
              onDelete={this.handleDelete}
              onCardClick={this.showModal}
              selectedKeys={selectedKeys}
              onPaginationChange={this.handlePaginationClick}
            />
          </Card>
          {this.state.modalVisible &&
            <Modal
              width={1024}
              title={`${formatMessage({ id: 'App.results.taskId' })}: ${currTask.id}`}
              visible={this.state.modalVisible}
              onCancel={this.hideModal}
              footer={null}
            >
              <ResultList hideModal={this.hideModalResultList} currTask={currTask} />
            </Modal>}
          {this.state.modalVisibleStructSearch &&
            <Modal
              width={400}
              title={formatMessage({ id: 'App.results.structSearch' })}
              visible={this.state.modalVisibleStructSearch}
              onCancel={this.hideModalStructSearch}
              footer={null}
            >
              <ResultStructSearch
                hideModal={this.hideModalStructSearch}
                onSearch={this.handleSearch}
              />
            </Modal>}
          {this.state.modalVisibleFeatureSearch &&
            <Modal
              width={863}
              title={formatMessage({ id: 'App.results.searchByPic' })}
              visible={this.state.modalVisibleFeatureSearch}
              onCancel={this.hideModalFeatureSearch}
              footer={null}
            >
              <ResultFeatureSearch
                hideModal={this.hideModalFeatureSearch}
                onSearch={this.handleSearch}
              />
            </Modal>}
        </div>
      </React.Fragment>
    );
  }
}


export default (injectIntl(TaskResults));
