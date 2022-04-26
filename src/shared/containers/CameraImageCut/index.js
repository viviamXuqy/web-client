import { connect } from 'react-redux';

import ImageCut from '../../../shared/components/CameraImageCut';

import { updateCameraArea, getCameraImg, renameCamera, fetchCameras } from '../../../actions/cameras';

export default connect(null, {
  updateCameraArea,
  getCameraImg,
  renameCamera,
  fetchCameras,
})(ImageCut);
