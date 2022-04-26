import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';
import { MemoryRouter } from 'react-router-dom';

import Cookies from 'js-cookie';

import MiddleList from 'components/HomeIndex/MiddleList';

import configureStore from '../../../store/__tests__/configureStore.test';

const { state } = configureStore;

const initProps = {
  lang: 'zh-CN',
};

function initializeData() {
  Cookies.set('user', JSON.stringify({grade:3 }));
  // Cookies.set('user', JSON.stringify(state.user));
}

const setup = (props = initProps) => {
  const component = <MiddleList {...props} />;

  const componentWithRouter = (
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );

  const componentWithProvider = createComponentWithIntl(componentWithRouter);

  const wrapper = mountWithIntl(componentWithRouter);

  return {
    componentWithProvider,
    wrapper,
  };
};

describe('HomeIndex MiddleList component', () => {
  beforeEach(() => {
    initializeData();
  });

  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.text-center').length).toBe(5);
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
