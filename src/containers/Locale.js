import React, { PureComponent } from 'react';
import { element } from 'prop-types';
import { LocaleProvider } from 'antd';
import { IntlProvider, addLocaleData } from 'react-intl';

import { getAppLocale } from '../utils/locale';
import { getLang } from '../utils';

let forceRerender = 0;

class Locale extends PureComponent {
  static propTypes = {
    children: element.isRequired,
  }

  render() {
    const { children } = this.props;
    const lang = getLang();
    const appLocale = getAppLocale(lang);
    const {
      antd, locale, messages, data,
    } = appLocale;

    addLocaleData(data);
    forceRerender += 1;

    return (
      <LocaleProvider locale={antd}>
        <IntlProvider locale={locale} messages={messages}>
          <React.Fragment key={forceRerender/* HACK: just force render when locale change */}>
            {children}
          </React.Fragment>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

export default Locale;
