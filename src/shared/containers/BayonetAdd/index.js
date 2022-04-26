import { connect } from 'react-redux';

import BayonetAdd from '../../../shared/components/BayonetAdd';

import { fetchBayonets, fetchBayonetSdkCameras as fetchBayonetCameras, renameBayonet } from '../../../actions/bayonets';
import { addCamera } from '../../../actions/cameras';
import { getBayonets } from '../../../selectors';
import { updateFilter } from '../../../actions/filter';

const mapStateToProps = state => ({
  bayonets: getBayonets(state),
  meta: state.meta.bayonets,
  filter: state.filter.bayonets,
});

export default connect(mapStateToProps, {
  fetchBayonets,
  fetchBayonetCameras,
  addCamera,
  updateFilter,
  renameBayonet,
})(BayonetAdd);
