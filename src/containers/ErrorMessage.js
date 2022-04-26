import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { string, object, func } from 'prop-types';
import { message } from 'antd';
import { injectIntl } from 'react-intl';

import * as actions from '../actions/errorMessage';

class ErrorMessage extends PureComponent {
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    intl: object.isRequired,
    error: string.isRequired,
    hideErrorMessage: func.isRequired,
  }

  state = {}

  static getDerivedStateFromProps(nextProps) {
    const { intl, error, hideErrorMessage } = nextProps;
    if (error) {
      message.error(
        intl.formatMessage({ id: error }),
        () => {
          hideErrorMessage();
        },
      );
    }
    return {
      error,
    };
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = state => ({
  error: state.system.error,
});

export default connect(mapStateToProps, {
  hideErrorMessage: actions.hideErrorMessage,
})(injectIntl(ErrorMessage));
