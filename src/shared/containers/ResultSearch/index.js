import { connect } from 'react-redux';

import ResultSearch from '../../../shared/components/ResultSearch';

import { fetchCameraTask } from '../../../actions/tasks';

export default connect(null, {
  fetchCameraTask,
})(ResultSearch);
