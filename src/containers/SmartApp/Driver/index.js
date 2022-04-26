import { connect } from 'react-redux';
import Driver from '../../../components/SmartApp/Driver';
import {
  fetchVehicleTasks, deleteAllTasks, deleteTasks, addVehicleTask, closeTasks,
  getResult, deleteResults, clearResults, fetchVehicleResults, fetchActiveTask, startTasks,
} from '../../../actions/smartApp';
import { updateFilter } from '../../../actions/filter';
import { getImg } from '../../../actions/image';

const mapStateToProps = state => ({
  resultsMeta: state.meta.vehicleResults,
  tasksMeta: state.meta.vehicleTasks,
  results: state.entities.vehicleResults,
  tasks: state.entities.vehicleTasks,
  filter: state.filter.vehicleResults,
});

export default connect(mapStateToProps, {
  fetchVehicleTasks,
  deleteAllTasks,
  deleteTasks,
  addVehicleTask,
  closeTasks,
  getResult,
  deleteResults,
  clearResults,
  fetchVehicleResults,
  fetchActiveTask,
  getImg,
  startTasks,
  updateFilter,
})(Driver);
