import React, { PureComponent } from 'react';
import { array, object, func } from 'prop-types';
import { Button, Table, Icon, Switch, message } from 'antd';
import { injectIntl } from 'react-intl';

import { TASK_TYPE } from '../../../constants/config';

// 处理server端返回的
function getStatus(item) {
  const { status } = item;
  let { progress } = item;
  progress = progress ? Number(progress) : -1;
  let statusTemp = status;
  if (progress === -3) {
    statusTemp = -3; // -3代表进行中，且没有进度条
  } else if (progress <= -2 || progress > 100) {
    statusTemp = -1; // -1代表错误
  } else if (progress === -1) {
    statusTemp = 0; // 0代表等待开始
  } else if (progress === 100) {
    statusTemp = 3; // 3代表完成
  }
  statusTemp = (statusTemp < -3 || statusTemp > 3) ? -1 : statusTemp;

  return statusTemp;
}

function StatusProgress(props) {
  const { progress } = props.item;
  let element = '';
  const status = getStatus(props.item);
  const { intl } = props;
  if (status === -3) {
    element = (<span>{intl.formatMessage({ id: 'App.picture.status.going' })}</span>);
  } else if (status === -1) {
    element = (<span style={{ color: '#DD575E' }}>{intl.formatMessage({ id: 'App.picture.status.error' })}</span>);
  } else if (status === 3) {
    element = (<span style={{ color: '#7ED321' }}>{intl.formatMessage({ id: 'App.picture.status.complete' })}</span>);
  } else if (status === 1) {
    element = (<span>{progress}%</span>);
  } else if (status === 2) {
    element = (<span>{intl.formatMessage({ id: 'App.picture.status.pause' })}</span>);
  } else if (status === 0) {
    element = (<span>{intl.formatMessage({ id: 'App.picture.status.wait' })}</span>);
  }

  return element;
}

class TaskTable extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    tasks: object.isRequired,
    selectedRowKeys: array.isRequired,
    onSelectChange: func.isRequired,
    onPaginationChange: func.isRequired,
    deleteTasks: func.isRequired,
    updateStatusTask: func.isRequired,
    onRowClick: func.isRequired,
  }

  // 0关闭/1开启/2暂停
  handleUpdateStatusTask = item => {
    const statusTemp = getStatus(item);
    if (statusTemp === -1) {
      message.warn(this.props.intl.formatMessage({ id: 'App.error.61' }));
      return;
    }
    const { id } = item;
    const { updateStatusTask } = this.props;
    updateStatusTask(id, { type: TASK_TYPE.VIDEO, status: statusTemp === 1 ? 2 : 1 });
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
      onRowClick,
    } = this.props;
    const columns = [
      {
        title: intl.formatMessage({ id: 'App.RT.taskId' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: intl.formatMessage({ id: 'App.RT.taskName' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: intl.formatMessage({ id: 'App.video.source' }),
        dataIndex: 'resourceName',
        key: 'resourceName',
      },
      {
        title: intl.formatMessage({ id: 'App.video.status' }),
        dataIndex: 'progress',
        key: 'progress',
        className: 'nowrap',
        render: (text, record) => (
          <StatusProgress item={record} intl={intl} />
        ),
      },
      {
        title: intl.formatMessage({ id: 'App.video.result' }),
        key: 'result',
        className: 'nowrap',
        render: (text, record) => (
          <div className="app-table__actions buttons-group">
            <button onClick={() => onRowClick(record)} className="tablelink">{intl.formatMessage({ id: 'App.control.view' })}</button>
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
            checked={getStatus(record) === 1}
            disabled={getStatus(record) === 3}
            onChange={() => this.handleUpdateStatusTask(record)}
          />
        ),
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
          className="app-table"
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
