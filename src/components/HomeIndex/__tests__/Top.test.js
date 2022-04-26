import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';

import Top from 'components/HomeIndex/Top';

const initProps = {
  lang: 'zh-CN',
};

const setup = (props = initProps) => {
  const component = <Top {...props} />;
  const componentWithProvider = createComponentWithIntl(component);
  const wrapper = mountWithIntl(component);

  return {
    componentWithProvider,
    wrapper,
  };
};

describe('HomeIndex Top component', () => {
  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('Clock').length).toBe(1);
  });
});
