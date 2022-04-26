import { connect } from 'react-redux';


import { fetchActiveTask } from '../../../actions/tasks';
import { getBayonets } from '../../../selectors';
import ViolationAdd from '../../../shared/components/ViolationAdd';

const mapStateToProps = state => ({
  bayonets: getBayonets(state),
  meta: state.meta.bayonets,
  filter: state.filter.bayonets,
});

export default connect(mapStateToProps, {
  fetchActiveTask,
})(ViolationAdd);
