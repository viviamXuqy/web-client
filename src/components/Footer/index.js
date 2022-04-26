import React from 'react';
import { Layout } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { object } from 'prop-types';
import './index.css';

const { Footer } = Layout;

const AppFooter = ({ intl, router }) => {
  const path = router.location.pathname;
  const pathKey = path.substring(path.indexOf('/'));

  return (
    <Footer className={`app-footer ${pathKey === '/smartapp/monitor' && 'app-smartapp__monitor-bg'}`}>
        Copyright © 2015 - 2018 Shufeng. All Rights Reserved.
        &nbsp;&nbsp;&nbsp;&nbsp;
      {intl.locale === 'zh-CN' && <FormattedMessage id="App.footer.copyright" />}
    </Footer>
  );
};

AppFooter.propTypes = {
  intl: object.isRequired,
  router: object.isRequired,
};
export default injectIntl(AppFooter);
