import { connect } from 'react-redux';

import ImageCut from '../../../shared/components/ImageCut';

import { updateCameraArea, getCameraImg } from '../../../actions/cameras';

export default connect(null, {
  updateCameraArea,
  getCameraImg,
})(ImageCut);
