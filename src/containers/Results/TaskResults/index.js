import { connect } from 'react-redux';

import { fetchTaskResults, deleteTaskResults } from '../../../actions/tasks';
import { updateFilter } from '../../../actions/filter';
import { clearDatas } from '../../../actions/public';
import { getTaskResults } from '../../../selectors';
import TaskResults from '../../../components/Results/TaskResults';

const mapStateToProps = state => ({
  user: state.user,
  taskresults: getTaskResults(state),
  filter: state.filter.taskresults,
  meta: state.meta.taskresults,
});

export default connect(mapStateToProps, {
  fetchTaskResults,
  updateFilter,
  deleteTaskResults,
  clearDatas,
})(TaskResults);
