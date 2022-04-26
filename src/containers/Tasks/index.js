import { updateFilter } from '../../actions/filter';
import { fetchTasks, deleteTasks, updateStatusTask, updateStatusLotTask, deleteAllTasks, getTaskNum } from '../../actions/tasks';
import { fetchCamera } from '../../actions/cameras';
import { connect } from 'react-redux';

import { getTasks } from '../../selectors';
import Task from '../../components/Tasks';

const mapStateToProps = state => ({
  tasks: getTasks(state),
  filter: state.filter.tasks,
  meta: state.meta.tasks,
});

export default connect(mapStateToProps, {
  updateFilter,
  fetchTasks,
  fetchCamera,
  deleteTasks,
  updateStatusTask,
  updateStatusLotTask,
  deleteAllTasks,
  getTaskNum,
})(Task);
