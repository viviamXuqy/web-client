import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { message, Form, Input, Button, Select } from 'antd';
import { USER_GRADE } from '../../../constants/stats';

import './index.less';

class UserAdd extends PureComponent {
  static propTypes = {
    addUser: func.isRequired, // 新增协议
    modifyUser: func.isRequired, // 修改协议
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
      confirmDirty: false,
      status: 1,
      role: 'user',
    };
  }
  componentDidMount() {
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { form, intl } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage({ id: 'App.user.rule.password2' }));
    } else {
      callback();
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    const {
      addUser, hideModal, intl, data, modifyUser,
    } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { status, role } = this.state;
        const callback = () => {
          const successMsg = intl.formatMessage({ id: 'App.message.save.success' });

          hideModal();
          message.success(successMsg);
        };
        if (data.id) {
          modifyUser(data.id, { ...values, status, role }).then(({ isOk }) => {
            if (isOk) {
              callback();
            }
          });
        } else {
          addUser({ ...values, status, role }).then(({ isOk }) => {
            if (isOk) {
              callback();
            }
          });
        }
      }
    });
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  render() {
    const {
      hideModal, form, data, intl,
    } = this.props;
    const { getFieldDecorator } = form;
    let formItemLayout = null;
    if (intl.locale === 'zh-CN') {
      formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
    }

    return (
      <div className="save-user-content">
        <div className="">
          <Form
            layout={intl.locale === 'zh-CN' ? 'inline' : 'horizontal'}
            className={intl.locale === 'zh-CN' ? 'cn' : 'en'}
            onSubmit={this.handleSubmit}
          >
            <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.user.username' })}>
              {getFieldDecorator('username', {
                  initialValue: data.username || '',
                  rules: [{
                      required: true,
                      message: intl.formatMessage({ id: 'App.user.rule.username' }),
                      whitespace: true,
                  }],
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.user.rule.username' })} />,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.user.password' })}>
              {getFieldDecorator('password', {
                  initialValue: data.password || '',
                  rules: [{
                      required: true,
                      message: intl.formatMessage({ id: 'App.user.rule.password' }),
                      whitespace: true,
                  }, {
                      validator: this.validateToNextPassword,
                  }],
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.user.rule.password' })} />,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.user.confirmPw' })}>
              {getFieldDecorator('confirm', {
                  initialValue: data.password || '',
                  rules: [{
                      required: true,
                      message: intl.formatMessage({ id: 'App.user.rule.confirmPw' }),
                      whitespace: true,
                  }, {
                      validator: this.compareToFirstPassword,
                  }],
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.user.rule.confirmPw' })} onBlur={this.handleConfirmBlur} />,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.user.grade' })}>
              {getFieldDecorator('grade', {
                  initialValue: data.grade || '1',
                  rules: [
                      { required: true },
                  ],
                })(
                  <Select>
                    {USER_GRADE[intl.locale].map(item => (
                      <Select.Option
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </Select.Option>
                       ))}
                  </Select>,
                )}
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

export default Form.create()(UserAdd);
