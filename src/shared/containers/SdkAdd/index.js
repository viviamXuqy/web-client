import { connect } from 'react-redux';

import SdkAdd from '../../../shared/components/SdkAdd';
import { addSdk, modifySdk } from '../../../actions/system';

const mapStateToProps = state => ({
  meta: state.meta.sdks,
  sdks: state.entities.sdks,
});

export default connect(mapStateToProps, {
  addSdk, modifySdk,
})(SdkAdd);
