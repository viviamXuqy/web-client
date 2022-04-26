import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Form, Button, Input, DatePicker, Select } from 'antd';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import { TASK_TYPE } from '../../../constants/config';

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
            <Form.Item>
              {getFieldDecorator('search')(
                <Input className="result-input" placeholder={formatMessage({ id: 'App.form.rules.keyword' })} />,
              )}
            </Form.Item>
            <Form.Item>
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
            <Form.Item label={formatMessage({ id: 'App.results.taskType' })}>
              {getFieldDecorator('type')(
                <Select>
                  <Select.Option value={TASK_TYPE.ALL}>{formatMessage({ id: 'App.results.all' })}</Select.Option>
                  <Select.Option value={TASK_TYPE.ANALYSIS}>{formatMessage({ id: 'App.results.1' })}</Select.Option>
                  <Select.Option value={TASK_TYPE.VIDEO}>{formatMessage({ id: 'App.results.2' })}</Select.Option>
                  <Select.Option value={TASK_TYPE.PIC}>{formatMessage({ id: 'App.results.3' })}</Select.Option>
                </Select>,
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
      search = '',
      begin,
      end,
      type = TASK_TYPE.ALL,
    },
  }) {
    const { createFormField } = Form;

    return {
      search: createFormField({
        value: search,
      }),
      range: createFormField({
        value: begin && end ? [moment(begin), moment(end)] : [],
      }),
      type: createFormField({
        value: type,
      }),
    };
  },
})(injectIntl(Filter));
