import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Form, Button, DatePicker, Select } from 'antd';
import { injectIntl } from 'react-intl';
import moment from 'moment';

class Filter extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    form: object.isRequired,
    onSearch: func.isRequired,
  }

  handleSubmit = e => {
    e.preventDefault();

    const { onSearch } = this.props;

    this.props.form.validateFieldsAndScroll((err, {
      range,
      ...values
    }) => {
      if (!err) {
        const [begin, end] = range;
        const options = {
          ...values,
          begin: new Date(begin).getTime(),
          end: new Date(end).getTime(),
        };

        onSearch(options);
      }
    });
  }

  render() {
    const { form, intl: { formatMessage } } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Form
          className="app-page__filter"
          layout="inline"
          onSubmit={this.handleSubmit}
        >
          <div className="fl">
            <Form.Item label={formatMessage({ id: 'App.system.log.funType' })}>
              {getFieldDecorator('funType')(
                <Select style={{ width: 80 }}>
                  <Select.Option value={0}>{formatMessage({ id: 'App.system.log.funType0' })}</Select.Option>
                  <Select.Option value={1}>{formatMessage({ id: 'App.system.log.funType1' })}</Select.Option>
                  <Select.Option value={2}>{formatMessage({ id: 'App.system.log.funType2' })}</Select.Option>
                  <Select.Option value={3}>{formatMessage({ id: 'App.system.log.funType3' })}</Select.Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'App.system.log.doType' })}>
              {getFieldDecorator('doType')(
                <Select>
                  <Select.Option value={0}>{formatMessage({ id: 'App.system.log.doType0' })}</Select.Option>
                  <Select.Option value={1}>{formatMessage({ id: 'App.system.log.doType1' })}</Select.Option>
                  <Select.Option value={2}>{formatMessage({ id: 'App.system.log.doType2' })}</Select.Option>
                  <Select.Option value={3}>{formatMessage({ id: 'App.system.log.doType3' })}</Select.Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'App.system.log.time' })}>
              {getFieldDecorator('range')(
                <DatePicker.RangePicker
                  style={{ width: 330 }}
                  showTime={{
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
                  format="YYYY-MM-DD HH:mm:ss"
                />,
              )}
            </Form.Item>
            <Form.Item className="buttons-group">
              <Button type="primary" htmlType="submit" icon="search">
                {formatMessage({ id: 'App.control.search' })}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields({
    filter: {
      funType = 0,
      doType = 0,
      begin,
      end,
    },
  }) {
    const { createFormField } = Form;

    return {
      funType: createFormField({
        value: funType,
      }),
      doType: createFormField({
        value: doType,
      }),
      range: createFormField({
        value: begin && end ? [moment(begin), moment(end)] : [],
      }),
    };
  },
})(injectIntl(Filter));
