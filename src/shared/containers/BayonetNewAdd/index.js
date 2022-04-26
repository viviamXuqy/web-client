import { connect } from 'react-redux';

import BayonetNewAdd from '../../../shared/components/BayonetNewAdd';
import { submitBayonet, fetchBayonetSdkCameras as fetchBayonetCameras, submitBayonetSdk } from '../../../actions/bayonets';
import { addCamera } from '../../../actions/cameras';

export default connect(null, {
  submitBayonet,
  fetchBayonetCameras,
  addCamera,
  submitBayonetSdk,
})(BayonetNewAdd);
