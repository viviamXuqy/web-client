import { connect } from 'react-redux';

import HomeIndex from '../../components/HomeIndex';

import { fetchResults } from '../../actions/results';
import { updateFilter } from '../../actions/filter';

import { getResults } from '../../selectors';


const mapStateToProps = state => ({
  lang: state.system.lang,
  user: state.user,
  results: getResults(state),
  filter: state.filter.results,
  meta: state.meta.results,
});

export default connect(mapStateToProps, {
  fetchResults,
  updateFilter,
})(HomeIndex);
