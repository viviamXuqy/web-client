import React, { PureComponent } from 'react';
import { array, object, func } from 'prop-types';
import { Button, Table, Icon, Switch } from 'antd';
import { injectIntl } from 'react-intl';

import moment from 'moment';
import { TASK_TYPE } from '../../constants/config';

import { getTime } from '../../utils';

// ['2,1529355966000,1529420950000', '3,1529355966000,1529420950000']
function Duration(props) {
  const { duration: { duration }, intl } = props;
  let element = '';
  let timeType = '1';
  if (duration && duration !== undefined && duration.length > 0) {
    timeType = duration[0].toString().split(',')[0].toString();
  }

  if (timeType === '1') {
    element = (<span>{intl.formatMessage({ id: 'App.RT.add.forever' })}</span>);
  } else {
    element = duration.map((item, index) => (
      <div style={{ fontSize: 12 }} key={index.toString()}>
        <DurationItem intl={intl} item={item} />
      </div>
    ));
  }
  return element;
}

function DurationItem(props) {
  const item = props.item.toString().split(',');
  const type = Number(item[0] || 1);
  const startTime = Number(item[1] || 0);
  const endTime = Number(item[2] || 0);
  const date = moment(moment(startTime).format('YYYY-MM-DD')).valueOf();

  let element = '';

  if (type === 2) {
    element = (<div>{props.intl.formatMessage({ id: 'App.RT.add.everyday' })}&nbsp;{getTime(startTime / 1000, 'HH:mm')}-{getTime(endTime / 1000, 'HH:mm')}</div>);
  } else {
    element = (<div>{moment(startTime).format('YYYY/MM/DD')}&nbsp;{getTime((startTime - date) / 1000, 'HH:mm')}-{getTime((endTime - date) / 1000, 'HH:mm')}</div>);
  }

  return (
    element
  );
}

class TaskTable extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    tasks: object.isRequired,
    selectedRowKeys: array.isRequired,
    onSelectChange: func.isRequired,
    onPaginationChange: func.isRequired,
    showCameraSet: func.isRequired, // 设置区域窗口
    showTaskSet: func.isRequired, // 设置任务窗口
    deleteTasks: func.isRequired,
    updateStatusTask: func.isRequired,
  }

  showCameraSet = (text, record) => {
    const { showCameraSet } = this.props;
    const {
      cameraId, area, ratio, cameraName, bayonetName,
    } = record;

    const currCamera = {
      id: cameraId,
      area,
      ratio,
      name: cameraName,
      bayonetName,
    };

    showCameraSet(text, currCamera);
  }

  // 0关闭/1开启/2暂停
  handleUpdateStatusTask = (id, status) => {
    const { updateStatusTask } = this.props;
    updateStatusTask(id, { type: TASK_TYPE.ANALYSIS, status: status === 0 ? 1 : 0 });
  }

  render() {
    const {
      intl,
      tasks,
      meta,
      selectedRowKeys,
      onSelectChange,
      onPaginationChange,
      deleteTasks,
      showTaskSet,
    } = this.props;
    const columns = [
      {
        title: intl.formatMessage({ id: 'App.RT.taskId' }),
        dataIndex: 'id',
        key: 'id',
        width: 178,
      },
      {
        title: intl.formatMessage({ id: 'App.RT.taskName' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: intl.formatMessage({ id: 'App.RT.checkpoint' }),
        dataIndex: 'bayonetName',
        key: 'bayonetName',
        width: 120,
      },
      {
        title: intl.formatMessage({ id: 'App.RT.camera' }),
        dataIndex: 'cameraName',
        key: 'cameraName',
      },
      {
        title: intl.formatMessage({ id: 'App.RT.time' }),
        dataIndex: 'duration',
        key: 'duration',
        className: 'nowrap',
        render: (text, record) => (
          <Duration intl={intl} duration={record} />
        ),
      },
      {
        title: intl.formatMessage({ id: 'App.RT.taskSetting' }),
        key: 'taskSet',
        render: (text, record) => (
          <div className="app-table__actions buttons-group">
            <button onClick={() => showTaskSet(text, record)} className="tablelink">{intl.formatMessage({ id: 'App.control.set' })}</button>
          </div>
        ),
      },
      {
        title: intl.formatMessage({ id: 'App.RT.cameraSetting' }),
        key: 'set',
        render: (text, record) => (
          <div className="app-table__actions buttons-group">
            <button onClick={() => this.showCameraSet(text, record)} className="tablelink">{intl.formatMessage({ id: 'App.control.set' })}</button>
          </div>
        ),
      },
      {
        title: intl.formatMessage({ id: 'App.public.switch' }),
        dataIndex: 'status',
        key: 'status',
        render: (status, record) => (
          <Switch
            checkedChildren={intl.formatMessage({ id: 'App.public.open' })}
            unCheckedChildren={intl.formatMessage({ id: 'App.public.close' })}
            checked={status === 1}
            onChange={() => this.handleUpdateStatusTask(record.id, status)}
          />
        ),
        width: 100,
      },
      {
        title: intl.formatMessage({ id: 'App.control.delete' }),
        dataIndex: 'id',
        key: 'closeTask',
        render: id => (
          <div className="app-table__actions buttons-group button-delete">
            <Button
              size="small"
              type="dashed"
              onClick={() => deleteTasks([id])}
            >
              <Icon type="delete" />
            </Button>
          </div>
        ),
        width: 78,
      },
    ];
    const dataSource = [...tasks.keys()]
      .slice(0, meta.pageSize)
      .map(id => ({
        key: id,
        ...tasks.get(id),
      }));

    return (
      <div>
        <Table
          className="realtime-analysis-table"
          columns={columns}
          dataSource={dataSource}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={{
            ...meta,
            onChange: onPaginationChange,
          }}
        />
      </div>
    );
  }
}

export default injectIntl(TaskTable);
