import { connect } from 'react-redux';

import ResultsCard from '../../../shared/components/ResultsCard';
import { fetchResult } from '../../../actions/results';
import { getImg } from '../../../actions/image';

export default connect(null, {
  fetchResult,
  getImg,
})(ResultsCard);
