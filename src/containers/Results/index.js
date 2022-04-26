import { connect } from 'react-redux';

import { fetchResults, submitResult, deleteResults, deleteAllResults } from '../../actions/results';
import { updateFilter } from '../../actions/filter';
import { clearDatas } from '../../actions/public';
import { getResults } from '../../selectors';
import Results from '../../components/Results';

const mapStateToProps = state => ({
  user: state.user,
  results: getResults(state),
  filter: state.filter.results,
  meta: state.meta.results,
});

export default connect(mapStateToProps, {
  fetchResults,
  updateFilter,
  submitResult,
  deleteResults,
  deleteAllResults,
  clearDatas,
})(Results);
