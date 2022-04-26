import { connect } from 'react-redux';

import Sider from '../../components/Sider';
import { fetchCameras } from '../../actions/cameras';
import { fetchTasks } from '../../actions/tasks';
import { fetchResults } from '../../actions/results';

import { getCameras, getTasks } from '../../selectors';

const mapStateToProps = state => ({
  user: state.user,
  cameras: getCameras(state),
  tasks: getTasks(state),
});

export default connect(mapStateToProps, {
  fetchCameras,
  fetchTasks,
  fetchResults,
})(Sider);
