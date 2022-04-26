import { connect } from 'react-redux';

import { fetchLogs, deleteLogs } from '../../../actions/system';
import { updateFilter } from '../../../actions/filter';
import { getLogs } from '../../../selectors';
import { replace } from 'react-router-redux';

import Log from '../../../components/System/Log';

const mapStateToProps = state => ({
  logs: getLogs(state),
  filter: state.filter.logs,
  meta: state.meta.logs,
});

export default connect(mapStateToProps, {
  replace,
  fetchLogs,
  deleteLogs,
  updateFilter,
})(Log);
