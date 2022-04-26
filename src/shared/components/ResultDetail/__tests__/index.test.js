import React from 'react';
import createComponentWithIntl from 'helpers/createComponentWithIntl';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';
import * as utils from '../../../../utils';

import ResultDetail from 'shared/components/ResultDetail';

import { BASE64_IMG_JPEG } from 'constants/config';

import { img } from '../../../../../api/schema/image';

const getImg = jest.fn(() => Promise.resolve({ response: { image: img } }));

jest.mock('utils');
utils.getImgNaturalDimensions = jest.fn(() => Promise.resolve({ w: 1024, h: 768 }));

const currResult = {
  _id: 1,
  taskId: 1,
  time: '1529355966000',
  taskType: 1,
  targetType: 'car',
  taskName: 'test',
  address: 'test',
  ratio: '3392x2008',
  personFeatures: [
    {
      area: [248, 468, 66, 131],
      attri: {
        age: '中年',
        baby: '未抱小孩',
        bag: '未拎东西',
        bottomcolor: '灰',
        bottomtype: '长裤',
        glasses: '无眼镜',
        hair: '短发',
        hat: '未戴帽子',
        knapsack: '未背双肩包',
        mask: '无口罩',
        messengerbag: '非斜挎包',
        orientation: '后',
        sex: '男',
        shoulderbag: '非单肩包',
        type: '摩托车',
        umbrella: '未打伞',
        uppercolor: '白',
        uppertexture: '纯色',
        uppertype: '短袖',
      },
    },
    {
      area: [547, 249, 185, 213],
      attri: {
        age: '青年',
        baby: '未抱小孩',
        bag: '未拎东西',
        bottomcolor: '深灰',
        bottomtype: '短裤',
        glasses: '戴眼镜',
        hair: '马尾',
        hat: '未戴帽子',
        knapsack: '未背双肩包',
        mask: '无口罩',
        messengerbag: '非斜挎包',
        orientation: '侧',
        sex: '女',
        shoulderbag: '非单肩包',
        type: '摩托车',
        umbrella: '未打伞',
        uppercolor: '黑',
        uppertexture: '纯色',
        uppertype: '短袖',
      },
    },
    {
      area: [590, 390, 271, 259],
      attri: {
        age: '青年',
        baby: '未抱小孩',
        bag: '未拎东西',
        bottomcolor: '灰',
        bottomtype: '长裤',
        glasses: '无眼镜',
        hair: '短发',
        hat: '未戴帽子',
        knapsack: '双肩包（有包）',
        mask: '无口罩',
        messengerbag: '非斜挎包',
        orientation: '侧',
        sex: '男',
        shoulderbag: '非单肩包',
        type: '自行车',
        umbrella: '未打伞',
        uppercolor: '黑',
        uppertexture: '纯色',
        uppertype: '短袖',
      },
    },
    {
      area: [396, 524, 103, 326],
      attri: {
        age: '青年',
        baby: '未抱小孩',
        bag: '未拎东西',
        bottomcolor: '蓝',
        bottomtype: '长裤',
        glasses: '无眼镜',
        hair: '短发',
        hat: '未戴帽子',
        knapsack: '未背双肩包',
        mask: '无口罩',
        messengerbag: '非斜挎包',
        orientation: '侧',
        sex: '男',
        shoulderbag: '非单肩包',
        type: '自行车',
        umbrella: '未打伞',
        uppercolor: '白',
        uppertexture: '纯色',
        uppertype: '短袖',
      },
    },
  ],
  carFeatures: [
    {
      brand: // 车品牌，车品牌可能被识别成多种
      '客车-金旅',
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [9, 4, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: '浙A12345', // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [190, 225, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'car', // 车类型，目前支持 car, bus, truck, motorbike
    },
    {
      brand: // 车品牌，车品牌可能被识别成多种
      '克莱斯勒-大捷龙(进口)',
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [709, 464, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: '鄂A67890', // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [990, 595, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'bus', // 车类型，目前支持 car, bus, truck, motorbike
    },
    {
      brand: // 车品牌，车品牌可能被识别成多种
      '客车-金旅',
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [9, 4, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: '浙A12345', // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [190, 225, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'car', // 车类型，目前支持 car, bus, truck, motorbike
    },
    {
      brand: // 车品牌，车品牌可能被识别成多种
      '克莱斯勒-大捷龙(进口)',
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [709, 464, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: '鄂A67890', // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [990, 595, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'bus', // 车类型，目前支持 car, bus, truck, motorbike
    },
    {
      brand: // 车品牌，车品牌可能被识别成多种
      '客车-金旅',
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [9, 4, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: '浙A12345', // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [190, 225, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'car', // 车类型，目前支持 car, bus, truck, motorbike
    },
  ],
  objectFeatures: [
    {
      type: '行人',
      area: [100, 200, 60, 60],
    },
    {
      type: '车辆',
      area: [300, 400, 203, 150],
      occupantNum: 1,
    },
  ],
  personPose: [
    {
      type: '行人',
      area: [100, 200, 60, 60],
      pose: [
        { x: 20, y: 20 }, { x: 20, y: 30 },
      ],
    },
    {
      type: '行人',
      area: [300, 400, 60, 60],
      pose: [
        { x: 10, y: 20 }, { x: 20, y: 30 },
      ],
    },
  ],
};

const initProps = {
  currResult,
  getImg,
  lang: 'zh-CN',
};

const setup = (props = initProps) => {
  const component = <ResultDetail {...props} />;
  const componentWithProvider = createComponentWithIntl(component);
  const wrapper = mountWithIntl(component);

  return {
    component,
    componentWithProvider,
    wrapper,
  };
};

describe('ResultDetail component', () => {
  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.result-detail').length).toBe(1);
  });

  it("should render right thing and don't change unexpected", () => {
    const { componentWithProvider } = setup();
    const tree = componentWithProvider.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should render correct things when 'StructShow' is more", () => {
    const { wrapper } = setup();

    expect(wrapper.find('StructShow').length > 0).toBeTruthy();
  });

  it("should call 'handleImgShow' during componentDidMount", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();
    const spyHandleImgShow = jest.spyOn(instance, 'handleImgShow');
    const spyDidMount = jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(spyDidMount.mock.calls.length).toBe(1);
    expect(spyHandleImgShow).toHaveBeenCalledTimes(1);
  });

  it("should call 'handleImgShow' during componentDidMount when result's image is not null", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();
    const spyHandleImgShow = jest.spyOn(instance, 'handleImgShow');

    wrapper.setProps({
      ...wrapper.props(),
      currResult: {
        ...currResult,
        image: `${BASE64_IMG_JPEG}${img}`,
      },
    });

    instance.componentDidMount();
    expect(spyHandleImgShow).toHaveBeenCalledTimes(1);
    expect(instance.state.imgUrl).not.toBeNull();
  });

  it("lifecycle 'componentWillUnmount' method should have been called when unmount", async () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    const spyDidMount = jest.spyOn(instance, 'componentDidMount');
    const spyWillUnmount = jest.spyOn(instance, 'componentWillUnmount');
    const spyImgLoaded = jest.spyOn(instance, 'imgLoaded');
    const spyHandleImgShow = jest.spyOn(instance, 'handleImgShow');
    const spySetState = jest.spyOn(instance, 'setState');

    expect(spyDidMount.mock.calls.length).toBe(0);

    instance.componentDidMount();

    expect(spyDidMount.mock.calls.length).toBe(1);
    expect(spyHandleImgShow).toHaveBeenCalledTimes(1);
    await expect(getImg).toBeCalled();

    spyImgLoaded();

    await expect(utils.getImgNaturalDimensions).toBeCalled();

    await expect(spySetState).toBeCalled();

    expect(instance.state.ctx).not.toBeNull();

    expect(spyWillUnmount.mock.calls.length).toBe(0);

    // unmount and test componentWillUnmount
    wrapper.unmount();
    expect(spyWillUnmount.mock.calls.length).toBe(1);
  });

  it("should call 'getImgNaturalDimensions' and 'setCanvas' and 'resetFeatures' when 'imgUrl' is not null", async () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    const spyImgLoaded = jest.spyOn(instance, 'imgLoaded');
    const spySetCanvas = jest.spyOn(instance, 'setCanvas');
    const spyResetFeatures = jest.spyOn(instance, 'resetFeatures');
    const spyHandleImgShow = jest.spyOn(instance, 'handleImgShow');
    const spySetState = jest.spyOn(instance, 'setState');

    instance.componentDidMount();
    expect(spyHandleImgShow).toHaveBeenCalledTimes(1);

    await expect(getImg).toBeCalled();
    expect(instance.state.imgUrl).not.toBeNull();

    spyImgLoaded();

    await expect(utils.getImgNaturalDimensions).toBeCalled();

    await await expect(spySetState).toBeCalled();

    expect(instance.state.ctx).not.toBeNull();

    await expect(spySetCanvas).toBeCalled();
    await expect(spyResetFeatures).toBeCalled();
  });

  it('should render target coordinates when carFeatures and personFeatures is empty', async () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    const spyHandleResetFeatures = jest.spyOn(instance, 'handleResetFeatures');
    const spyImgLoaded = jest.spyOn(instance, 'imgLoaded');

    wrapper.setProps({
      ...wrapper.props(),
      currResult: {
        ...currResult,
        carFeatures: [],
        personFeatures: [],
      },
    });

    await spyImgLoaded();

    expect(spyHandleResetFeatures).toBeCalled();
  });

  it('should render person pos when carFeatures and personFeatrues is empty', async () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    const spyHandleResetFeatures = jest.spyOn(instance, 'handleResetFeatures');
    const spyImgLoaded = jest.spyOn(instance, 'imgLoaded');

    wrapper.setProps({
      ...wrapper.props(),
      currResult: {
        ...currResult,
        carFeatures: [],
        personFeatures: [],
        objectFeatures: [],
      },
    });

    await spyImgLoaded();

    expect(spyHandleResetFeatures).toBeCalled();
  });

  it("should handle 'handleMouseMove' right", async () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    const spyImgLoaded = jest.spyOn(instance, 'imgLoaded');
    const spyHandleMouseMove = jest.spyOn(instance, 'handleMouseMove');
    const spyResetDraw = jest.spyOn(instance, 'resetDraw');

    await spyImgLoaded();

    await spyHandleMouseMove({ x: 249, y: 469 });

    expect(spyResetDraw).toBeCalled();
  });

  it("should handle 'handleMouseDown' right", async () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    const spyImgLoaded = jest.spyOn(instance, 'imgLoaded');
    const spyHandleMouseDown = jest.spyOn(instance, 'handleMouseDown');
    const spyResetDraw = jest.spyOn(instance, 'resetDraw');
    const spyHandleShowBigImg = jest.spyOn(instance, 'handleShowBigImg');

    await spyImgLoaded();

    await spyHandleMouseDown({ x: 591, y: 391 });

    expect(spyHandleShowBigImg).toBeCalled();
    expect(spyResetDraw).toBeCalled();
  });
});
