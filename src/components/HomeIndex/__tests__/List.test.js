import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';

import List from 'components/HomeIndex/List';

import { getResults } from 'selectors';

import configureStore from '../../../store/__tests__/configureStore.test';

jest.mock('shared/containers/ResultsCard', () => 'mock-comp1');
jest.mock('shared/containers/ResultDetail', () => 'mock-comp2');

const { state } = configureStore;

const initProps = {
  results: getResults(state),
  meta: {
    page: 100000000,
    pageSize: 5,
    total: 100,
  },
  lang: 'zh-CN',
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

describe('HomeIndex List component', () => {
  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('Item').length).toBe(5);
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should show modal correct', async () => {
    const { wrapper } = setup();

    const instance = wrapper.children().instance();

    const spyShowModal = jest.spyOn(instance, 'showModal');

    const result = {
      _id: 1,
      taskId: 1,
      time: '1529355966000',
      taskType: 1,
      targetType: 'car',
      taskName: 'test',
      address: 'test',
      ratio: '3392x2008',
      personFeatures: [],
      carFeatures: [],
      objectFeatures: [
        {
          type: '行人',
          area: [100, 200, 60, 60],
        },
      ],
      personPose: [],
    };

    await spyShowModal(result);

    expect(instance.state).toEqual({
      currResult: result,
      modalVisible: true,
    });
  });
});
