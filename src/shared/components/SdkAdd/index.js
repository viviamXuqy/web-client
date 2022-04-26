import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { message, Form, Input, Radio, Button } from 'antd';
import { EVENT_TYPE } from '../../../constants/stats';

import './index.css';

const RadioGroup = Radio.Group;
class SdkAdd extends PureComponent {
  static propTypes = {
    addSdk: func.isRequired, // 新增协议
    modifySdk: func.isRequired, // 修改协议
    form: object.isRequired,
    hideModal: func.isRequired,
    data: object,
    intl: object.isRequired,
  }

  static defaultProps = {
    data: {},
  }


  constructor(props) {
    super(props);
    this.state = {
      type: '1', // 事件类型
    };
  }
  componentDidMount() {
  }


  handleSubmit = e => {
    e.preventDefault();

    const {
      addSdk, hideModal, intl, data, modifySdk,
    } = this.props;
    const { type } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const callback = () => {
          const successMsg = intl.formatMessage({ id: 'App.message.save.success' });

          hideModal();
          message.success(successMsg);
        };
        if (data.id) {
          modifySdk(data.id, { ...values, type }).then(({ isOk }) => {
            if (isOk) {
              callback();
            }
          });
        } else {
          addSdk({ ...values, type }).then(({ isOk }) => {
            if (isOk) {
              callback();
            }
          });
        }
      }
    });
  }

  render() {
    const {
      hideModal, form, data, intl,
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div className="save-sdk-content">
        <div className="">
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
          >
            <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.event.name' })}>
              {getFieldDecorator('name', {
                  initialValue: data.name || '',
                  rules: [{
                      required: true,
                      message: intl.formatMessage({ id: 'App.event.rule.name' }),
                      whitespace: true,
                  }],
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.event.rule.name' })} />,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.event.url' })}>
              {getFieldDecorator('url', {
                  rules: [{
                      required: true,
                      message: intl.formatMessage({ id: 'App.event.rule.required.url' }),
                      whitespace: true,
                  }, {
                      type: 'url',
                      message: intl.formatMessage({ id: 'App.event.rule.pattern.url' }),
                  }],
                  initialValue: data.url || '',
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.event.placeholder.url' })} />,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.event.type' })}>
              <RadioGroup value="1">
                <Radio value="1">{EVENT_TYPE[intl.locale][1]}</Radio>
              </RadioGroup>
            </Form.Item>
          </Form>
        </div>
        <div className="window-content__footer buttons-group text-center">
          <Button onClick={hideModal}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            onClick={this.handleSubmit}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default Form.create()(SdkAdd);
