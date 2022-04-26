import React, { PureComponent } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import Cookies from 'js-cookie';

import { updateUser as updateUserAction } from '../../actions/user';

class LogoutPage extends PureComponent {
  static propTypes = {
    replace: func.isRequired,
    updateUser: func.isRequired,
  }

  componentDidMount() {
    const { updateUser } = this.props;

    updateUser();
    Cookies.remove('token');
    Cookies.remove('user');
    this.props.replace('/login');
  }

  render() {
    return (
      <div />
    );
  }
}

export default connect(null, {
  replace,
  updateUser: updateUserAction,
})(LogoutPage);
