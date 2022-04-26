import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { Button, message, Radio, Form, Input, TimePicker, DatePicker, Checkbox, Row, Col } from 'antd';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { getTimeMs } from '../../../utils';
import './index.css';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class Time extends PureComponent {
  static propTypes = {
    form: object.isRequired,
    intl: object.isRequired,
    saveNtp: func.isRequired,
    saveManual: func.isRequired,
  }

  state = {
    type: '1',
  }

  componentDidMount() {
  }
  onChangeType = e => {
    this.setState({
      type: e.target.value,
    });
  }
  onCheckCompTime = e => {
    if (e.target.checked) {
      this.props.form.setFieldsValue({ time: moment(new Date(), 'YYYY-MM-DD hh:mm:ss') });
    } else {
      this.props.form.setFieldsValue({ time: null });
    }
  }
  onChangeInterval=(time, timeString) => {
    this.setState({ timeString });
  }
  handleSubmit=e => {
    e.preventDefault();
    const { saveNtp, intl, saveManual } = this.props;
    const { type, timeString } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const msg = intl.formatMessage({ id: 'App.message.save.success' });
        if (type === '1') {
          const data = {
            ...values, type, interval: getTimeMs(timeString) * 1000,
          };
          saveNtp(data).then(({ isOk }) => {
            if (isOk) {
              message.success(msg);
            }
          });
        } else if (type === '2') {
          const data = {
            time: values.time.valueOf(), type,
          };
          saveManual(data).then(({ isOk }) => {
            if (isOk) {
              message.success(msg);
            }
          });
        }
      }
    });
  }
  render() {
    const { type } = this.state;
    const { form, intl } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <React.Fragment>
        <RadioGroup onChange={this.onChangeType} value={type} className="mb-8">
          <Radio value="1">{intl.formatMessage({ id: 'App.time.radio.ntp' })}</Radio>
          <Radio value="2">{intl.formatMessage({ id: 'App.time.radio.manual' })}</Radio>
        </RadioGroup>
        {type === '1' &&
          <Row>
            <Col span={8}>
              <Form onSubmit={e => this.handleSubmit(e, '1')} className="ntp-form">
                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'App.time.ip' })}>
                  {getFieldDecorator('ip', {
                  rules: [{ required: true, message: intl.formatMessage({ id: 'App.time.rule.ip' }) }],
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.time.rule.ip' })} />,
              )}
                </FormItem>
                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'App.time.port' })}>
                  {getFieldDecorator('port', {
                  rules: [{ required: true, message: intl.formatMessage({ id: 'App.time.rule.port' }) }],
              })(
                <Input placeholder={intl.formatMessage({ id: 'App.time.rule.port' })} />,
              )}
                </FormItem>
                <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'App.time.interval' })} >
                  {getFieldDecorator('interval', {
                  rules: [{ required: true, message: intl.formatMessage({ id: 'App.time.rule.interval' }) }],
              })(
                <TimePicker onChange={this.onChangeInterval} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} placeholder={intl.formatMessage({ id: 'App.time.rule.interval' })} />,
              )}
                </FormItem>
                <Button type="primary" htmlType="submit">
                  {intl.formatMessage({ id: 'App.control.save' })}
                </Button>
              </Form>
            </Col>
          </Row>}
        {type === '2' &&
        <Row>
          <Col span={6}>
            <Form onSubmit={e => this.handleSubmit(e, '2')} className="ntp-form relative">
              <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'App.time.time' })}>

                {getFieldDecorator('time', {
                              rules: [{ required: true, message: intl.formatMessage({ id: 'App.time.rule.time' }) }],
                          })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={intl.formatMessage({ id: 'App.time.rule.time' })} />,
                          )}

              </FormItem>
            </Form>
            <Button type="primary" htmlType="submit">
              {intl.formatMessage({ id: 'App.control.save' })}
            </Button>
          </Col>
          <Col span={12} className="pl-8 lh-40">
            <Checkbox onChange={this.onCheckCompTime}>{intl.formatMessage({ id: 'App.time.sync' })}</Checkbox>
          </Col>
        </Row>}
      </React.Fragment>
    );
  }
}

export default Form.create()(injectIntl(Time));
