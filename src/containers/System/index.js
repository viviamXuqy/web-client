import { connect } from 'react-redux';

import {
  fetchSdks, addSdk, deleteSdk, updateSdkStatus, modifySdk, modifyWorkMode,
  recoverConfig, saveNtp, saveManual,
  fetchUsers, addUser, deleteUser, updateUserStatus, modifyUser,
} from '../../actions/system';

import System from '../../components/System';

const mapStateToProps = state => ({
  sdkMeta: state.meta.sdks,
  userMeta: state.meta.users,
  sdks: state.entities.sdks,
  users: state.entities.users,
});

export default connect(mapStateToProps, {
  fetchSdks,
  addSdk,
  deleteSdk,
  updateSdkStatus,
  modifySdk,
  modifyWorkMode,
  recoverConfig,
  saveNtp,
  saveManual,
  fetchUsers,
  addUser,
  deleteUser,
  updateUserStatus,
  modifyUser,
})(System);
