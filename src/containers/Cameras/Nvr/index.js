import { connect } from 'react-redux';

import { fetchNvrs, deleteNvrs } from '../../../actions/cameras';
import { updateFilter } from '../../../actions/filter';
import { getNvrs } from '../../../selectors';

import Nvr from '../../../components/Cameras/Nvr';

const mapStateToProps = state => ({
  nvrs: getNvrs(state),
  filter: state.filter.nvrs,
  meta: state.meta.nvrs,
});

export default connect(mapStateToProps, {
  fetchNvrs,
  deleteNvrs,
  updateFilter,
})(Nvr);
