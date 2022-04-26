import { connect } from 'react-redux';

import UserAdd from '../../../shared/components/UserAdd';
import { addUser, modifyUser } from '../../../actions/system';

const mapStateToProps = state => ({
  user: state.entities.user,
  lang: state.system.lang,
});

export default connect(mapStateToProps, {
  addUser, modifyUser,
})(UserAdd);
