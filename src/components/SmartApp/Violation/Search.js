import React, { PureComponent } from 'react';
import { Form, Button, Input, Select } from 'antd/lib/index';
import { func, object } from 'prop-types';
import { injectIntl } from 'react-intl';

const { Option } = Select;
class Search extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    onSearch: func.isRequired,
    form: object.isRequired,
  }
  state={
    type: '',
    camera: '',
    status: '',
  }
  handleSearch=() => {
    const searchData = this.props.form.getFieldsValue();
    const { onSearch } = this.props;
    onSearch(searchData);
  }

  handleSelectChange=(name, value) => {
    const nextState = {};
    nextState[name] = value;
    this.setState({ ...nextState });
  }

  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <Form layout="inline" className="mt-20 search-form">
        <Form.Item>
          {getFieldDecorator('search')(<Input placeholder="任务名" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('resultBeginId')(<Input placeholder="开始任务ID" className="result-form" />)}
          <span className="mr-8 ml-8">至</span>
          {getFieldDecorator('resultEndId')(<Input placeholder="结束任务ID" className="result-form" />)}
        </Form.Item>
        <Form.Item
          label="任务类型"
          className="select-form"
          {...formItemLayout}
        >
          {getFieldDecorator('type')(
            <Select placeholder="请选择" onChange={value => this.handleSelectChange('type', value)}>
              <Option value="1">城市道路违停</Option>
              <Option value="2">高速道路停车</Option>
              <Option value="3">逆向行驶</Option>
              <Option value="4">占用应急车道</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item
          label="摄像头"
          className="select-form"
          {...formItemLayout}
        >
          {getFieldDecorator('camera')(
            <Select placeholder="请选择" onChange={value => this.handleSelectChange('camera', value)}>
              <Select.Option value="1">摄像头1</Select.Option>
              <Select.Option value="2">摄像头2</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item
          label="状态"
          className="select-form"
          {...formItemLayout}
        >
          {getFieldDecorator('status')(
            <Select placeholder="请选择" onChange={value => this.handleSelectChange('status', value)}>
              <Select.Option value="1">等待开始</Select.Option>
              <Select.Option value="2">运行中</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon="search" onClick={this.handleSearch}>
            {intl.formatMessage({ id: 'App.control.search' })}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({
  mapPropsToFields({
    filter: {
      search = '',
      resultBeginId,
      resultEndId,
      type,
      camera,
      status,
    },
  }) {
    const { createFormField } = Form;
    return {
      search: createFormField({
        value: search,
      }),
      resultBeginId: createFormField({
        value: resultBeginId,
      }),
      resultEndId: createFormField({
        value: resultEndId,
      }),
      type: createFormField({
        value: type,
      }),
      camera: createFormField({
        value: camera,
      }),
      status: createFormField({
        value: status,
      }),
    };
  },
})(injectIntl(Search));
