import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Card, Button, List, Modal, message } from 'antd';
import { injectIntl } from 'react-intl';
import Cicon from '../../../shared/components/Cicon';
import VehicleAdd from '../../../shared/components/VehicleAdd';
import TaskTable from './taskTable';
import ResultsCard from './ResultCard';
import Search from './Search';
import './index.less';

class Driver extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    tasksMeta: object.isRequired,
    resultsMeta: object.isRequired,
    tasks: object.isRequired,
    results: object.isRequired,
    fetchVehicleTasks: func.isRequired,
    fetchVehicleResults: func.isRequired,
    addVehicleTask: func.isRequired,
    fetchActiveTask: func.isRequired,
    closeTasks: func.isRequired,
    deleteAllTasks: func.isRequired,
    getImg: func.isRequired,
    getResult: func.isRequired,
    deleteResults: func.isRequired,
    clearResults: func.isRequired,
    deleteTasks: func.isRequired,
    startTasks: func.isRequired,
    filter: object.isRequired,
    updateFilter: func.isRequired,
  }

  static defaultProps = {
  }

  state = {
    selectedTask: [],
    selectedResult: [],
    taskPage: 1,
    taskPageSize: 8,
    resultPage: 1,
    resultPageSize: 8,
    modalTasksAddVisible: false,
    search: '',
    countBegin: '',
    countEnd: '',
    originalTaskId: '',
  }

  componentDidMount() {
    this.handlefetchVehicleTasks();
    this.handleFetchVehicleResults();
  }


  handleResultPagChange = page => {
    this.setState({
      resultPage: page,
    }, () => {
      this.handleFetchVehicleResults();
    });
  }

  handleFetchVehicleResults=() => {
    const { fetchVehicleResults } = this.props;
    const {
      resultPage, resultPageSize, search, countBegin, countEnd, originalTaskId,
    } = this.state;
    const filters = {
      search,
      countBegin,
      countEnd,
      originalTaskId,
      page: resultPage,
      pageSize: resultPageSize,
    };
    this.updateFilter(filters);
    fetchVehicleResults();
  }
  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('vehicleResults', values);
  }

  hideModal = modal => {
    const nextState = {};
    nextState[modal] = false;
    this.setState({ ...nextState, taskPage: 1 }, () => {
      this.handlefetchVehicleTasks();
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

  handleCloseTask=() => {
    const $this = this;
    const { closeTasks, intl } = this.props;
    let { selectedTask } = this.state;
    selectedTask = selectedTask.join(',');

    Modal.confirm({
      title: intl.formatMessage({ id: ' App.message.close.warn' }),
      okType: 'danger',
      onOk() {
        closeTasks({ ids: selectedTask })
          .then(({ isOk }) => {
            if (isOk) {
              $this.setState({
                selectedTask: [],
              });
              message.success('关闭成功');
              $this.handlefetchVehicleTasks();
            }
          });
      },
    });
  }
  handleTaskPagChange= page => {
    this.setState({
      taskPage: page,
    }, () => {
      this.handlefetchVehicleTasks();
    });
  }
  handlefetchVehicleTasks=() => {
    const { fetchVehicleTasks } = this.props;
    const { taskPage, taskPageSize } = this.state;
    fetchVehicleTasks({ page: taskPage, pageSize: taskPageSize });
  }

  handleClearTask=() => {
    const { deleteAllTasks } = this.props;
    const $this = this;
    Modal.confirm({
      title: '确定清空任务吗？',
      okType: 'danger',
      onOk() {
        deleteAllTasks()
          .then(({ isOk }) => {
            if (isOk) {
              message.success('清空成功');
              $this.handlefetchVehicleTasks();
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
        deleteResults(ids.join(',')).then(({ isOk }) => {
          if (isOk) {
            message.success(intl.formatMessage({ id: ' App.message.delete.success' }));
            $this.handleFetchVehicleResults();
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
    const { clearResults, intl } = this.props;
    clearResults().then(({ isOk }) => {
      if (isOk) {
        message.success(intl.formatMessage({ id: ' App.message.delete.all.success' }));
        this.handleFetchVehicleResults();
      }
    });
  }

  handleSearch = values => {
    const options = {
      search: '',
      page: 1,
      countBegin: '',
      countEnd: '',
      originalTaskId: '',
      ...values,
    };
    this.setState({
      ...options,
    }, () => {
      this.handleFetchVehicleResults();
    });
  }

  render() {
    const { selectedTask, selectedResult } = this.state;
    const {
      intl, tasksMeta, tasks, resultsMeta, results, addVehicleTask, fetchActiveTask,
      getImg, getResult, deleteTasks, startTasks, closeTasks, filter,
    } = this.props;
    const dataSource = Object.keys(results).length ? [...Object.values(results)]
      .map(item => ({
        key: item.id,
        ...item,
      })) : [];
    return (
      <React.Fragment >
        <div className="app-page ">
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">机动车驾驶人监测任务管理</h1>
            <div className="app-page__actions buttons-group">
              <Button
                type="primary"
                onClick={() => this.handleShowModal('modalTasksAddVisible')}
              >
                <Cicon type="addcamera" />{intl.formatMessage({ id: 'App.RT.add.title' })}
              </Button>
              <Button
                type="primary"
                disabled={selectedTask.length === 0}
                onClick={this.handleCloseTask}
              >
                <Cicon type="closethetask" />{intl.formatMessage({ id: 'App.RT.button.closeChecked' })}
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
              handlefetchVehicleTasks={this.handlefetchVehicleTasks}
              deleteTasks={deleteTasks}
              closeTasks={closeTasks}
              startTasks={startTasks}
            />
            <h1 className="app-page__title mt-20">机动车驾驶人监测结果管理</h1>
            <Search onSearch={this.handleSearch} filter={filter} />
            <div className="app-page__actions buttons-group  mt-20">
              <Button
                type="warn"
                onClick={this.handleResults}
                disabled={selectedResult.length === 0}
              >
                <Cicon type="delete" />{intl.formatMessage({ id: 'App.control.deleteMore' })}
              </Button>
              <Button
                type="danger"
                onClick={this.handleClear}
              >
                <Cicon type="delete" />{intl.formatMessage({ id: 'App.control.clear' })}
              </Button>
            </div>
            <List
              bordered={false}
              className="results-list2"
              grid={{ gutter: 20, column: 4 }}
              dataSource={dataSource}
              pagination={{
                  ...resultsMeta,
                  onChange: this.handleResultPagChange,
              }}
              renderItem={item => (
                <List.Item className="results-list2__item">
                  <ResultsCard
                    result={item}
                    isResultList
                    getImg={getImg}
                    getResult={getResult}
                    intl={intl}
                    isSelected={this.isSelected(item.id)}
                    onDelete={this.handleDeleteResult}
                    onSelect={this.handleSelectResult}
                  />
                </List.Item>
                  )}
            />

          </Card>
        </div>
        {this.state.modalTasksAddVisible &&
          <Modal
            width={483}
            title="创建任务"
            visible={this.state.modalTasksAddVisible}
            footer={null}
            onCancel={() => this.hideModal('modalTasksAddVisible')}
          >
            <VehicleAdd
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

export default (injectIntl(Driver));
