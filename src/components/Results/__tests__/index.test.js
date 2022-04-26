import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';
import Cookies from 'js-cookie';

import { Modal, message } from 'antd';

import { getResults } from 'selectors';

import Results from 'components/Results';

import configureStore from '../../../store/__tests__/configureStore.test';

const { state } = configureStore;

const spyModalConfirm = jest.spyOn(Modal, 'confirm');
const spyMessage = jest.spyOn(message, 'success');

jest.mock('shared/containers/ResultDetail', () => 'mock-ResultDetail');
jest.mock('shared/containers/ResultStructSearch', () => 'mock-ResultStructSearch');
jest.mock('containers/layout/Sider', () => 'mock-Sider');
jest.mock('shared/containers/ResultsCard', () => 'mock-ResultsCard');

const fetchResults = jest.fn();
const updateFilter = jest.fn();
const deleteResults = jest.fn(() => Promise.resolve({ response: 'success' }));
const deleteAllResults = jest.fn(() => Promise.resolve({ response: 'success' }));
const clearDatas = jest.fn();

const initProps = {
  results: getResults(state),
  filter: {
  },
  meta: {
    page: 100000000,
    pageSize: 5,
    total: 100,
  },
  fetchResults,
  updateFilter,
  deleteResults,
  deleteAllResults,
  clearDatas,
};

function initializeData() {
  // Cookies.set('user', JSON.stringify(state.user));
  const user = {
    grade: 3,
  };
  Cookies.set('user', JSON.stringify(user));
}

const setup = (props = initProps) => {
  const component = <Results {...props} />;
  const componentWithProvider = createComponentWithIntl(component);
  const wrapper = mountWithIntl(component);

  return {
    component,
    componentWithProvider,
    wrapper,
  };
};

describe('Results component', () => {
  beforeEach(() => {
    initializeData();
  });

  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.app-page').length).toBe(1);
  });

  it('should render correct things when isReset is true', () => {
    const { wrapper } = setup();

    const instance = wrapper.children().instance();

    instance.setState({
      isReset: true,
    });

    expect(instance.state.isReset).toBeTruthy();
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should call 'handleFetchResults/updateFilter/fetchResults' during componentDidMount", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();
    const spyHandleFetchResults = jest.spyOn(instance, 'handleFetchResults');
    const spyUpdateFilter = jest.spyOn(instance, 'updateFilter');

    instance.componentDidMount();

    expect(spyHandleFetchResults).toHaveBeenCalledTimes(1);
    expect(spyUpdateFilter).toBeCalled();
    expect(updateFilter).toBeCalled();
    expect(fetchResults).toBeCalled();
  });

  it("should call 'clearDatas' during componentWillUnmount", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();
    const spyWillUnmount = jest.spyOn(instance, 'componentWillUnmount');

    wrapper.unmount();

    expect(spyWillUnmount).toHaveBeenCalledTimes(1);
    expect(clearDatas).toBeCalled();
  });

  it("should call 'handleSearch' when reset button clicked", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();
    const spyHandleSearch = jest.spyOn(instance, 'handleSearch');

    wrapper.find('.app-page__actions').children().at(4).simulate('click');

    expect(spyHandleSearch).toBeCalled();
  });

  it("should call 'handleFetchTaskResults' when pagination click", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();
    const spyHandleFetchResults = jest.spyOn(instance, 'handleFetchResults');

    wrapper.find('.ant-pagination-item').at(1).simulate('click');

    expect(spyHandleFetchResults).toBeCalled();
    expect(instance.state.page).toBe(2);
  });

  it("should show result detail modal when ResultsCard 'showResultDetail' and hide modal when closed", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    wrapper.find('mock-ResultsCard').first().props().showResultDetail();

    expect(instance.state.modalVisible).toBeTruthy();

    wrapper.update();

    wrapper.find('Modal .ant-modal-close-x').simulate('click');

    expect(instance.state.modalVisible).toBeFalsy();
  });

  it('should show struct search modal when struct search button clicked and hide modal when closed', () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    wrapper.find('.app-page__actions').children().at(0).simulate('click');

    expect(instance.state.modalVisibleStructSearch).toBeTruthy();

    wrapper.find('Modal .ant-modal-close-x').simulate('click');

    expect(instance.state.modalVisible).toBeFalsy();
  });

  it('should show feature search modal when feature search button clicked and hide modal when closed', () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    wrapper.find('.app-page__actions').children().at(1).simulate('click');

    expect(instance.state.modalVisibleFeatureSearch).toBeTruthy();

    wrapper.find('Modal .ant-modal-close-x').simulate('click');

    expect(instance.state.modalVisible).toBeFalsy();
  });

  it("should call 'handleDelete' when ResultsCard 'onDelete'", async () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    wrapper.find('mock-ResultsCard').first().props().onDelete(['1']);
    wrapper.update();

    expect(instance.state.delSize).toBe(1);
    expect(spyModalConfirm).toBeCalled();

    const spyDeleteResults = jest.spyOn(instance, 'deleteResults');

    spyDeleteResults(['1']);

    await expect(deleteResults).toBeCalledWith(['1']);

    expect(spyMessage).toBeCalledWith('成功删除');
    expect(instance.state.selectedKeys.length).toBe(0);
  });

  it("should call 'handleDelete' when ResultsCard 'onDelete' with more same args", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    wrapper.find('mock-ResultsCard').first().props().onDelete(['1', '1']);

    wrapper.update();

    expect(instance.state.delSize).toBe(2);
    expect(spyModalConfirm).toBeCalled();
  });

  it("should call 'handleSelect' when ResultsCard 'onSelect'", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    wrapper.find('mock-ResultsCard').first().props().onSelect('1');

    expect(instance.state.selectedKeys.length).toBe(1);
  });

  it("should call 'handleSelect' when ResultsCard 'onSelect' with selectedKeys has the same key", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    instance.setState({
      selectedKeys: ['1'],
    });

    wrapper.find('mock-ResultsCard').first().props().onSelect('1');

    expect(instance.state.selectedKeys.length).toBe(0);
  });

  it("should call 'handleDeleteAllResults' when clear button clicked", async () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();
    const spyDeleteAllResults = jest.spyOn(instance, 'deleteAllResults');

    wrapper.find('.app-page__actions').children().at(3).simulate('click');

    expect(spyModalConfirm).toBeCalled();

    spyDeleteAllResults();

    await expect(deleteAllResults).toBeCalled();

    expect(spyMessage).toBeCalledWith('成功清空');
    expect(fetchResults).toBeCalled();
  });

  it("should call 'handleMultiDelete' when deleteMore button clicked and ResultsCard 'onSelect'", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();
    const spyHandleDelete = jest.spyOn(instance, 'handleDelete');

    wrapper.find('mock-ResultsCard').first().props().onSelect('1');

    expect(instance.state.selectedKeys.length).toBe(1);

    wrapper.find('.app-page__actions').children().at(2).simulate('click');

    expect(spyHandleDelete).toBeCalledWith(['1']);
  });
});
