import React from 'react';
import { mountWithIntl } from 'helpers/intl-enzyme-test-helper';

import Clock from 'components/HomeIndex/Clock';

const initProps = {
  lang: 'zh-CN',
};

const setup = (props = initProps) => {
  const component = <Clock {...props} />;
  const wrapper = mountWithIntl(component);

  return {
    wrapper,
  };
};

describe('HomeIndex Clock component', () => {
  it('should render without errors', () => {
    const { wrapper } = setup();

    expect(wrapper).toBeTruthy();
  });

  it('should render correct things', () => {
    const { wrapper } = setup();

    expect(wrapper.find('.index-page-font').length).toBe(2);
  });

  beforeEach(() => {
    // Call jest.useFakeTimers(); to enable fake timers
    jest.useFakeTimers();
  });

  it("waits 1 second foreach tick and should call 'setInterval' once when executing the timer", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    // state and start the interval for `tick` on a 1000ms interval.
    expect(setInterval.mock.calls.length).toBe(1);
    expect(setInterval.mock.calls[0][1]).toBe(1000);

    const spyTick = jest.spyOn(instance, 'tick');

    // make sure `tick` hasn't been called yet.
    expect(spyTick).not.toBeCalled();

    // Only the currently pending timer (but not any new timer created in the process)
    // However, we do expect it to be called on the next interval tick.
    jest.runOnlyPendingTimers();

    expect(spyTick).toBeCalled();
    expect(instance.timerId > 0).toBeTruthy();

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });

  it("lifecycle 'componentWillUnmount' method should have been called when unmount and should call 'clearInterval'", () => {
    const { wrapper } = setup();
    const instance = wrapper.children().instance();

    const spyWillUnmount = jest.spyOn(instance, 'componentWillUnmount');

    expect(spyWillUnmount.mock.calls.length).toBe(0);

    // unmount and test componentWillUnmount
    wrapper.unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(spyWillUnmount.mock.calls.length).toBe(1);
  });
});
