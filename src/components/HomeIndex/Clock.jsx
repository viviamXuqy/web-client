import React, { PureComponent } from 'react';
import { object } from 'prop-types';
import moment from 'moment';

import { showDay } from '../../utils';
import { injectIntl } from 'react-intl';

class Clock extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  // 当组件输出到 DOM 后会执行 componentDidMount() 钩子
  componentDidMount() {
    this.timerId = setInterval(
      () => this.tick(), 1000,
    );
  }

  // 组件被从DOM中移除，React会调用componentWillUnmount()这个钩子函数，此时可以卸载定时器
  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick() {
    this.setState({ date: new Date() });
  }

  render() {
    const { intl } = this.props;

    return (
      <div>
        <div className="index-page-font index-page-color">{moment(this.state.date).format('YYYY-MM-DD')} {showDay(this.state.date, intl.locale)}</div>
        <div className="app-bold index-page-font index-page-color">
          {moment(this.state.date).format('HH:mm:ss')}
        </div>
      </div>
    );
  }
}

export default (injectIntl(Clock));
