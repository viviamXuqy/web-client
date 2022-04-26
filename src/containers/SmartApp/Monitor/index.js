import { connect } from 'react-redux';
import Monitor from '../../../components/SmartApp/Monitor';

import { fetchMonitorPlayPath, fetchMonitorAnalysis, startMonitor, stopMonitor, fetchMonitorData, resetMonitorData } from '../../../actions/smartApp';
import { showLoading } from '../../../actions/loading';

import { fetchActiveTask } from '../../../actions/tasks';

export default connect(null, {
  fetchActiveTask,
  fetchMonitorPlayPath,
  fetchMonitorAnalysis,
  startMonitor,
  stopMonitor,
  fetchMonitorData,
  showLoading,
  resetMonitorData,
})(Monitor);
