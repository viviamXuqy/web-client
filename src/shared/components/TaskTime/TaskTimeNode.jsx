import React, { PureComponent } from 'react';
import { func, number, object } from 'prop-types';
import { TimePicker, DatePicker, Radio } from 'antd';

import moment from 'moment';

import { getTime } from '../../../utils';

import './index.css';

class TaskTimeNode extends PureComponent {
  static propTypes = {
    onChangeDate: func.isRequired,
    onChangeStartTime: func.isRequired,
    onChangeEndTime: func.isRequired,
    onChangeRadio: func.isRequired,
    index: number.isRequired, // 第几个任务
    durationItem: object,
    intl: object.isRequired,
  }

  static defaultProps = {
    durationItem: {},
  }

  state = {
    mType: 1,
  }

  // 1永续；2每日；3日期时间段
  componentDidMount() {
    const { type } = this.props.durationItem;

    this.setState({
      mType: type || 1,
    });
  }

  handleChangeStartTime = (time, timeString) => {
    const { onChangeStartTime } = this.props;

    onChangeStartTime(time, timeString);
  }

  handleChangeEndTime = (time, timeString) => {
    const { onChangeEndTime } = this.props;

    onChangeEndTime(time, timeString);
  }

  handleChangeDate = date => {
    const { onChangeDate } = this.props;

    this.setState({
      mType: 3,
    }, () => {
      onChangeDate(date);
    });
  }

  handleChangeRadio = e => {
    const { onChangeRadio } = this.props;

    this.setState({
      mType: e.target.value,
    }, () => {
      onChangeRadio(e.target.value);
    });
  }

  render() {
    const { mType } = this.state;
    const { index, durationItem, intl } = this.props;
    const { date, sTime, eTime } = durationItem;
    return (
      <div className="app-task-time-node">
        <span className="mr-15">
          {intl.formatMessage({ id: 'App.RT.add.time' })}{index}
        </span>
        <Radio.Group onChange={this.handleChangeRadio} value={mType}>
          <Radio value={1}>{intl.formatMessage({ id: 'App.RT.add.forever' })}</Radio>
          <Radio value={2}>{intl.formatMessage({ id: 'App.RT.add.everyday' })}</Radio>
        </Radio.Group>
        <DatePicker
          style={{ marginRight: 10 }}
          size="small"
          value={mType === 3 ? (date ? (moment(moment(date).format('YYYY-MM-DD'), 'YYYY-MM-DD')) : null) : null} // eslint-disable-line no-nested-ternary
          format="YYYY-MM-DD"
          onChange={this.handleChangeDate}
          className="w-110"
        />
        <TimePicker
          placeholder={intl.formatMessage({ id: 'App.public.startTime' })}
          style={{ marginRight: 10 }}
          size="small"
          onChange={this.handleChangeStartTime}
          defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
          defaultValue={sTime ? moment(getTime(sTime / 1000), 'HH:mm:ss') : null}
          className="w-110"
        />
        <TimePicker
          placeholder={intl.formatMessage({ id: 'App.public.endTime' })}
          size="small"
          onChange={this.handleChangeEndTime}
          defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
          defaultValue={eTime ? moment(getTime(eTime / 1000), 'HH:mm:ss') : null}
          className="w-110"
        />
      </div>
    );
  }
}

export default TaskTimeNode;
