import { connect } from 'react-redux';

import ResultStructSearch from '../../../shared/components/ResultStructSearch';

import { fetchFeatures } from '../../../actions/features';

export default connect(null, {
  fetchFeatures,
})(ResultStructSearch);
