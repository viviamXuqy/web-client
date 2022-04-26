import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { Button, message, Radio, Icon, Table, Switch, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import SdkAdd from '../../../shared/containers/SdkAdd';
import { EVENT_TYPE } from '../../../constants/stats';
import Cookies from 'js-cookie';

import './index.css';

const RadioGroup = Radio.Group;

class Basics extends PureComponent {
  static propTypes = {
    meta: object.isRequired,
    fetchSdks: func.isRequired,
    sdks: object.isRequired,
    deleteSdk: func.isRequired,
    intl: object.isRequired,
    modifyWorkMode: func.isRequired,
    recoverConfig: func.isRequired,
    updateSdkStatus: func.isRequired,
  }

  state = {
    page: 1,
    pageSize: 10,
    modalVisibleSdkAdd: false,
    data: {},
    modeValue: '1', // 1高性能模式 2普通模式
    lang: 'zh-CN',
  }

  componentDidMount() {
    this.handleFetchSdks();
  }

  onChangeMode=e => {
    this.setState({
      modeValue: e.target.value,
    }, () => {
      const { modifyWorkMode } = this.props;
      modifyWorkMode({ type: e.target.value });
    });
  }
  onPaginationChange= page => {
    this.setState({
      page,
    }, () => {
      this.handleFetchSdks();
    });
  }
  onChangeConfig=type => {
    const { recoverConfig, intl } = this.props;
    const title = intl.formatMessage({ id: 'App.mode.recovery.confirm' });
    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        recoverConfig({ type }).then(({ isOk }) => {
          if (isOk) {
            const successMsg = intl.formatMessage({ id: 'App.message.recoverConfig.success' });
            message.success(successMsg);
          }
        });
      },
    });
  }
  handleAdd=() => {
    this.setState({
      modalVisibleSdkAdd: true,
      data: {},
    });
  }
  handleEdit=(text, record) => {
    this.setState({
      modalVisibleSdkAdd: true,
      data: record,
    });
  }
  hideModal = modal => {
    const nextState = {};
    nextState[modal] = false;
    this.setState({ ...nextState }, () => {
      this.handleFetchSdks();
    });
  }

  handleFetchSdks=() => {
    const { fetchSdks } = this.props;
    const { page, pageSize } = this.state;
    fetchSdks({ page, pageSize });
  }

  deleteHttp=(id, record) => {
    const { deleteSdk, intl } = this.props;
    const self = this;
    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });
    const title = (
      <span>
        {msg}&nbsp;&nbsp;{record.name}
      </span>
    );
    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteSdk(id)
          .then(({ isOk }) => {
            if (isOk) {
              message.success(successMsg);
              self.handleFetchSdks();
            }
          });
      },
    });
  }
  handleSwitchEvent=(checked, record) => {
    const { updateSdkStatus } = this.props;
    setTimeout(() => {
      updateSdkStatus(record.id, { status: checked ? 1 : 0 });
    }, 50);
  }
  render() {
    const {
      sdks, meta, intl,
    } = this.props;
    const { data, modeValue } = this.state;
    const dataSource = Object.keys(sdks).length ? [...Object.values(sdks)]
      .map(item => ({
        key: item.id,
        ...item,
      })) : [];
    const columns = [{
      title: intl.formatMessage({ id: 'App.event.id' }),
      dataIndex: 'id',
      key: 'id',
    }, {
      title: intl.formatMessage({ id: 'App.event.name' }),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: intl.formatMessage({ id: 'App.event.url' }),
      dataIndex: 'url',
      key: 'url',
    }, {
      title: intl.formatMessage({ id: 'App.event.type' }),
      dataIndex: 'type',
      key: 'type',
      render: text => <span>{EVENT_TYPE[intl.locale][text]}</span>,
    }, {
      title: intl.formatMessage({ id: 'App.control.edit' }),
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => <button className="tablelink" onClick={() => this.handleEdit(text, record)}>{intl.formatMessage({ id: 'App.control.edit' })}</button>,
    }, {
      title: intl.formatMessage({ id: 'App.public.switch' }),
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checkedChildren={intl.formatMessage({ id: 'App.public.open' })}
          unCheckedChildren={intl.formatMessage({ id: 'App.public.close' })}
          defaultChecked={status === 1}
          onChange={checked => this.handleSwitchEvent(checked, record)}
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
          >
            <Icon type="delete" />
          </Button>
        </div>
      ),
    }];
    const user = JSON.parse(Cookies.get('user'));

    return (
      <React.Fragment>
        <div className="mb-8">
          <span>{intl.formatMessage({ id: 'App.mode.workConfigurations' })}</span>
          <RadioGroup onChange={this.onChangeMode} value={modeValue} className="ml-15">
            <Radio value="1">{intl.formatMessage({ id: 'App.mode.highPerformance' })}</Radio>
            <Radio value="2">{intl.formatMessage({ id: 'App.mode.normalMode' })}</Radio>
          </RadioGroup>
        </div>
        <div>
          <span>{intl.formatMessage({ id: 'App.mode.restore' })}</span>
          <Button type="primary" className="ml-15" onClick={() => this.onChangeConfig('1')} disabled={user.role !== 'admin'}>{intl.formatMessage({ id: 'App.mode.simpleRecovery' })}</Button>
          <span>（{intl.formatMessage({ id: 'App.mode.SR.text' })}）</span>
          <Button type="primary" className="ml-15" onClick={() => this.onChangeConfig('2')} disabled={user.role !== 'admin'}>{intl.formatMessage({ id: 'App.mode.fullRecovery' })}</Button>
          <span>（{intl.formatMessage({ id: 'App.mode.FR.text' })}）</span>
        </div>
        <section className="mt-30">
          <div className="mb-8 clearfix">
            <h3 className="fl">{intl.formatMessage({ id: 'App.event.title' })}</h3>
            <Button type="primary" className="fr" onClick={this.handleAdd}><i className="anticon iconfont icon-addcamera" />{intl.formatMessage({ id: 'App.event.add' })}</Button>
          </div>
          <Table
            pagination={{
            ...meta,
                onChange: this.onPaginationChange,
            }}
            dataSource={dataSource}
            columns={columns}
          />
        </section>
        {this.state.modalVisibleSdkAdd &&
          <Modal
            width={483}
            title={Object.keys(data).length ? intl.formatMessage({ id: 'App.event.edit' }) : intl.formatMessage({ id: 'App.event.add' })}
            visible={this.state.modalVisibleSdkAdd}
            footer={null}
            onCancel={() => this.hideModal('modalVisibleSdkAdd')}
          >
            <SdkAdd
              hideModal={() => this.hideModal('modalVisibleSdkAdd')}
              data={data}
              intl={intl}
            />
          </Modal>}
      </React.Fragment>
    );
  }
}

export default (injectIntl(Basics));
