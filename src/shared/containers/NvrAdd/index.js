import { connect } from 'react-redux';

import NvrAdd from '../../../shared/components/NvrAdd';
import { addNvr, modifyNvr } from '../../../actions/cameras';

export default connect(null, {
  addNvr, modifyNvr,
})(NvrAdd);
