import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Form, Button, Input, DatePicker, message } from 'antd';
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

    const { onSearch, intl } = this.props;

    this.props.form.validateFieldsAndScroll((err, {
      range,
      taskBeginId,
      taskEndId,
      ...values
    }) => {
      if (!err) {
        if ((taskBeginId && !taskEndId) || (taskEndId && !taskBeginId)) {
          message.warn(intl.formatMessage({ id: 'App.results.rules.taskId' }));
          return;
        }

        const [begin, end] = range;
        const options = {
          ...values,
          taskBeginId,
          taskEndId,
          begin: begin && new Date(begin).getTime(),
          end: end && new Date(end).getTime(),
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
            <Form.Item>
              {getFieldDecorator('taskBeginId')(
                <Input className="result-input" placeholder={formatMessage({ id: 'App.results.beginTaskId' })} />,
              )}
            </Form.Item>
            <div className="results-list__lable">至</div>
            <Form.Item>
              {getFieldDecorator('taskEndId')(
                <Input className="result-input" placeholder={formatMessage({ id: 'App.results.endTaskId' })} />,
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
      taskBeginId,
      taskEndId,
    } = {},
  }) {
    const { createFormField } = Form;

    return {
      search: createFormField({
        value: search,
      }),
      range: createFormField({
        value: begin && end ? [moment(begin), moment(end)] : [],
      }),
      taskBeginId: createFormField({
        value: taskBeginId,
      }),
      taskEndId: createFormField({
        value: taskEndId,
      }),
    };
  },
})(injectIntl(Filter));
