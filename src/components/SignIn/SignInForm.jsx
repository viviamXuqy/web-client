import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Form, Input, Checkbox, Button } from 'antd';
import { injectIntl } from 'react-intl';

class SignIn extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    form: object.isRequired,
    signIn: func.isRequired,
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.signIn(values);
      }
    });
  }

  render() {
    const { intl: { formatMessage } } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        layout="vertical"
        onSubmit={this.handleSubmit}
      >
        <Form.Item label={formatMessage({ id: 'App.signIn.user.label' })}>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'App.signIn.user.msg' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'App.signIn.user.msg' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'App.signIn.pwd.label' })}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'App.signIn.pwd.msg' }),
              },
            ],
          })(<Input type="password" placeholder={formatMessage({ id: 'App.signIn.pwd.msg' })} />)}
        </Form.Item>
        <Form.Item className="form__footer">
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
          })(<Checkbox size="large" className="form__remember">{formatMessage({ id: 'App.signIn.remember' })}</Checkbox>)}
          <Button size="large" type="primary" htmlType="submit" className="form__btn">
            {formatMessage({ id: 'App.signIn.button' })}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(injectIntl(SignIn));
