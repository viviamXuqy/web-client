import React, { PureComponent } from 'react';
import { Form, Button, InputNumber, Input } from 'antd/lib/index';
import { func, object } from 'prop-types';
import { injectIntl } from 'react-intl';

class Search extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    onSearch: func.isRequired,
    form: object.isRequired,
  }
  handleSearch=() => {
    const searchData = this.props.form.getFieldsValue();
    const { onSearch } = this.props;
    onSearch(searchData);
  }

  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" className="mt-20" onSubmit={this.handleSearch}>
        <Form.Item>
          {getFieldDecorator('search')(<Input placeholder="关键字" />)}
        </Form.Item>
        <Form.Item>
          <span className="mr-8">驾驶人数量</span>
          {getFieldDecorator('countBegin')(<InputNumber min={1} />)}
          <span className="mr-8 ml-8">至</span>
          {getFieldDecorator('countEnd')(<InputNumber min={1} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('originalTaskId')(<Input placeholder="源任务ID" className="fl w-150 mr-20" />)}
        </Form.Item>
        <Button type="primary" htmlType="submit" icon="search">
          {intl.formatMessage({ id: 'App.control.search' })}
        </Button>
      </Form>
    );
  }
}

export default Form.create({
  mapPropsToFields({
    filter: {
      search = '',
      countBegin,
      countEnd,
      originalTaskId = '',
    },
  }) {
    const { createFormField } = Form;
    return {
      search: createFormField({
        value: search,
      }),
      countBegin: createFormField({
        value: countBegin,
      }),
      countEnd: createFormField({
        value: countEnd,
      }),
      originalTaskId: createFormField({
        value: originalTaskId,
      }),
    };
  },
})(injectIntl(Search));
