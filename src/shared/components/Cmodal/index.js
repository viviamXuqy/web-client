import React, { PureComponent } from 'react';
import { string, object, func } from 'prop-types';
import { Button } from 'antd';
import { injectIntl } from 'react-intl';

import './index.less';

class Cmodal extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    title: string.isRequired,
    onCancel: func.isRequired,
    onOk: func.isRequired,
    okName: string.isRequired,
    content: string,
    onMiddleOk: func,
    middleName: string,
  }

  static defaultProps = {
    content: '',
    middleName: null,
    onMiddleOk: () => {},
  }

  render() {
    const {
      intl, title, content, onOk, onCancel, onMiddleOk, middleName, okName,
    } = this.props;

    return (
      <div className="app-cmodal">
        <div className="app-cmodal-title">{ title }</div>
        <div className="app-cmodal-content">{ content }</div>
        <div className="app-cmodal-btns">
          <Button onClick={onCancel}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          {middleName && <Button type="primary" onClick={onMiddleOk}>{middleName}</Button>}
          <Button type="primary" onClick={onOk}>{okName}</Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(Cmodal);
