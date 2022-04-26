import { connect } from 'react-redux';

import BayonetNewRtspAdd from '../../../shared/components/BayonetNewRtspAdd';
import { addCamera } from '../../../actions/cameras';

const mapStateToProps = state => ({
  meta: state.meta.cameras,
});

export default connect(mapStateToProps, {
  addCamera,
})(BayonetNewRtspAdd);
