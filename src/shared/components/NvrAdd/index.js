import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Form, Input, message, InputNumber } from 'antd';
import { injectIntl } from 'react-intl';

import { FORM_ITEM_LAYOUT } from '../../../constants/site';

class NvrAdd extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    addNvr: func.isRequired,
    modifyNvr: func.isRequired,
    form: object.isRequired,
    hideModal: func.isRequired,
    data: object,
  }

  static defaultProps = {
    data: {},
  }

  handleSubmit = e => {
    e.preventDefault();

    const {
      addNvr, modifyNvr, hideModal, intl, data,
    } = this.props;

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (Object.keys(data).length) {
          modifyNvr(data.id, values).then(({ isOk }) => {
            if (isOk) {
              const successMsg = intl.formatMessage({ id: 'App.message.save.success' });

              hideModal();
              message.success(successMsg);
            }
          });
        } else {
          addNvr(values).then(({ isOk }) => {
            if (isOk) {
              const successMsg = intl.formatMessage({ id: 'App.message.save.success' });

              hideModal();
              message.success(successMsg);
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

    return (
      <div className="save-sdk-content">
        <div className="">
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
          >
            <Form.Item {...FORM_ITEM_LAYOUT} label={intl.formatMessage({ id: 'App.cameras.nvr.name' })}>
              {getFieldDecorator('nvrName', {
                  initialValue: data.nvrName || '',
                  rules: [{
                      required: true,
                      message: intl.formatMessage({ id: 'App.cameras.nvr.rules.name' }),
                      whitespace: true,
                  }],
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.cameras.nvr.rules.name' })} />,
              )}
            </Form.Item>
            <Form.Item {...FORM_ITEM_LAYOUT} label={intl.formatMessage({ id: 'App.cameras.nvr.port' })}>
              {getFieldDecorator('port', {
                      rules: [{
                        required: true,
                        message: intl.formatMessage({ id: 'App.cameras.nvr.rules.port' }),
                      }],
                      initialValue: data.port || '',
                    })(
                      <InputNumber min={0} />,
                    )}
            </Form.Item>
            <Form.Item {...FORM_ITEM_LAYOUT} label={intl.formatMessage({ id: 'App.cameras.nvr.ip' })}>
              {getFieldDecorator('nvrIp', {
                  rules: [{
                      required: true,
                      message: intl.formatMessage({ id: 'App.cameras.nvr.rules.ip' }),
                      whitespace: true,
                  }],
                  initialValue: data.nvrIp || '',
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.cameras.nvr.rules.ip' })} />,
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

export default Form.create()(injectIntl(NvrAdd));
