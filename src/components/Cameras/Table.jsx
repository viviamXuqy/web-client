import React from 'react';
import { array, object, func } from 'prop-types';
import { Button, Table, Icon, Switch, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import Cookies from 'js-cookie';

class CameraTable extends React.PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    cameras: object.isRequired,
    selectedRowKeys: array.isRequired,
    onSelectChange: func.isRequired,
    showCameraSet: func.isRequired, // 设置窗口
    deleteCameras: func.isRequired,
    handleChange: func.isRequired,
    updateCameraRec: func.isRequired,
    handleFetchCameras: func.isRequired,
    getTasknum: func.isRequired,
  }
  // 0关闭/1开启
  handleUpdateCameraRec = (record, checked) => {
    const {
      updateCameraRec, handleFetchCameras, getTasknum, intl,
    } = this.props;
    const data = { states: [{ id: record.id, state: checked ? 1 : 0 }] };
    if (!checked) {
      getTasknum(record.id).then(({ response }) => {
        if (response) {
          const titleTask = intl.locale === 'zh-CN' ? '' : (response > 1 ? 'tasks' : 'task'); // eslint-disable-line no-nested-ternary
          const title = intl.formatMessage({ id: 'App.ipc.closeCamera.message.num' }, { num: response, task: titleTask });
          Modal.confirm({
            title,
            okType: 'danger',
            onOk() {
              updateCameraRec(data).then().then(() => handleFetchCameras());
            },
          });
        } else {
          updateCameraRec(data).then().then(() => handleFetchCameras());
        }
      });
    } else {
      updateCameraRec(data).then().then(() => handleFetchCameras());
    }
  }

  render() {
    const {
      intl: { formatMessage },
      meta,
      selectedRowKeys,
      onSelectChange,
      showCameraSet,
      deleteCameras,
      handleChange,
    } = this.props;
    const { cameras } = this.props;
    const user = JSON.parse(Cookies.get('user'));
    const columns = [
      {
        title: formatMessage({ id: 'App.ipc.checkpoint' }),
        dataIndex: 'bayonetName',
        key: 'bayonetName',
        render: (bayonetName, record) => (
          <span>{(record.type && +record.type === 2) ? formatMessage({ id: 'App.ipc.add.InCamera' }) : (bayonetName || '-')}</span>
        ),
      },
      {
        title: formatMessage({ id: 'App.ipc.cameraName' }),
        dataIndex: 'name',
        key: 'name',
        sorter: true,
      },
      {
        title: formatMessage({ id: 'App.ipc.deviceType' }),
        dataIndex: 'deviceType',
        key: 'deviceType',
        sorter: true,
        render: deviceType => (
          <span>{deviceType ? formatMessage({ id: `App.public.device.type.${deviceType}` }) : '-'}</span>
        ),
      },
      {
        title: formatMessage({ id: 'App.ipc.ip' }),
        dataIndex: 'ip',
        key: 'ip',
        sorter: true,
        render: ip => (
          <span>{ip || '-'}</span>
        ),
      },
      {
        title: formatMessage({ id: 'App.ipc.port' }),
        dataIndex: 'port',
        key: 'port',
        sorter: true,
        render: port => (
          <span>{port || '-'}</span>
        ),
      },
      {
        title: formatMessage({ id: 'App.ipc.switch' }),
        dataIndex: 'state',
        key: 'state',
        render: (state, record) => (
          <Switch
            key={record.id}
            checkedChildren={formatMessage({ id: 'App.public.open' })}
            unCheckedChildren={formatMessage({ id: 'App.public.close' })}
            checked={state === 1}
            onChange={checked => this.handleUpdateCameraRec(record, checked)}
            disabled={user.grade === '3'}
          />),
      },
      {
        title: formatMessage({ id: 'App.ipc.camera.setting' }),
        key: 'set',
        render: (text, record) => (
          <div className="app-table__actions buttons-group">
            <button onClick={() => showCameraSet(text, record)} className="tablelink" disabled={user.grade === '3'}>{formatMessage({ id: 'App.control.set' })}</button>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'App.control.delete' }),
        dataIndex: 'id',
        render: id => (
          <div className="app-table__actions buttons-group button-delete">
            <Button
              size="small"
              type="dashed"
              onClick={() => deleteCameras([id])}
              disabled={user.grade === '3'}
            >
              <Icon type="delete" />
            </Button>
          </div>
        ),
      },
    ];
    const dataSource = [...cameras.keys()]
      .slice(0, meta.pageSize)
      .map(id => ({
        key: id,
        ...cameras.get(id),
      }));

    return (
      <div>
        <Table
          className="app-table"
          columns={columns}
          dataSource={dataSource}
          onChange={handleChange}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={{
            ...meta,
          }}
        />
      </div>
    );
  }
}

export default injectIntl(CameraTable);
