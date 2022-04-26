import { connect } from 'react-redux';

import { fetchCameras, deleteCameras, updateCameraRecs, updateCameraRec, uploadFile, getCameraNum, getTasknum } from '../../actions/cameras';
import { updateFilter } from '../../actions/filter';
import { getCameras } from '../../selectors';

import Camera from '../../components/Cameras';

const mapStateToProps = state => ({
  cameras: getCameras(state),
  filter: state.filter.cameras,
  meta: state.meta.cameras,
});

export default connect(mapStateToProps, {
  fetchCameras,
  updateFilter,
  deleteCameras,
  updateCameraRec,
  updateCameraRecs,
  uploadFile,
  getCameraNum,
  getTasknum,
})(Camera);
