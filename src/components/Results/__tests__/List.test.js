import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';

import { getResults } from 'selectors';

import List from 'components/Results/List';

import configureStore from '../../../store/__tests__/configureStore.test';

const { state } = configureStore;

jest.mock('shared/containers/ResultsCard', () => 'mock-ResultsCard');

const onPaginationChange = jest.fn();
const onDelete = jest.fn();
const onSelect = jest.fn();
const showResultDetail = jest.fn();

const initProps = {
  results: getResults(state),
  meta: {
    page: 100000000,
    pageSize: 5,
    total: 100,
  },
  selectedKeys: [],
  onPaginationChange,
  onDelete,
  onSelect,
  showResultDetail,
};

const setup = (props = initProps) => {
  const component = <List {...props} />;
  const componentWithProvider = createComponentWithIntl(component);
  const wrapper = mountWithIntl(component);

  return {
    component,
    componentWithProvider,
    wrapper,
  };
};

describe('List component', () => {
  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.ant-list.results-list').length).toBe(1);
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
