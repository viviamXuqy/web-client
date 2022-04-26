import { connect } from 'react-redux';

import SignIn from '../../components/SignIn';
import { signIn } from '../../actions/user';

const mapStateToProps = state => ({
  lang: state.system.lang,
});

export default connect(mapStateToProps, {
  signIn,
})(SignIn);
