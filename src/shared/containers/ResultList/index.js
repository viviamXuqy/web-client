import { connect } from 'react-redux';

import { fetchResults, deleteResults } from '../../../actions/results';
import { updateFilter } from '../../../actions/filter';
import { clearDatas } from '../../../actions/public';
import { getResults } from '../../../selectors';

import ResultList from '../../../shared/components/ResultList';

const mapStateToProps = state => ({
  user: state.user,
  results: getResults(state),
  filter: state.filter.results,
  meta: state.meta.results,
});

export default connect(mapStateToProps, {
  fetchResults,
  updateFilter,
  deleteResults,
  clearDatas,
})(ResultList);
