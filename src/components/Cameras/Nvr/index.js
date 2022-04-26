import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Modal, message, Card } from 'antd';
import { injectIntl } from 'react-intl';

import NvrAdd from '../../../shared/containers/NvrAdd';

import Sider from '../../../containers/layout/Sider';

import Cicon from '../../../shared/components/Cicon';

import Cookies from 'js-cookie';

import Table from './Table';

class Nvr extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    nvrs: object.isRequired,
    fetchNvrs: func.isRequired,
    updateFilter: func.isRequired,
    deleteNvrs: func.isRequired,
  }

  state = {
    page: 1, // 当前页
    pageSize: 14, // 当前页数量
    selectedRowKeys: [],
    delSize: 0, // 一个用户删除个数，用来避免最后一页删除后，还是请求的没有用的
    modalVisibleNvrAdd: false,
    data: {},
  }

  componentDidMount() {
    this.handleFetchNvrs();
  }

  handleFetchNvrs = () => {
    const { fetchNvrs, meta } = this.props;
    const {
      page, pageSize, delSize,
    } = this.state;

    let pageTemp = Math.ceil((meta.total - delSize) / pageSize);
    pageTemp = page > pageTemp ? (page - 1) : page;
    pageTemp = pageTemp <= 0 ? 1 : pageTemp;

    const filters = {
      page: pageTemp,
      pageSize,
    };

    this.updateFilter(filters);

    fetchNvrs();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('nvrs', values);
  }

  handleSearch = values => {
    const options = {
      page: 1,
      selectedRowKeys: [],
      ...values,
    };
    this.setState({
      ...options,
    }, () => {
      this.handleFetchNvrs();
    });
  }

  handlePaginationClick = page => {
    this.setState({
      page,
      selectedRowKeys: [],
    }, () => {
      this.handleFetchNvrs();
    });
  }

  handleDelete = ids => {
    const self = this;
    const {
      intl, nvrs, deleteNvrs,
    } = this.props;
    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });

    this.setState({
      delSize: ids.length,
    });

    const nvrsTemp = [];
    ids.forEach(id => {
      const nvr = nvrs.get(id);
      if (nvr && !nvrsTemp.some(item => item.id === nvr.id)) {
        nvrsTemp.push(nvr);
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
        deleteNvrs(ids)
          .then(({ isOk }) => {
            if (isOk) {
              self.setState({
                selectedRowKeys: [],
              });
              message.success(successMsg);
              self.handleFetchNvrs();
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

  handleAdd = () => {
    this.setState({
      modalVisibleNvrAdd: true,
      data: {},
    });
  }

  handleEdit = (text, record) => {
    this.setState({
      modalVisibleNvrAdd: true,
      data: record,
    });
  }

  hideModal = modal => {
    const nextState = {};
    nextState[modal] = false;
    this.setState({ ...nextState });
  }

  render() {
    const {
      meta, nvrs, intl: { formatMessage },
    } = this.props;
    const { selectedRowKeys, data } = this.state;
    const user = JSON.parse(Cookies.get('user'));
    return (
      <React.Fragment>
        <Sider selectedKey="cameras-nvr" />
        <div className="app-page">
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">
              {formatMessage({ id: 'App.cameras.nvr' })}
            </h1>
            <div className="app-page__actions buttons-group">
              <Button
                type="primary"
                onClick={this.handleAdd}
                disabled={user.grade === '3'}
              >
                <Cicon type="addcamera" />{formatMessage({ id: 'App.cameras.nvr.add' })}
              </Button>
              <Button
                type="warn"
                icon="primary"
                disabled={user.grade === '3' || selectedRowKeys.length === 0}
                onClick={this.handleMultiDelete}
              >
                <Cicon type="delete" />{formatMessage({ id: 'App.control.deleteSelect' })}
              </Button>
            </div>
            <Table
              nvrs={nvrs}
              meta={meta}
              deleteNvrs={this.handleDelete}
              onSelectChange={this.handleRowSelect}
              selectedRowKeys={selectedRowKeys}
              onPaginationChange={this.handlePaginationClick}
              onEdit={this.handleEdit}
            />
          </Card>
        </div>
        {this.state.modalVisibleNvrAdd &&
          <Modal
            width={483}
            title={Object.keys(data).length ? formatMessage({ id: 'App.cameras.nvr.edit' }) : formatMessage({ id: 'App.cameras.nvr.add' })}
            visible={this.state.modalVisibleNvrAdd}
            footer={null}
            onCancel={() => this.hideModal('modalVisibleNvrAdd')}
          >
            <NvrAdd
              hideModal={() => this.hideModal('modalVisibleNvrAdd')}
              data={data}
            />
          </Modal>}
      </React.Fragment>
    );
  }
}


export default (injectIntl(Nvr));
