import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';

import { message } from 'antd';

import Filter from 'components/Results/Filter';

const spyMessage = jest.spyOn(message, 'warn');

const onSearch = jest.fn();

const initProps = {
  onSearch,
};

const setup = (props = initProps) => {
  const component = <Filter {...props} />;
  const componentWithProvider = createComponentWithIntl(component);
  const wrapper = mountWithIntl(component);

  return {
    component,
    componentWithProvider,
    wrapper,
  };
};

describe('Filter component', () => {
  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.ant-form.ant-form-inline.app-page__filter').length).toBe(1);
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should call 'onSearch' when form submit clicked", () => {
    const { wrapper } = setup();
    const { form } = wrapper.children().children().props();
    const formEl = wrapper.find('.ant-form');

    const filters = {
      search: 'xxx',
      begin: undefined,
      end: undefined,
      taskBeginId: '',
      taskEndId: '',
    };

    form.setFieldsValue(filters);

    formEl.simulate('submit');

    expect(onSearch).toBeCalledWith(filters);
  });

  it("should call 'message' when taskBeginId or taskEndId is undefined", () => {
    const { wrapper } = setup();
    const { form } = wrapper.children().children().props();
    const formEl = wrapper.find('.ant-form');

    const filters = {
      search: 'xxx',
      begin: undefined,
      end: undefined,
      taskBeginId: 1,
      taskEndId: '',
    };

    form.setFieldsValue(filters);

    formEl.simulate('submit');

    expect(spyMessage).toBeCalledWith('请输入任务ID');
  });
});
