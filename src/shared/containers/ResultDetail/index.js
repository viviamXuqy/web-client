import { connect } from 'react-redux';

import ResultDetail from '../../../shared/components/ResultDetail';
import { getImg } from '../../../actions/image';

export default connect(null, {
  getImg,
})(ResultDetail);
