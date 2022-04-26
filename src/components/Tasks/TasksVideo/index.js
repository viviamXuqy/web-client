import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Modal, message, Card, Tag } from 'antd';
import { injectIntl } from 'react-intl';
import Sider from '../../../containers/layout/Sider';

import Cmodal from '../../../shared/components/Cmodal';
import Cicon from '../../../shared/components/Cicon';
import TaskVideoAdd from '../../../shared/containers/TaskVideoAdd';
import { TASK_TYPE } from '../../../constants/config';
import ResultList from '../../../shared/containers/ResultList';

import Table from './Table';

import './index.css';

class TasksVideo extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    // filter: object.isRequired,
    meta: object.isRequired,
    tasks: object.isRequired,
    fetchTasks: func.isRequired,
    deleteTasks: func.isRequired,
    updateFilter: func.isRequired,
    updateStatusTask: func.isRequired,
    updateStatusLotTask: func.isRequired,
    deleteAllTasks: func.isRequired,
  }

  state = {
    modalVisibleTaskAdd: false, // 创建任务界面
    modalVisibleCmodal: false,
    selectedRowKeys: [],
    page: 1, // 当前页
    pageSize: 14, // 当前页数量
    delSize: 0, // 一个用户删除个数，用来避免最后一页删除后，还是请求的没有用的
    currTask: {}, // 当前row的任务
  }

  componentDidMount() {
    this.handleFetchTasks();
    this.timerId = setInterval(
      () => this.handleFetchTasks(true), 5000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  handleFetchTasks = suppressLoading => {
    const { fetchTasks, meta } = this.props;
    const {
      page, pageSize, delSize,
    } = this.state;

    let pageTemp = Math.ceil((meta.total - delSize) / pageSize);
    pageTemp = page > pageTemp ? (page - 1) : page;
    pageTemp = pageTemp <= 0 ? 1 : pageTemp;

    const filters = {
      page: pageTemp,
      pageSize,
      type: TASK_TYPE.VIDEO, // 任务类型（1实时，2视频，3图集
      suppressLoading,
    };

    this.updateFilter(filters);

    fetchTasks();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('tasks', values);
  }

  handlePaginationClick = page => {
    this.setState({
      page,
      selectedRowKeys: [],
    }, () => {
      this.handleFetchTasks();
    });
  }

  showModalTaskAdd = () => {
    this.setState({
      modalVisibleTaskAdd: true,
    });
  }

  hideModalTaskAdd = () => {
    this.setState({
      modalVisibleTaskAdd: false,
      selectedRowKeys: [],
    });
    this.handleFetchTasks();
  }

  showModalCmodal = () => {
    this.setState({
      modalVisibleCmodal: true,
    });
  }

  hideModalCmodal = () => {
    this.setState({
      modalVisibleCmodal: false,
    });
  }

  handleDelete = id => {
    const self = this;
    const {
      intl, tasks, deleteTasks,
    } = this.props;

    this.setState({
      delSize: 1,
    });

    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });
    const title = (
      <span>
        {msg}&nbsp;&nbsp;
        {id.map(idTemp => {
          const task = tasks.get(idTemp);

          return task && <span key={idTemp}>{intl.formatMessage({ id: 'App.RT.taskId' })}：{task.id}&nbsp;&nbsp;<Tag color="orange">{task.name}</Tag></span>;
        })}?
      </span>
    );
    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteTasks(id, [TASK_TYPE.VIDEO])
          .then(({ isOk }) => {
            if (isOk) {
              self.setState({
                selectedRowKeys: [],
              });
              message.success(successMsg);
              self.handleFetchTasks();
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

  // 关闭选中任务,是暂停不是删除
  handleMultiStop = () => {
    const { updateStatusLotTask, tasks, intl } = this.props;
    const { selectedRowKeys } = this.state;

    const statusArr = [];
    selectedRowKeys.forEach(id => {
      const task = tasks.get(id);
      if (task && task.status === 1) {
        statusArr.push({ id, state: 2 });
      }
    });

    const self = this;

    updateStatusLotTask({ tasks: statusArr, type: TASK_TYPE.VIDEO })
      .then(({ isOk }) => {
        if (isOk) {
          self.setState({
            selectedRowKeys: [],
          });
          message.success(intl.formatMessage({ id: 'App.message.pause.success' }));
          self.handleFetchTasks();
        }
      });

    this.hideModalCmodal();
  }

  handleMultiDelete = () => {
    const { intl, deleteTasks } = this.props;
    const { selectedRowKeys } = this.state;

    const self = this;

    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    deleteTasks(selectedRowKeys, [TASK_TYPE.VIDEO])
      .then(({ isOk }) => {
        if (isOk) {
          self.setState({
            selectedRowKeys: [],
          });
          message.success(successMsg);
          self.handleFetchTasks();
        }
      });
    this.hideModalCmodal();
  }

  // 清空任务，是删除所有
  handleClear = () => {
    const { intl, deleteAllTasks } = this.props;

    const msg = intl.formatMessage({ id: 'App.message.delete.all.warn' });
    const title = (
      <span>
        {msg}?
      </span>
    );
    const successMsg = intl.formatMessage({ id: 'App.message.delete.all.success' });

    const self = this;

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteAllTasks(TASK_TYPE.VIDEO)
          .then(({ isOk }) => {
            if (isOk) {
              message.success(successMsg);
              self.handleFetchTasks();
            }
          });
      },
    });
  }

  handleSearch = values => {
    this.setState({
      ...values,
      page: 1,
    }, () => {
      this.handleFetchTasks();
    });
  }

  handleRowClick = record => {
    this.setState({
      currTask: record,
      modalVisibleResultList: true,
    });
  }

  hideModalResultList = () => {
    this.setState({
      modalVisibleResultList: false,
    });
  }

  render() {
    const {
      meta, tasks, updateStatusTask, intl,
    } = this.props;
    const { selectedRowKeys, currTask } = this.state;
    return (
      <React.Fragment>
        <Sider selectedKey="tasks-video" />
        <div className="app-page">
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">
              {intl.formatMessage({ id: 'App.video.title' })}
            </h1>
            <div className="app-page__actions buttons-group">
              <Button
                type="primary"
                onClick={this.showModalTaskAdd}
              >
                <Cicon type="addcamera" />{intl.formatMessage({ id: 'App.RT.add.title' })}
              </Button>
              <Button
                type="primary"
                disabled={selectedRowKeys.length === 0}
                onClick={this.showModalCmodal}
              >
                <Cicon type="closethetask" />{intl.formatMessage({ id: 'App.RT.button.closeChecked' })}
              </Button>
              <Button
                type="danger"
                icon="primary"
                onClick={this.handleClear}
              >
                <Cicon type="delete" />{intl.formatMessage({ id: 'App.RT.button.deleteChecked' })}
              </Button>
            </div>
            <Table
              tasks={tasks}
              meta={meta}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={this.handleRowSelect}
              onPaginationChange={this.handlePaginationClick}
              deleteTasks={this.handleDelete}
              updateStatusTask={updateStatusTask}
              onRowClick={this.handleRowClick}
            />
          </Card>
          {this.state.modalVisibleTaskAdd &&
            <Modal
              width={900}
              title={intl.formatMessage({ id: 'App.RT.add.title' })}
              visible={this.state.modalVisibleTaskAdd}
              onCancel={this.hideModalTaskAdd}
              footer={null}
            >
              <TaskVideoAdd
                hideModal={this.hideModalTaskAdd}
                taskType={TASK_TYPE.VIDEO}
                intl={intl}
              />
            </Modal>}
          {this.state.modalVisibleResultList &&
            <Modal
              width={1024}
              title={`${intl.formatMessage({ id: 'App.RT.taskId' })}：${currTask.id}`}
              visible={this.state.modalVisibleResultList}
              onCancel={this.hideModalResultList}
              footer={null}
            >
              <ResultList hideModal={this.hideModalResultList} currTask={currTask} />
            </Modal>}
          {this.state.modalVisibleCmodal &&
            <Modal
              width={416}
              title=""
              visible={this.state.modalVisibleCmodal}
              onCancel={this.hideModalCmodal}
              footer={null}
            >
              <Cmodal
                title={`${intl.formatMessage({ id: 'App.message.close.warn' })}?`}
                onCancel={this.hideModalCmodal}
                onMiddleOk={this.handleMultiStop}
                middleName={intl.formatMessage({ id: 'App.RT.task.pause' })}
                onOk={this.handleMultiDelete}
                okName={intl.formatMessage({ id: 'App.RT.task.close' })}
              />
            </Modal>}
        </div>
      </React.Fragment>
    );
  }
}

export default injectIntl(TasksVideo);
