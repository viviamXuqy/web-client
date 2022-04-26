import { connect } from 'react-redux';

import TaskResultsCard from '../../../shared/components/TaskResultsCard';
import { getImg } from '../../../actions/image';

export default connect(null, {
  getImg,
})(TaskResultsCard);
