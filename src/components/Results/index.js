import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Modal, message, Card } from 'antd';
import { injectIntl } from 'react-intl';

import Sider from '../../containers/layout/Sider';

import Cicon from '../../shared/components/Cicon';

import ResultDetail from '../../shared/containers/ResultDetail';
import ResultStructSearch from '../../shared/containers/ResultStructSearch';
import ResultFeatureSearch from '../../shared/components/ResultFeatureSearch';
import ResultSearch from '../../shared/containers/ResultSearch';

import Cookies from 'js-cookie';

import Filter from './Filter';
import List from './List';

import './index.less';

class Result extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    filter: object.isRequired,
    meta: object.isRequired,
    results: object.isRequired,
    fetchResults: func.isRequired,
    updateFilter: func.isRequired,
    deleteResults: func.isRequired,
    deleteAllResults: func.isRequired,
    clearDatas: func.isRequired,
  }

  state = {
    currResult: '', // 当前操作的结果
    modalVisible: false, // 详细信息界面
    modalVisibleStructSearch: false, // 结构化检索界面
    modalVisibleFeatureSearch: false, // 以图搜图检索界面
    search: '', // 关键字
    struct: '', // 结构化以逗号分割的字符串
    target: '',
    page: 1, // 当前页
    pageSize: 8, // 当前页数量
    begin: '', // 开始时间
    end: '', // 结束时间
    taskBeginId: '', // 任务开始ID
    taskEndId: '', // 任务结束ID
    selectedKeys: [], // 选中ID
    delSize: 0, // 一个用户删除个数，用来避免最后一页删除后，还是请求的没有用的
    isReset: false, // 是否显示重置刷新按钮
    modalVisibleSearch: false, // 高级检索
    camera: '', // 摄像机列表
  }

  componentDidMount() {
    this.handleFetchResults();
  }

  componentWillUnmount() {
    const { clearDatas } = this.props;
    clearDatas('results');
  }

  handleFetchResults = () => {
    const { fetchResults, meta } = this.props;
    const {
      search, struct, target, page, pageSize, begin, end, taskBeginId, taskEndId, delSize, camera,
    } = this.state;

    let pageTemp = Math.ceil((meta.total - delSize) / pageSize);
    pageTemp = page > pageTemp ? (page - 1) : page;
    pageTemp = pageTemp <= 0 ? 1 : pageTemp;

    const filters = {
      search,
      struct,
      target,
      page: pageTemp,
      pageSize,
      begin,
      end,
      taskBeginId,
      taskEndId,
      camera,
    };

    this.updateFilter(filters);

    fetchResults();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('results', values);
  }

  handleSearch = values => {
    const options = {
      search: '',
      struct: '',
      target: '',
      page: 1,
      begin: null,
      end: null,
      taskBeginId: '',
      taskEndId: '',
      isReset: true,
      selectedKeys: [],
      camera: '',
      ...values,
    };
    this.setState({
      ...options,
    }, () => {
      this.handleFetchResults();
    });
  }

  handleReset = () => {
    this.handleSearch({ isReset: false });
  }

  handlePaginationClick = page => {
    this.setState({
      page,
      selectedKeys: [],
    }, () => {
      this.handleFetchResults();
    });
  }

  showModal = record => {
    this.setState({
      currResult: record,
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
  hideModalSearch = () => {
    this.setState({
      modalVisibleSearch: false,
    });
  }
  handleDelete = ids => {
    const { intl, results } = this.props;
    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });

    this.setState({
      delSize: ids.length,
    });

    const resultsTemp = [];
    ids.forEach(id => {
      const result = results.get(id);
      if (result && !resultsTemp.some(item => item.taskId === result.taskId)) {
        resultsTemp.push(result);
      }
    });
    const title = (
      <span>
        {msg}?&nbsp;&nbsp;
        {/**
        {resultsTemp.map(item =>
          <span key={item.taskId}>任务编号：{item.taskId}&nbsp;&nbsp;
          <Tag color="orange">{item.taskName}</Tag></span>)}？
         */}
      </span>
    );

    const self = this;

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        self.deleteResults(ids);
      },
    });
  }

  deleteResults = async ids => {
    const { intl, deleteResults } = this.props;

    const self = this;

    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    const { isOk } = await deleteResults(ids);

    if (isOk) {
      self.setState({
        selectedKeys: [],
      });
      message.success(successMsg);
      self.handleFetchResults();
    }
  }

  handleSelect = id => {
    const { selectedKeys } = this.state;
    if (selectedKeys.some(idTemp => idTemp === id)) {
      selectedKeys.splice(selectedKeys.findIndex(i => i === id), 1);
    } else {
      selectedKeys.push(id);
    }

    this.setState({
      selectedKeys: selectedKeys.slice(0),
    });
  }

  handleDeleteAllResults = () => {
    const { intl } = this.props;

    const msg = intl.formatMessage({ id: 'App.message.delete.all.warn' });
    const title = (
      <span>
        {msg}?
      </span>
    );

    const self = this;

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        self.deleteAllResults();
      },
    });
  }

  deleteAllResults = async () => {
    const { intl, deleteAllResults, fetchResults } = this.props;

    const successMsg = intl.formatMessage({ id: 'App.message.delete.all.success' });

    const { isOk } = await deleteAllResults();

    if (isOk) {
      message.success(successMsg);
      fetchResults();
    }
  }

  // 批量删除
  handleMultiDelete = () => {
    const { selectedKeys } = this.state;

    this.handleDelete(selectedKeys);
  }

  // 高级检索
  showModalSearch = () => {
    this.setState({
      modalVisibleSearch: true,
    });
  }

  render() {
    const {
      meta, results, filter, intl: { formatMessage },
    } = this.props;
    const { selectedKeys, currResult, isReset } = this.state;
    const user = JSON.parse(Cookies.get('user'));
    return (
      <React.Fragment>
        <Sider selectedKey="results-resultsList" />
        <div className="app-page">
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">
              {formatMessage({ id: 'App.results.resultList' })}
            </h1>
            <Filter
              filter={filter}
              onSearch={this.handleSearch}
            />
            <div className="app-page__actions buttons-group">
              <Button
                type="primary"
                onClick={this.showModalSearch}
              >
                <Cicon type="structuredsearc" />{formatMessage({ id: 'App.person.struct.search' })}
              </Button>
              {/* <Button
                type="primary"
                onClick={this.showModalStructSearch}
              >
                <Cicon type="structuredsearc" />{formatMessage({ id: 'App.results.structSearch' })}
              </Button>
              <Button
                type="primary"
                onClick={this.showModalFeatureSearch}
              >
                <Cicon type="search" />{formatMessage({ id: 'App.results.searchByPic' })}
              </Button> */}
              <Button
                type="warn"
                icon="primary"
                disabled={user.grade === '3' || selectedKeys.length === 0}
                onClick={this.handleMultiDelete}
              >
                <Cicon type="delete" />{formatMessage({ id: 'App.control.deleteMore' })}
              </Button>
              <Button
                type="danger"
                icon="primary"
                onClick={this.handleDeleteAllResults}
                disabled={user.grade === '3'}
              >
                <Cicon type="delete" />{formatMessage({ id: 'App.control.clear' })}
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
              results={results}
              meta={meta}
              onDelete={this.handleDelete}
              onSelect={this.handleSelect}
              showResultDetail={this.showModal}
              selectedKeys={selectedKeys}
              onPaginationChange={this.handlePaginationClick}
            />
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
          {this.state.modalVisibleSearch &&
            <Modal
              width={1128}
              title={formatMessage({ id: 'App.person.struct.search' })}
              visible={this.state.modalVisibleSearch}
              onCancel={this.hideModalSearch}
              footer={null}
            >
              <ResultSearch
                hideModal={this.hideModalSearch}
                onSearch={this.handleSearch}
              />
            </Modal>}
        </div>
      </React.Fragment>
    );
  }
}


export default (injectIntl(Result));
