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
    handlefetchTasks: func.isRequired,
    // closeTasks: func.isRequired,
    // startTasks: func.isRequired,
  }
  static defaultProps = {
  }
  state = {

  }
  componentDidMount() {
  }


  // 0关闭/1开启/2暂停
  handleUpdateStatusTask = (id, status) => {
    /* const { closeTasks, startTasks } = this.props;
    if (status === 1) {
      closeTasks({ ids: id });
    } else if (status === 0 || status === 2) {
      startTasks({ originTaskId: id });
    } */
  }
  deleteTasks=ids => {
    const { deleteTasks, intl, handlefetchTasks } = this.props;

    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });

    const title = (
      <span>
        {msg}
      </span>);
    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteTasks(ids.join(',')).then(({ response }) => {
          if (response) {
            message.success(intl.formatMessage({ id: 'App.message.delete.success' }));
            handlefetchTasks();
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
        title: '任务名',
        dataIndex: 'taskName',
        key: 'taskName',
      }, {
        title: '任务类型',
        dataIndex: 'type',
        key: 'type',
      }, {
        title: '基础任务',
        dataIndex: 'originalTaskName',
        key: 'originalTaskName',
      }, {
        title: '摄像头',
        dataIndex: 'camera',
        key: 'camera',
      }, {
        title: '持续运行时间',
        dataIndex: 'time',
        key: 'time',
      }, {
        title: '任务状态',
        dataIndex: 'taskStatus',
        key: 'taskStatus',
      }, {
        title: '结果数量',
        dataIndex: 'count',
        key: 'count',
      }, {
        title: '操作',
        dataIndex: 'setting',
        key: 'setting',
        render: () => (
          <button className="tablelink pl-0 pr-0">
            设置
          </button>
        ),
      }, {
        title: '结果',
        dataIndex: 'result',
        key: 'result',
        render: () => (
          <button className="tablelink pl-0 pr-0">
            查看
          </button>
        ),
      },
      {
        title: intl.formatMessage({ id: 'App.public.switch' }),
        dataIndex: 'switchStatus',
        key: 'switchStatus',
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
