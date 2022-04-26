import moment from 'moment';
import 'moment/locale/zh-cn';

import logoImg from '../assets/images/logo.svg';
import logoImgEn from '../assets/images/logo_en.svg';

import zhCN from '../locales/zh-CN';
import enUS from '../locales/en-US';

const locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export const getAppLocale = (locale = 'en-US') => {
  switch (locale) {
    case 'zh-CN':
      moment.locale('zh-cn');
      break;
    case 'en-US':
    default:
      moment.locale('en');
      break;
  }

  return locales[locale];
};

export const getLocalLogo = lang => (lang === 'zh-CN' ? logoImg : logoImgEn);
