import { connect } from 'react-redux';

import Footer from '../../components/Footer';

const mapStateToProps = state => ({
  router: state.router,
});

export default connect(mapStateToProps)(Footer);
