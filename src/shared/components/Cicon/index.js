import React from 'react';
import { string, bool } from 'prop-types';
import classNames from 'classnames';

import './index.less';

const CustomIcon = ({
  type,
  className,
  spin,
}) => {
  const iconClass = classNames(
    'anticon',
    'iconfont',
    {
      [`icon-${type}`]: type,
    },
    spin ? 'cicon__loop' : '',
    className,
  );

  return <i className={iconClass} />;
};

CustomIcon.propTypes = {
  type: string,
  className: string,
  spin: bool,
};

CustomIcon.defaultProps = {
  type: '',
  className: '',
  spin: false,
};

export default CustomIcon;
