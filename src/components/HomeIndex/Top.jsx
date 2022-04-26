import React from 'react';
import { FormattedMessage } from 'react-intl';
import { string } from 'prop-types';

import Clock from './Clock';


const Top = ({
  lang,
}) => (
  <div className="index-page-top">
    <center>
      <div className="index-page-color index-page-font-32"><FormattedMessage id="App.public.system.title" /></div>
      <Clock lang={lang} />
    </center>
  </div>
);

Top.propTypes = {
  lang: string.isRequired,
};

export default Top;
