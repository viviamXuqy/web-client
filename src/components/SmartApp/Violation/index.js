import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Card, Button, Modal, message } from 'antd';
import { injectIntl } from 'react-intl';
import Cicon from '../../../shared/components/Cicon';
import ViolationAdd from '../../../shared/containers/ViolationAdd';
import TaskTable from './taskTable';
// import ResultsCard from './ResultCard';
import Search from './Search';
import './index.less';

class Violation extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    tasksMeta: object.isRequired,
    tasks: object.isRequired,
    fetchViolationList: func.isRequired,
    addVehicleTask: func.isRequired,
    fetchActiveTask: func.isRequired,
    clearTasks: func.isRequired,
    deleteResults: func.isRequired,
    clearResults: func.isRequired,
    deleteTasks: func.isRequired,
    filter: object.isRequired,
    updateFilter: func.isRequired,
    addViolationTask: func.isRequired,
  }

  static defaultProps = {
  }

  state = {
    selectedTask: [],
    selectedResult: [],
    page: 1,
    pageSize: 8,
    modalTasksAddVisible: false,
    search: '',
    countBegin: '',
    countEnd: '',
    originalTaskId: '',
  }

  componentDidMount() {
    this.handleFetchTasks();
    // this.handleFetchVehicleResults();
  }

  handleFetchTasks=() => {
    const { fetchViolationList } = this.props;
    const {
      page, pageSize,
    } = this.state;
    const options = {
      page,
      pageSize,
    };
    fetchViolationList(options);
  }

  handleFilterTasks=() => {
    const { fetchViolationList } = this.props;
    const {
      page, pageSize, search, resultBeginId, resultEndId, type, camera, status,
    } = this.state;
    const filters = {
      search,
      resultBeginId,
      resultEndId,
      type,
      camera,
      status,
      page,
      pageSize,
    };
    this.updateFilter(filters);
    fetchViolationList();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('violationTasks', values);
  }

  hideModal = modal => {
    const nextState = {};
    nextState[modal] = false;
    this.setState({ ...nextState, page: 1 }, () => {
      this.handleFetchTasks();
    });
  }

  handleShowModal=modal => {
    const nextState = {};
    nextState[modal] = true;
    this.setState({ ...nextState });
  }
  handleRowSelect = selectedTask => {
    this.setState({
      selectedTask,
    });
  }

  handleTaskPagChange= page => {
    this.setState({
      page,
    }, () => {
      this.handleFetchTasks();
    });
  }

  handleClearTask=() => {
    const { clearTasks, intl } = this.props;
    const $this = this;
    const successMsg = intl.formatMessage({ id: 'App.message.delete.all.success' });
    Modal.confirm({
      title: '确定清空任务吗？',
      okType: 'danger',
      onOk() {
        clearTasks()
          .then(({ response }) => {
            if (response) {
              message.success(successMsg);
              $this.handleFetchTasks();
            }
          });
      },
    });
  }

  handleDeleteResult=ids => {
    const { intl, deleteResults } = this.props;
    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });
    const title = (
      <span>
        {msg}
      </span>);
    const $this = this;
    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteResults(ids.join(',')).then(({ response }) => {
          if (response) {
            message.success(intl.formatMessage({ id: ' App.message.delete.success' }));
            $this.handleFetchTasks();
          }
        });
      },
    });
  }
  handleSelectResult=id => {
    const { selectedResult } = this.state;
    if (selectedResult.some(idTemp => idTemp === id)) {
      selectedResult.splice(selectedResult.findIndex(i => i === id), 1);
    } else {
      selectedResult.push(id);
    }

    this.setState({
      selectedResult: selectedResult.slice(0),
    });
  }

  handleResults=() => {
    this.handleDeleteResult(this.state.selectedResult);
  }

  isSelected = id => {
    const { selectedResult } = this.state;
    return selectedResult.indexOf(id) !== -1;
  }

  handleClear=() => {
    const { clearResults, intl, fetchViolationList } = this.props;
    clearResults().then(({ response }) => {
      if (response) {
        message.success(intl.formatMessage({ id: ' App.message.delete.all.success' }));
        fetchViolationList();
      }
    });
  }

  handleSearch = values => {
    const options = {
      page: 1,
      ...values,
    };
    this.setState({
      ...options,
    }, () => {
      this.handleFilterTasks();
    });
  }

  // 删除任务
  handleDeleteTasks=() => {
    const $this = this;
    const { deleteTasks, intl, fetchViolationList } = this.props;
    let { selectedTask } = this.state;
    selectedTask = selectedTask.join(',');
    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });
    const title = (
      <span>
        {msg}
      </span>);
    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteTasks(selectedTask)
          .then(({ response }) => {
            if (response) {
              $this.setState({
                selectedTask: [],
              });
              message.success(intl.formatMessage({ id: 'App.message.delete.success' }));
              fetchViolationList();
            }
          });
      },
    });
  }
  render() {
    const { selectedTask } = this.state;
    const {
      intl, tasksMeta, tasks, addVehicleTask, fetchActiveTask, deleteTasks,
      filter, addViolationTask,
    } = this.props;
    return (
      <React.Fragment >
        <div className="violation-content">
          <Card
            bordered={false}
            className="app-card"
          >
            <Search filter={filter} onSearch={this.handleSearch} />
            <div className="app-page__actions buttons-group mt-20">
              <Button
                type="primary"
                onClick={() => this.handleShowModal('modalTasksAddVisible')}
              >
                <Cicon type="addcamera" />{intl.formatMessage({ id: 'App.RT.add.title' })}
              </Button>
              <Button
                type="primary"
                disabled={selectedTask.length === 0}
                onClick={this.handleDeleteTasks}
              >
                <Cicon type="delete" />{intl.formatMessage({ id: 'App.control.deleteMore' })}
              </Button>
              <Button
                type="danger"
                icon="primary"
                onClick={this.handleClearTask}
              >
                <Cicon type="delete" />{intl.formatMessage({ id: 'App.RT.button.deleteChecked' })}
              </Button>
            </div>
            <TaskTable
              tasksMeta={tasksMeta}
              tasks={tasks}
              selectedRowKeys={selectedTask}
              onSelectChange={this.handleRowSelect}
              onPaginationChange={this.handleTaskPagChange}
              handlefetchTasks={this.handleFetchTasks}
              deleteTasks={deleteTasks}
              addVehicleTask={addViolationTask}
            />

          </Card>
        </div>
        {this.state.modalTasksAddVisible &&
          <Modal
            width={820}
            title="创建任务"
            visible={this.state.modalTasksAddVisible}
            footer={null}
            onCancel={() => this.hideModal('modalTasksAddVisible')}
          >
            <ViolationAdd
              hideModal={() => this.hideModal('modalTasksAddVisible')}
              intl={intl}
              addVehicleTask={addVehicleTask}
              fetchActiveTask={fetchActiveTask}
            />
          </Modal>}
      </React.Fragment>
    );
  }
}

export default (injectIntl(Violation));
