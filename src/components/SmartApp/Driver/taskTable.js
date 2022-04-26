import React, { PureComponent } from 'react';
import { array, object, func } from 'prop-types';
import { Button, Table, Icon, Switch, message, Modal } from 'antd';
import { injectIntl } from 'react-intl';


class TaskTable extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    tasksMeta: object.isRequired,
    tasks: object.isRequired,
    selectedRowKeys: array.isRequired,
    onSelectChange: func.isRequired,
    onPaginationChange: func.isRequired,
    deleteTasks: func.isRequired,
    handlefetchVehicleTasks: func.isRequired,
    closeTasks: func.isRequired,
    startTasks: func.isRequired,
  }
  static defaultProps = {
  }
  state = {

  }
  componentDidMount() {
  }


  // 0关闭/1开启/2暂停
  handleUpdateStatusTask = (id, status) => {
    const { closeTasks, startTasks } = this.props;
    if (status === 1) {
      closeTasks({ ids: id });
    } else if (status === 0 || status === 2) {
      startTasks({ originTaskId: id });
    }
  }
  deleteTasks=ids => {
    const { deleteTasks, intl, handlefetchVehicleTasks } = this.props;

    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });

    const title = (
      <span>
        {msg}
      </span>);
    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteTasks(ids.join(',')).then(({ isOk }) => {
          if (isOk) {
            message.success('删除成功');
            handlefetchVehicleTasks();
          }
        });
      },
    });
  }

  render() {
    const {
      intl,
      selectedRowKeys,
      onSelectChange,
      tasks,
      tasksMeta,
      onPaginationChange,
    } = this.props;
    const columns = [
      {
        title: intl.formatMessage({ id: 'App.RT.taskId' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '源任务',
        dataIndex: 'originalTaskName',
        key: 'originalTaskName',
      },
      {
        title: intl.formatMessage({ id: 'App.video.status' }),
        dataIndex: 'originalTaskStatus',
        key: 'originalTaskStatus',
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
              onClick={() => this.deleteTasks([id])}
            >
              <Icon type="delete" />
            </Button>
          </div>
        ),
      },
    ];
    const dataSource = Object.keys(tasks).length ? [...Object.values(tasks)]
      .map(item => ({
        key: item.id,
        ...item,
      })) : [];

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
            ...tasksMeta,
            onChange: onPaginationChange,
          }}
        />
      </div>
    );
  }
}

export default injectIntl(TaskTable);
