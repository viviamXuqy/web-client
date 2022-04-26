import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';
import { pickBy } from 'lodash';

import SignInForm from 'components/SignIn/SignInForm';

const signIn = jest.fn();

const initProps = {
  signIn,
};

const setup = (props = initProps) => {
  const component = <SignInForm {...props} />;
  const componentWithProvider = createComponentWithIntl(component);
  const wrapper = mountWithIntl(component);

  return {
    componentWithProvider,
    wrapper,
  };
};

describe('SignIn SignInForm component', () => {
  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.ant-form.ant-form-vertical').length).toBe(1);
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render errors when form submit with wrong inputs', () => {
    const { wrapper } = setup();
    const { form } = wrapper.children().children().props();
    const formEl = wrapper.find('.ant-form');

    // hack mock validateFieldsAndScroll to validateFields in case of error in test
    form.validateFieldsAndScroll = form.validateFields;

    formEl.simulate('submit');

    const errors = form.getFieldsError();
    const pickedErrors = pickBy(errors, v => v !== undefined);

    expect(pickedErrors).toEqual({
      username: ['请输入用户名'],
      password: ['请输入密码'],
    });
  });

  it("should call 'signIn' when form submit with right inputs", () => {
    const { wrapper } = setup();
    const { form } = wrapper.children().children().props();
    const formEl = wrapper.find('.ant-form');

    const inputs = {
      username: 'admin',
      password: 'admin',
    };

    form.setFieldsValue(inputs);

    formEl.simulate('submit');

    expect(signIn).toBeCalledWith(inputs);
  });
});
