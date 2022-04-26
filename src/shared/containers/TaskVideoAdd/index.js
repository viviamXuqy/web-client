import { connect } from 'react-redux';

import TaskVideoAdd from '../../../shared/components/TaskVideoAdd';

import { fetchResources, fetchResourceTree, fetchResourceTreeFile } from '../../../actions/resources';
import { fetchFeatures } from '../../../actions/features';
import { submitTask } from '../../../actions/tasks';

export default connect(null, {
  fetchResources,
  fetchResourceTree,
  fetchFeatures,
  fetchResourceTreeFile,
  submitTask,
})(TaskVideoAdd);
