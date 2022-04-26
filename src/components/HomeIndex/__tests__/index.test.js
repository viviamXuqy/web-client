import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';
import Cookies from 'js-cookie';

import { getResults } from 'selectors';

import HomeIndex from 'components/HomeIndex';

import configureStore from '../../../store/__tests__/configureStore.test';

const { state } = configureStore;

jest.mock('shared/containers/ResultsCard', () => 'mock-comp1');

function initializeData() {
  Cookies.set('user', JSON.stringify(state.user));
}

const fetchResults = jest.fn();
const updateFilter = jest.fn();

const initProps = {
  results: getResults(state),
  meta: {
    page: 100000000,
    pageSize: 5,
    total: 100,
  },
  fetchResults,
  updateFilter,
  lang: 'zh-CN',
};

const setup = (props = initProps) => {
  const component = <HomeIndex {...props} />;
  const componentWithRouter = (
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
  const componentWithProvider = createComponentWithIntl(componentWithRouter);
  const wrapper = mountWithIntl(componentWithRouter);

  return {
    component,
    componentWithProvider,
    wrapper,
  };
};

describe('HomeIndex component', () => {
  beforeEach(() => {
    initializeData();
  });

  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.index-page').length).toBe(1);
  });

  it("should call 'fetchResults' and 'updateFilter' rightly", () => {
    expect(updateFilter).toBeCalled();
    expect(fetchResults).toBeCalled();
  });
});
