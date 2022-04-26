import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Modal, message, Card } from 'antd';
import { injectIntl } from 'react-intl';

import Sider from '../../../containers/layout/Sider';

import Cicon from '../../../shared/components/Cicon';

import Filter from './Filter';
import Table from './Table';

class Log extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    filter: object.isRequired,
    meta: object.isRequired,
    replace: func.isRequired,
    logs: object.isRequired,
    fetchLogs: func.isRequired,
    updateFilter: func.isRequired,
    deleteLogs: func.isRequired,
  }

  state = {
    funType: 0, // 日志类型1
    doType: 0, // 日志类型2
    page: 1, // 当前页
    pageSize: 14, // 当前页数量
    begin: '', // 开始时间
    end: '', // 结束时间
    selectedRowKeys: [],
    delSize: 0, // 一个用户删除个数，用来避免最后一页删除后，还是请求的没有用的
    isReset: false, // 是否显示重置刷新按钮
  }

  componentDidMount() {
    this.handleFetchLogs();
  }

  handleFetchLogs = () => {
    const { fetchLogs, meta } = this.props;
    const {
      funType, doType, page, pageSize, begin, end, delSize,
    } = this.state;

    let pageTemp = Math.ceil((meta.total - delSize) / pageSize);
    pageTemp = page > pageTemp ? (page - 1) : page;
    pageTemp = pageTemp <= 0 ? 1 : pageTemp;

    const filters = {
      funType,
      doType,
      page: pageTemp,
      pageSize,
      begin,
      end,
    };

    this.updateFilter(filters);

    fetchLogs();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('logs', values);
  }

  handleSearch = values => {
    const options = {
      funType: 0,
      doType: '',
      page: 1,
      begin: null,
      end: null,
      isReset: true,
      selectedRowKeys: [],
      ...values,
    };
    this.setState({
      ...options,
    }, () => {
      this.handleFetchLogs();
    });
  }

  handleReset = () => {
    this.handleSearch({ isReset: false });
  }

  handlePaginationClick = page => {
    this.setState({
      page,
      selectedRowKeys: [],
    }, () => {
      this.handleFetchLogs();
    });
  }

  handleDelete = ids => {
    const self = this;
    const {
      intl, logs, deleteLogs,
    } = this.props;
    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });

    this.setState({
      delSize: ids.length,
    });

    const logsTemp = [];
    ids.forEach(id => {
      const log = logs.get(id);
      if (log && !logsTemp.some(item => item.id === log.id)) {
        logsTemp.push(log);
      }
    });
    const title = (
      <span>
        {msg}?
      </span>
    );
    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteLogs(ids)
          .then(({ isOk }) => {
            if (isOk) {
              self.setState({
                selectedRowKeys: [],
              });
              message.success(successMsg);
              self.handleFetchLogs();
            }
          });
      },
    });
  }

  handleRowSelect = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  }

  // 批量删除
  handleMultiDelete = () => {
    const { selectedRowKeys } = this.state;

    this.handleDelete(selectedRowKeys);
  }

  render() {
    const {
      meta, logs, filter, intl: { formatMessage }, replace,
    } = this.props;
    const { selectedRowKeys, isReset } = this.state;
    return (
      <React.Fragment>
        <Sider selectedKey="system-log" />
        <div className="app-page">
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">
              {formatMessage({ id: 'App.system.log' })}
            </h1>
            <Filter
              filter={filter}
              onSearch={this.handleSearch}
            />
            <div className="app-page__actions buttons-group">
              <Button
                type="warn"
                icon="primary"
                disabled={selectedRowKeys.length === 0}
                onClick={this.handleMultiDelete}
              >
                <Cicon type="delete" />{formatMessage({ id: 'App.control.deleteMore' })}
              </Button>
              <Button
                style={{ display: (isReset ? '' : 'none') }}
                type="primary"
                onClick={this.handleReset}
              >
                <Cicon type="therefresh" />{formatMessage({ id: 'App.control.reset' })}
              </Button>
            </div>
            <Table
              logs={logs}
              meta={meta}
              deleteLogs={this.handleDelete}
              onSelectChange={this.handleRowSelect}
              selectedRowKeys={selectedRowKeys}
              onPaginationChange={this.handlePaginationClick}
              replace={replace}
            />
          </Card>
        </div>
      </React.Fragment>
    );
  }
}


export default (injectIntl(Log));
