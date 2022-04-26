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
      resultBeginId,
      resultEndId,
      ...values
    }) => {
      if (!err) {
        if ((resultBeginId && !resultEndId) || (resultEndId && !resultBeginId)) {
          message.warn(intl.formatMessage({ id: 'App.results.rules.resultId' }));
          return;
        }

        const [begin, end] = range;
        const options = {
          ...values,
          resultBeginId,
          resultEndId,
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
          className="app-page__filter2"
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
              {getFieldDecorator('resultBeginId')(
                <Input className="result-input" placeholder={formatMessage({ id: 'App.results.beginResultId' })} />,
              )}
            </Form.Item>
            <div className="results-list2__lable">{formatMessage({ id: 'App.public.to' })}</div>
            <Form.Item>
              {getFieldDecorator('resultEndId')(
                <Input className="result-input" placeholder={formatMessage({ id: 'App.results.endResultId' })} />,
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
      resultBeginId,
      resultEndId,
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
      resultBeginId: createFormField({
        value: resultBeginId,
      }),
      resultEndId: createFormField({
        value: resultEndId,
      }),
    };
  },
})(injectIntl(Filter));
