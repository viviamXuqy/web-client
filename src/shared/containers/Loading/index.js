import React from 'react';
import { bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import Cicon from '../../../shared/components/Cicon';

import './index.css';

const antIcon = <Cicon type="loading" spin />;

const Loading = ({
  isLoading,
  loadingTip,
}) => isLoading && (
  <div className="loading">
    <Spin indicator={antIcon} size="large" tip={loadingTip} />
  </div>
);

Loading.propTypes = {
  isLoading: bool,
  loadingTip: string,
};

Loading.defaultProps = {
  isLoading: false,
  loadingTip: 'Loading...',
};

const mapStateToProps = state => ({
  isLoading: state.system.isLoading,
  loadingTip: state.system.loadingTip,
});

export default connect(mapStateToProps)(Loading);
