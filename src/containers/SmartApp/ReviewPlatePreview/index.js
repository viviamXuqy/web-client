import { connect } from 'react-redux';
import ReviewPlatePreview from '../../../components/SmartApp/ReviewPlatePreview';

import { updateFilter } from '../../../actions/filter';
import { fetchMonitorPlayPath, startMonitor, stopMonitor } from '../../../actions/smartApp';
import { showLoading } from '../../../actions/loading';
import { getReviewPlateTask, getReviewPlateTasks, getReviewPlateResults, putReviewPlateTaskStart } from '../../../actions/reviewPlate';


const mapStateToProps = state => ({
  originalTasks: Object.keys(state.entities.reviewPlateTasks).length ?
    [...Object.values(state.entities.reviewPlateTasks)]
      .reduce((arr, item) => {
        if (item.area && item.area.length >= 3) {
          arr.push({
            key: item.id,
            ...item,
          });
        }
        return arr;
      }, []) : [],
  results: Object.keys(state.entities.reviewPlateResults).length ?
    [...Object.values(state.entities.reviewPlateResults)]
      .map(item => ({
        key: item.id,
        ...item,
      })) : [],
});

export default connect(mapStateToProps, {
  startMonitor,
  stopMonitor,
  fetchMonitorPlayPath,
  showLoading,
  getReviewPlateTask,
  getReviewPlateResults,
  updateFilter,
  putReviewPlateTaskStart,
  getReviewPlateTasks,
})(ReviewPlatePreview);
