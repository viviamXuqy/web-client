import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';

import ResultsCard from 'shared/components/ResultsCard';

import Cookies from 'js-cookie';

import { BASE64_IMG_JPEG } from 'constants/config';

import { img } from '../../../../../api/schema/image';

import configureStore from '../../../../store/__tests__/configureStore.test';

const { state } = configureStore;

function initializeData() {
  Cookies.set('user', JSON.stringify(state.user));
}

const fetchResult = jest.fn(() => Promise.resolve({ response: 'success' }));
const onDelete = jest.fn();
const onSelect = jest.fn();
const showResultDetail = jest.fn();

const result = {
  id: 1,
  taskId: 1,
  time: '1529355966000',
  taskType: 1,
  targetType: 'car',
  taskName: 'test1',
  address: 'test2',
  ratio: '3392x2008',
  image: '',
};
const getImg = jest.fn(id => Promise.resolve({ response: { image: img, id } }));

const initProps = {
  isResultList: true,
  result,
  fetchResult,
  getImg,
  onDelete,
  onSelect,
  showResultDetail,
  isSelected: false,
};

const setup = (props = initProps) => {
  const component = <ResultsCard {...props} />;
  const componentWithProvider = createComponentWithIntl(component);
  const wrapper = mountWithIntl(component);

  return {
    component,
    componentWithProvider,
    wrapper,
  };
};

describe('ResultsCard component', () => {
  beforeEach(() => {
    initializeData();
  });

  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it("should render correct things when 'isResultList' is false", () => {
    const { wrapper } = setup();

    expect(wrapper.find('Radio').length).toBe(1);

    wrapper.setProps({
      ...wrapper.props(),
      isResultList: false,
    });

    expect(wrapper.find('Radio').length).toBe(0);
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('Radio').length).toBe(1);

    expect(wrapper.find('.results-card-content').length).toBe(1);
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should call 'componentWillUnmount' correct when unmount", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();

    const spyWillUnmount = jest.spyOn(instance, 'componentWillUnmount');

    expect(spyWillUnmount.mock.calls.length).toBe(0);

    wrapper.unmount();

    expect(spyWillUnmount.mock.calls.length).toBe(1);
  });

  it("should call 'getImg' method during componentDidUpdate", async () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();

    const spyDidUpdate = jest.spyOn(instance, 'componentDidUpdate');
    const spyHandleImgShow = jest.spyOn(instance, 'handleImgShow');

    wrapper.setProps({
      ...wrapper.props(),
      result: {
        ...result,
        id: 2,
        image: '',
      },
    });

    expect(spyDidUpdate.mock.calls.length).toBe(1);

    expect(spyHandleImgShow).toHaveBeenCalledTimes(1);

    await expect(getImg).toBeCalled();

    expect(instance.state.imgUrl).toBe(BASE64_IMG_JPEG + img);
  });

  it("should render 'imgUrl' right", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();

    const spyHandleImgShow = jest.spyOn(instance, 'handleImgShow');

    wrapper.setProps({
      ...wrapper.props(),
      result: {
        ...result,
        id: 2,
        image: `${BASE64_IMG_JPEG}${img}`,
      },
    });

    expect(spyHandleImgShow).toHaveBeenCalledTimes(1);

    expect(instance.state.imgUrl).toBe(BASE64_IMG_JPEG + img);
  });

  it("should call 'handleImgClick' when Avatar clicked", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();

    const avatar = wrapper.find('Avatar');

    const spyHandleImgClick = jest.spyOn(instance, 'handleImgClick');

    avatar.simulate('click');

    expect(spyHandleImgClick).toBeCalled();
  });

  it("should call 'handleMouseDown' and 'onDelete' when div content clicked and event args is 'resultDel'", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();

    const divhand = wrapper.find('.divhand');

    const spyHandleMouseDown = jest.spyOn(instance, 'handleMouseDown');

    divhand.simulate('mouseDown', { target: { name: 'resultDel' } });

    expect(spyHandleMouseDown).toBeCalled();
  });

  it("should call 'handleMouseDown' and 'onSelect' when div content clicked and event args is 'resultSelect'", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();

    const divhand = wrapper.find('.divhand');

    const spyHandleMouseDown = jest.spyOn(instance, 'handleMouseDown');

    divhand.simulate('mouseDown', { target: { name: 'resultSelect' } });

    expect(spyHandleMouseDown).toBeCalled();
  });
});
