import React from 'react';
import { object, func } from 'prop-types';
import { Form, Input, Icon, Button, message } from 'antd';
import { injectIntl } from 'react-intl';

const FormItem = Form.Item;

let uuid = 1;
class BayonetNewRtspAdd extends React.PureComponent {
  static propTypes = {
    addCamera: func.isRequired, // 添加摄像头
    hideModal: func.isRequired,
    form: object.isRequired,
    intl: object.isRequired,
    meta: object.isRequired,
  }

  componentDidMount() {
    uuid = this.props.meta.total;
    this.add();
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = async e => {
    e.preventDefault();

    const {
      addCamera, hideModal, form, intl,
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const type = 2; // 独立摄像头是2
        const { keys, rtsps, names } = values;

        const options = {
          rtsp: rtsps[keys[0]], name: names[keys[0]], type,
        };

        addCamera(options).then(({ isOk }) => {
          if (isOk) {
            hideModal();
            message.success(intl.formatMessage({ id: 'App.ipc.addCamera.success' }));
          }
        });
      }
    });
  }

  render() {
    const { hideModal, form, intl } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map(k => (
      <div key={k}>
        <FormItem
          {...formItemLayout}
          label={intl.formatMessage({ id: 'App.ipc.quickAdd.rtspAddress' })}
          key={k}
        >
          {getFieldDecorator(`rtsps[${k}]`, {
              rules: [
                {
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: 'App.ipc.rule.rtsp' }),
                },
                {
                  pattern: 'rtsp:\\/\\/*',
                  message: intl.formatMessage({ id: 'App.ipc.rule.rtspRight' }),
                },
            ],
            })(
              <Input placeholder={intl.formatMessage({ id: 'App.ipc.rule.rtsp' })} style={{ width: '90%', marginRight: 8 }} />,
            )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              style={{ cursor: 'pointer' }}
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
            ) : null}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={intl.formatMessage({ id: 'App.ipc.cameraName' })}
          required={false}
        >
          {getFieldDecorator(`names[${k}]`, {
              initialValue: `${intl.formatMessage({ id: 'App.ipc.add.InCamera' })}-${intl.formatMessage({ id: 'App.ipc.add.newCameraName' })}${k}`,
              rules: [{
                required: false,
                whitespace: true,
                message: intl.formatMessage({ id: 'App.ipc.rule.account' }),
              }],
            })(
              <Input placeholder={intl.formatMessage({ id: 'App.ipc.rule.account' })} style={{ width: '60%', marginRight: 8 }} />,
            )}
        </FormItem>
      </div>
    ));
    return (
      <div>
        <div>
          <Form className="app-camera-bayonetNewRtspAdd">
            {formItems}
            {/* <FormItem>
              <button className="tablelink" onClick={this.add} >
                <Icon type="plus" />添加
              </button>
            </FormItem> */}
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

export default Form.create()(injectIntl(BayonetNewRtspAdd));
