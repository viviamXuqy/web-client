import React from 'react';
import { string } from 'prop-types';

import './index.less';

const MonitorShow = ({
  classNameVal,
  name,
  value,
}) => {
  if (!value) return '';
  const element = (
    <span className="monitor-detail-card__item_span">
      <span className="fl">{name}</span>
      <span className={`${classNameVal} fr`}>{value}</span>
    </span>
  );
  return (
    element
  );
};

MonitorShow.propTypes = {
  classNameVal: string,
  name: string,
  value: string,
};

MonitorShow.defaultProps = {
  classNameVal: '',
  name: '',
  value: '',
};

export default MonitorShow;
