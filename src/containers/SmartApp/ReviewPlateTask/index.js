import { connect } from 'react-redux';
import { updateFilter } from '../../../actions/filter';
import ReviewPlateTask from '../../../components/SmartApp/ReviewPlateTask';

import { getReviewPlateTasks, putReviewPlateTaskStart } from '../../../actions/reviewPlate';

const mapStateToProps = state => ({
  tasks: state.entities.reviewPlateTasks,
  filter: state.filter.reviewPlateTasks,
  meta: state.meta.reviewPlateTasks,
});

export default connect(mapStateToProps, {
  updateFilter,
  getReviewPlateTasks,
  putReviewPlateTaskStart,
})(ReviewPlateTask);
