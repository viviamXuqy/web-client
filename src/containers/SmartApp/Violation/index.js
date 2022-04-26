import { connect } from 'react-redux';
import Violation from '../../../components/SmartApp/Violation';
import { updateFilter } from '../../../actions/filter';
import {
  fetchViolationList, deleteViolationTasks, clearViolationTasks, switchViolationTasks,
  addViolationTask, modifyViolationTasks, fetchViolationResult, deleteViolationResults,
  clearViolationResults, getViolationResult,
} from '../../../actions/smartApp';

const mapStateToProps = state => ({
  resultsMeta: state.meta.violationResults,
  tasksMeta: state.meta.violationTasks,
  results: state.entities.violationResults,
  tasks: state.entities.violationTasks,
  filter: state.filter.violationTasks,
});

export default connect(mapStateToProps, {
  fetchViolationList,
  deleteTasks: deleteViolationTasks,
  clearTasks: clearViolationTasks,
  switchViolationTasks,
  addTask: addViolationTask,
  modifyTask: modifyViolationTasks,
  fetchViolationResult,
  deleteResults: deleteViolationResults,
  clearResults: clearViolationResults,
  getResult: getViolationResult,
  updateFilter,
})(Violation);
