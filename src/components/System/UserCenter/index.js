import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { Button, message, Icon, Table, Switch, Modal, Rate } from 'antd';
import { injectIntl } from 'react-intl';
import UserAdd from '../../../shared/containers/UserAdd';
import Cookies from 'js-cookie';

import './index.css';

class Basics extends PureComponent {
  static propTypes = {
    meta: object.isRequired,
    fetchUsers: func.isRequired,
    deleteUser: func.isRequired,
    updateUserStatus: func.isRequired,
    intl: object.isRequired,
    users: object.isRequired,
  }

  state = {
    page: 1,
    pageSize: 10,
    modalVisibleUserSave: false,
    data: {},
  }

  componentDidMount() {
    this.handleFetchUsers();
  }

  onPaginationChange= page => {
    this.setState({
      page,
    }, () => {
      this.handleFetchUsers();
    });
  }

  handleAdd=() => {
    this.setState({
      modalVisibleUserSave: true,
      data: {},
    });
  }
  handleEdit=(text, record) => {
    this.setState({
      modalVisibleUserSave: true,
      data: record,
    });
  }
  hideModal = modal => {
    const nextState = {};
    nextState[modal] = false;
    this.setState({ ...nextState }, () => {
      this.handleFetchUsers();
    });
  }

  handleFetchUsers=() => {
    const { fetchUsers } = this.props;
    const { page, pageSize } = this.state;
    fetchUsers({ page, pageSize });
  }

  deleteHttp=(id, record) => {
    const { deleteUser, intl } = this.props;
    const self = this;
    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });
    const title = (
      <span>
        {msg}&nbsp;&nbsp;{record.username}
      </span>
    );
    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteUser(id)
          .then(({ isOk }) => {
            if (isOk) {
              message.success(successMsg);
              self.handleFetchUsers();
            }
          });
      },
    });
  }

  // 0关闭/1开启
  handleSwitchUser = (id, checked) => {
    const { updateUserStatus } = this.props;
    setTimeout(() => {
      updateUserStatus(id, { status: checked ? 1 : 0 }).then();
    });
  }

  // 以下情况不允许操作开关，按钮 a)当前登陆role为user b)当前登陆role为admin,不允许操作自己本身
  handleDisable=(user, id) => user.role === 'user' || user.id === id

  render() {
    const { users, meta, intl } = this.props;
    const { data } = this.state;
    const user = JSON.parse(Cookies.get('user'));
    const dataSource = Object.keys(users).length ? [...Object.values(users)]
      .map(item => ({
        key: item.id,
        ...item,
      })) : [];
    const columns = [{
      title: intl.formatMessage({ id: 'App.user.id' }),
      dataIndex: 'id',
      key: 'id',
    }, {
      title: intl.formatMessage({ id: 'App.user.username' }),
      dataIndex: 'username',
      key: 'username',
    }, {
      title: intl.formatMessage({ id: 'App.user.password' }),
      dataIndex: 'password',
      key: 'password',
      render: () => <span>******</span>,
      width: 110,
    }, {
      title: intl.formatMessage({ id: 'App.user.grade' }),
      dataIndex: 'grade',
      key: 'grade',
      render: (text, record) => {
        if (user.role === 'admin' && user.id === record.id) {
          return <span>{intl.formatMessage({ id: 'App.user.admin' })}</span>;
        }
        return (
          <span>
            <Rate disabled value={(text * 3) % 4} count={3} />
            {text && <span className="ant-rate-text">{text} {intl.formatMessage({ id: 'App.user.level' })}</span>}
          </span>);
      },
      width: 160,
    }, {
      title: intl.formatMessage({ id: 'App.control.edit' }),
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <button
          className="tablelink"
          onClick={() => this.handleEdit(text, record)}
          disabled={this.handleDisable(user, record.id)}
        >
          {intl.formatMessage({ id: 'App.control.edit' })}
        </button>),
      width: 80,
    }, {
      title: intl.formatMessage({ id: 'App.user.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checkedChildren={intl.formatMessage({ id: 'App.public.open' })}
          unCheckedChildren={intl.formatMessage({ id: 'App.public.close' })}
          defaultChecked={status === 1}
          onChange={checked => this.handleSwitchUser(record.id, checked)}
          disabled={this.handleDisable(user, record.id)}
        />
      ),
    }, {
      title: intl.formatMessage({ id: 'App.control.delete' }),
      dataIndex: 'id',
      key: 'del',
      render: (id, record) => (
        <div className="app-table__actions buttons-group button-delete">
          <Button
            size="small"
            type="dashed"
            onClick={() => this.deleteHttp(id, record)}
            disabled={this.handleDisable(user, id)}
          >
            <Icon type="delete" />
          </Button>
        </div>
      ),
      width: 78,
    }];
    return (
      <React.Fragment>
        <Button type="primary" className="mb-8" onClick={this.handleAdd}><i className="anticon iconfont icon-addcamera" />{intl.formatMessage({ id: 'App.user.add' })}</Button>
        <div>
          <Table
            pagination={{
            ...meta,
                onChange: this.onPaginationChange,
            }}
            dataSource={dataSource}
            columns={columns}
          />
        </div>
        {this.state.modalVisibleUserSave &&
          <Modal
            width={483}
            title={Object.keys(data).length ? intl.formatMessage({ id: 'App.user.edit' }) : intl.formatMessage({ id: 'App.user.add' })}
            visible={this.state.modalVisibleUserSave}
            footer={null}
            onCancel={() => this.hideModal('modalVisibleUserSave')}
          >
            <UserAdd
              hideModal={() => this.hideModal('modalVisibleUserSave')}
              data={data}
              intl={intl}
            />
          </Modal>}
      </React.Fragment>
    );
  }
}

export default (injectIntl(Basics));
