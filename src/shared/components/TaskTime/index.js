import React from 'react';
import { object, func, array } from 'prop-types';
import { Form, Icon } from 'antd';
import { injectIntl } from 'react-intl';

import moment from 'moment';

import { getTimeMs } from '../../../utils';

import TaskTimeNode from './TaskTimeNode';

const FormItem = Form.Item;

let uuid = 2;
class TaskTime extends React.PureComponent {
  static propTypes = {
    form: object.isRequired,
    onChangeStartTime: func.isRequired,
    onChangeEndTime: func.isRequired,
    onChangeDate: func.isRequired,
    onChangeRadio: func.isRequired,
    onRemoveTime: func.isRequired,
    onAddTime: func.isRequired,
    duration: array,
    intl: object.isRequired,
  }

  static defaultProps = {
    duration: [],
  }

  componentDidMount() {
    const { form, duration } = this.props;
    for (let i = 1; i < duration.length; i++) {
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(uuid);
      uuid++;
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      });
    }
  }

  componentWillUnmount() {
    uuid = 2;
  }

  handleChangeStartTime = (timeString, key) => {
    const { onChangeStartTime } = this.props;
    onChangeStartTime(Number(getTimeMs(timeString) * 1000), key);
  }

  handleChangeEndTime = (timeString, key) => {
    const { onChangeEndTime } = this.props;
    onChangeEndTime(Number(getTimeMs(timeString) * 1000), key);
  }

  handleChangeDate = (date, key) => {
    const { onChangeDate } = this.props;
    const time = moment(moment(date).format('YYYY-MM-DD').valueOf()).valueOf();
    onChangeDate(Number(time), key);
  }

  handleChangeRadio = (value, key) => {
    const { onChangeRadio } = this.props;
    onChangeRadio(value, key);
  }

  remove = k => {
    const { form, onRemoveTime } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    onRemoveTime(k);
  }

  add = () => {
    const { form, onAddTime } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const key = uuid;
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
    onAddTime(key);
  }

  render() {
    const { form, duration, intl } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('keys', { initialValue: [] });
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <FormItem
        {...formItemLayout}
        key={k}
      >
        <TaskTimeNode
          onChangeDate={date => this.handleChangeDate(date, k)}
          onChangeStartTime={(time, timeString) =>
            this.handleChangeStartTime(timeString, k)}
          onChangeEndTime={(time, timeString) => this.handleChangeEndTime(timeString, k)}
          onChangeRadio={value => this.handleChangeRadio(value, k)}
          index={index + 2}
          durationItem={duration.find(d => d.key === k)}
          intl={intl}
        />
        {keys.length > 0 ? (
          <div style={{ marginTop: -38, marginRight: -10 }} className="fr">
            <Icon
              className="dynamic-delete-button"
              style={{ cursor: 'pointer' }}
              type="minus-circle-o"
              disabled={keys.length === 0}
              onClick={() => this.remove(k)}
            />
          </div>
          ) : null}
      </FormItem>
    ));
    return (
      <Form>
        <FormItem {...formItemLayout}>
          <TaskTimeNode
            onChangeDate={date => this.handleChangeDate(date, 1)}
            onChangeStartTime={(time, timeString) => this.handleChangeStartTime(timeString, 1)}
            onChangeEndTime={(time, timeString) => this.handleChangeEndTime(timeString, 1)}
            onChangeRadio={value => this.handleChangeRadio(value, 1)}
            index={1}
            durationItem={duration[0]}
            intl={intl}
          />
        </FormItem>
        {formItems}
        <FormItem {...formItemLayout}>
          <button className="tablelink" onClick={this.add}>+{intl.formatMessage({ id: 'App.RT.add.newTime' })}</button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(injectIntl(TaskTime));
