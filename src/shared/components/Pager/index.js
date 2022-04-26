import React from 'react';
import { object, func } from 'prop-types';
import { Button } from 'antd';

const Pager = ({
  meta,
  onChange,
}) => {
  const { cursor: next, current } = meta;
  const prev = current - 1;
  const isPrevDisabled = prev < 1;
  const isNextDisabled = next < 2;

  return (
    <div className="app-pager">
      <Button
        disabled={isPrevDisabled}
        icon="left"
        onClick={() => onChange(prev)}
      />
      <Button type="primary" className="app-pager__current">{current || 1}</Button>
      <Button
        disabled={isNextDisabled}
        icon="right"
        onClick={() => onChange(next)}
      />
    </div>
  );
};

Pager.propTypes = {
  meta: object.isRequired,
  onChange: func.isRequired,
};

export default Pager;
