import { connect } from 'react-redux';
import { updateFilter } from '../../../actions/filter';
import ReviewPlateResult from '../../../components/SmartApp/ReviewPlateResult';

import { getReviewPlateResults, getReviewPlateTaskStatistics } from '../../../actions/reviewPlate';

const mapStateToProps = state => ({
  results: state.entities.reviewPlateResults,
  filter: state.filter.reviewPlateResults,
  meta: state.meta.reviewPlateResults,
});

export default connect(mapStateToProps, {
  updateFilter,
  getReviewPlateResults,
  getReviewPlateTaskStatistics,
})(ReviewPlateResult);
