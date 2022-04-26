import React from 'react';
import { object, func } from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { getLocalLogo } from '../../utils/locale';
import SignInForm from './SignInForm';
import './index.css';


const SignIn = ({
  intl,
  signIn,
}) => (
  <div className="main-wrapper sign-page">
    <div className="sign-page__box">
      <div className="sign-page__slogan">
        <h1>
          Hello,<br />
          Welcome<br />
          Back！
        </h1>
        <h2><FormattedMessage id="App.signIn.info" /></h2>
        <div className="app-logo">
          <img src={getLocalLogo(intl.locale)} alt="Logo" />
        </div>
      </div>
      <div className="sign-page__form">
        <h1><FormattedMessage id="App.signIn.title" /></h1>
        <SignInForm signIn={signIn} />
      </div>
    </div>
  </div>
);

SignIn.propTypes = {
  intl: object.isRequired,
  signIn: func.isRequired,
};

export default injectIntl(SignIn);
