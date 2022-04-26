import React from 'react';
import renderer from 'react-test-renderer'; // eslint-disable-line
import LocaleProvider from 'containers/Locale';
import { setStore } from '../utils/storage';
import { nodeWithIntlProp } from './intl-enzyme-test-helper';

const createComponentWithIntl = (children, props = { lang: 'zh-CN' }) => {
  setStore('locale', props.lang);
  return renderer.create(
    <LocaleProvider {...props}>
      {nodeWithIntlProp(children)}
    </LocaleProvider>,
  );
};

export default createComponentWithIntl;
