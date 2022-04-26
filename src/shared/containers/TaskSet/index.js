import { connect } from 'react-redux';

import TaskSet from '../../../shared/components/TaskSet';

import { fetchFeatures } from '../../../actions/features';
import { setTask } from '../../../actions/tasks';

export default connect(null, {
  fetchFeatures,
  setTask,
})(TaskSet);
