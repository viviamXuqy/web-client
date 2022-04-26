import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';

import SignIn from 'components/SignIn';

const initProps = {
  signIn: () => {},
  lang: 'zh-CN',
};
const setup = (props = initProps) => {
  const component = <SignIn {...props} />;
  const componentWithProvider = createComponentWithIntl(component);
  const wrapper = mountWithIntl(component);

  return {
    componentWithProvider,
    wrapper,
  };
};

describe('SignIn component', () => {
  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.sign-page').length).toBe(1);
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
