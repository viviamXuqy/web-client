import { connect } from 'react-redux';

import TaskAdd from '../../../shared/components/TaskAdd';

import { updateFilter } from '../../../actions/filter';
import { fetchBayonets, fetchBayonetCameras } from '../../../actions/bayonets';
import { fetchFeatures } from '../../../actions/features';
import { submitTask } from '../../../actions/tasks';
import { getBayonets } from '../../../selectors';

const mapStateToProps = state => ({
  bayonets: getBayonets(state),
  meta: state.meta.bayonets,
  filter: state.filter.bayonets,
});

export default connect(mapStateToProps, {
  updateFilter,
  fetchBayonets,
  fetchBayonetCameras,
  fetchFeatures,
  submitTask,
})(TaskAdd);
