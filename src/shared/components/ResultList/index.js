import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Modal, message } from 'antd';
import { injectIntl } from 'react-intl';

import Cicon from '../../../shared/components/Cicon';

import ResultDetail from '../../../shared/containers/ResultDetail';
import ResultStructSearch from '../../../shared/containers/ResultStructSearch';

import moment from 'moment';

import Filter from './Filter';
import List from './List';

import './index.css';


class ResultList extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    filter: object.isRequired,
    meta: object.isRequired,
    results: object.isRequired,
    fetchResults: func.isRequired,
    updateFilter: func.isRequired,
    deleteResults: func.isRequired,
    currTask: object.isRequired,
    clearDatas: func.isRequired,
  }

  state = {
    currResult: '', // 当前操作的结果
    modalVisible: false, // 详细信息界面
    modalVisibleStructSearch: false, // 结构化检索界面
    search: '', // 关键字
    struct: '', // 结构化以逗号分割的字符串
    page: 1, // 当前页
    pageSize: 4, // 当前页数量
    begin: '', // 开始时间
    end: '', // 结束时间
    resultBeginId: '', // 结果开始ID
    resultEndId: '', // 结果结束ID
    selectedKeys: [], // 选中ID
    delSize: 0, // 一个用户删除个数，用来避免最后一页删除后，还是请求的没有用的
    isReset: false, // 是否显示重置刷新按钮
  }

  componentDidMount() {
    this.handleFetchResults();
  }

  componentWillUnmount() {
    const { clearDatas } = this.props;
    clearDatas('results');
  }

  handleFetchResults = () => {
    const { fetchResults, meta, currTask } = this.props;
    const {
      search, struct, page, pageSize, begin, end, resultBeginId, resultEndId, delSize,
    } = this.state;

    let pageTemp = Math.ceil((meta.total - delSize) / pageSize);
    pageTemp = page > pageTemp ? (page - 1) : page;
    pageTemp = pageTemp <= 0 ? 1 : pageTemp;

    const filters = {
      search,
      struct,
      page: pageTemp,
      pageSize,
      begin,
      end,
      taskBeginId: currTask.id,
      taskEndId: currTask.id,
      resultBeginId,
      resultEndId,
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
      page: 1,
      begin: null,
      end: null,
      resultBeginId: '',
      resultEndId: '',
      isReset: true,
      selectedKeys: [],
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

  handleDelete = ids => {
    const self = this;
    const {
      intl, results, deleteResults,
    } = this.props;
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
    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteResults(ids)
          .then(({ isOk }) => {
            if (isOk) {
              self.setState({
                selectedKeys: [],
              });
              message.success(successMsg);
              self.handleFetchResults();
            }
          });
      },
    });
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
    const {
      intl, deleteResults, fetchResults, currTask,
    } = this.props;

    const msg = intl.formatMessage({ id: 'App.message.delete.all.warn' });
    const title = (
      <span>
        {msg}?
      </span>
    );
    const successMsg = intl.formatMessage({ id: 'App.message.delete.all.success' });

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteResults([], currTask.id)
          .then(({ isOk }) => {
            if (isOk) {
              message.success(successMsg);
              fetchResults();
            }
          });
      },
    });
  }

  // 批量删除
  handleMultiDelete = () => {
    const { selectedKeys } = this.state;

    this.handleDelete(selectedKeys);
  }

  handleSiderSelect = options => {
    this.handleSearch(options);
  }

  render() {
    const {
      meta, results, filter, currTask, intl: { formatMessage },
    } = this.props;
    const { selectedKeys, currResult, isReset } = this.state;
    return (
      <div>
        <div
          className="app-resultList"
        >
          <div style={{ marginBottom: 20 }}>
            {`${formatMessage({ id: 'App.results.taskName' })}: `}{currTask.name}&nbsp;&nbsp;&nbsp;&nbsp;
            {`${formatMessage({ id: 'App.results.resultNum' })}: `}{meta.total}&nbsp;&nbsp;&nbsp;&nbsp;
            {`${formatMessage({ id: 'App.public.deadline' })}: `}{currTask.endTime ? moment(Number(currTask.endTime)).format('YYYY-MM-DD HH:mm:ss') : formatMessage({ id: 'App.public.no' })}&nbsp;&nbsp;&nbsp;&nbsp;
            {`${formatMessage({ id: 'App.results.taskType' })}: `}{formatMessage({ id: `App.results.${currTask.type}` })}
          </div>
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
              type="primary"
              style={{ display: 'none' }}
            >
              <Cicon type="search" />{formatMessage({ id: 'App.results.searchByPic' })}
            </Button>
            <Button
              type="warn"
              icon="primary"
              disabled={selectedKeys.length === 0}
              onClick={this.handleMultiDelete}
            >
              <Cicon type="delete" />{formatMessage({ id: 'App.control.deleteMore' })}
            </Button>
            <Button
              type="danger"
              icon="primary"
              onClick={this.handleDeleteAllResults}
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
        </div>
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
      </div>
    );
  }
}


export default (injectIntl(ResultList));
