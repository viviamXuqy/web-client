import { connect } from 'react-redux';

import ReviewPlateTaskImageCut from '../../../shared/components/ReviewPlateTaskImageCut';

import { getReviewPlatePreviewImage, putReviewPlateArea, getReviewPlateTasks } from '../../../actions/reviewPlate';

export default connect(null, {
  putReviewPlateArea,
  getReviewPlatePreviewImage,
  getReviewPlateTasks,
})(ReviewPlateTaskImageCut);
