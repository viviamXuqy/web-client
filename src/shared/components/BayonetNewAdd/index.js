import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { Row, Col, message, Form, Input, Radio, Button, InputNumber, Checkbox } from 'antd';

import MiniTable from '../../../shared/components/MiniTable';

import './index.less';

const RadioGroup = Radio.Group;

class BayonetNewAdd extends PureComponent {
    static propTypes = {
      // bayonets: object,
      submitBayonet: func.isRequired, // 新增卡口
      submitBayonetSdk: func.isRequired,
      fetchBayonetCameras: func.isRequired, // 当前卡口下的摄像头列表
      addCamera: func.isRequired, // 添加摄像头
      hideModal: func.isRequired,
      form: object.isRequired,
      intl: object.isRequired,
    }

    // static defaultProps = {
    //   bayonets: {},
    // }

  state = {
    bayonetId: '', // bayonetID
    cameraName: '', // 摄像头名称
    rtsp: '', // rtsp
    bayonetCameras: [], // bayonet摄像头数据集合
    rowIndexCamera: -1, // 选中的bayonetCamera row
    pageCamera: 1, // 当前页（摄像头列表）
    pageSizeCamera: 9, // 当前页数量（摄像头列表）
    checkName: false,
  }

  componentDidMount() {
  }

  handleRowCameraClick = (camera, index) => {
    this.setState({
      cameraName: camera.name,
      rtsp: camera.rtsp,
      rowIndexCamera: index,
    });
  }

  handleFetchBayonetCameras = () => {
    const { fetchBayonetCameras, form, intl } = this.props;

    const bayonetName = form.getFieldValue('name');

    const { bayonetId } = this.state;

    fetchBayonetCameras(bayonetId).then(({ response }) => {
      if (response) {
        this.setState({
          bayonetCameras: response.map((rtsp, index) => ({
            key: index, rtsp, id: index, name: `${bayonetName}-${intl.formatMessage({ id: 'App.ipc.add.newCameraName' })}${index + 1}`,
          })),
        });
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const {
      submitBayonet, submitBayonetSdk, form, intl,
    } = this.props;

    const bayonetName = form.getFieldValue('name');

    const self = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { type } = values;
        type = type ? 2 : 1;
        if (type === 2) {
          submitBayonetSdk({ ...values, type })
            .then(({ response }) => {
              if (response) {
                this.setState({
                  bayonetCameras: response.map((rtsp, index) => ({
                    key: index, rtsp, id: index, name: `${bayonetName}-${intl.formatMessage({ id: 'App.ipc.add.newCameraName' })}${index + 1}`,
                  })),
                });
              }
            });
        } else {
          submitBayonet({ ...values, type })
            .then(({ isOk }) => {
              if (isOk) {
                self.setState({
                  rowIndexCamera: -1,
                  bayonetId: values.bayonetId,
                  pageCamera: 1,
                }, () => {
                  self.handleFetchBayonetCameras();
                });
                message.success(intl.formatMessage({ id: 'App.message.save.success' }));
              }
            });
        }
      }
    });
  }

  handleCameraPaginationClick = page => {
    this.setState({
      pageCamera: page,
      rowIndexCamera: -1,
    });
  }

  handleOkClick = () => {
    const {
      addCamera, hideModal, form, intl,
    } = this.props;
    const {
      rowIndexCamera, cameraName, rtsp,
    } = this.state;

    if (rowIndexCamera === -1) {
      message.warn(intl.formatMessage({ id: 'App.ipc.add.message.camera' }));
      return;
    }

    const values = form.getFieldsValue();
    let { type } = values;
    const { name } = values;
    type = type ? 2 : 1; // 独立摄像头是2

    const options = {
      ...values, name: cameraName, rtsp, type, bayonetName: name,
    };

    addCamera(options).then(({ isOk }) => {
      if (isOk) {
        hideModal();
        message.success(intl.formatMessage({ id: 'App.ipc.addCamera.success' }));
      }
    });
  }

  handleChange = e => {
    this.setState({
      checkName: e.target.checked,
    }, () => {
      this.props.form.validateFields(['name'], { force: true });
      this.props.form.setFieldsValue({
        name: e.target.checked ? this.props.intl.formatMessage({ id: 'App.ipc.add.InCamera' }) : '',
      });
    });
  }

  render() {
    const { hideModal, form, intl } = this.props;
    const { getFieldDecorator } = form;
    const {
      bayonetCameras, rowIndexCamera, pageCamera, checkName, pageSizeCamera,
    } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <div className="app-camera-bayonetNewAdd">
        <Row>
          <Col span={14}>
            <div className="app-camera-bayonetNewAdd__formClass">
              <Form
                className="app-page__filter"
                onSubmit={this.handleSubmit}
              >
                <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.ipc.add.ip' })}>
                  {getFieldDecorator('ip', {
                    rules: [{
                      required: true,
                      message: intl.formatMessage({ id: 'App.ipc.rule.ip' }),
                      whitespace: true,
                    }, {
                        pattern: '^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$',
                        message: intl.formatMessage({ id: 'App.form.rules.pattern.ip' }),
                    }],
                  })(
                    <Input placeholder={intl.formatMessage({ id: 'App.ipc.rule.ip' })} />,
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'App.ipc.add.id' })}>
                  {getFieldDecorator('bayonetId', {
                      rules: [{
                        required: true,
                        message: intl.formatMessage({ id: 'App.ipc.rule.id' }),
                        whitespace: true,
                      }, {
                          pattern: '^[a-z0-9]{0,50}$',
                          message: intl.formatMessage({ id: 'App.form.rules.pattern.numorabc' }),
                      }],
                    })(
                      <Input placeholder={intl.formatMessage({ id: 'App.ipc.rule.id' })} maxLength={50} />,
                    )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={intl.formatMessage({ id: 'App.ipc.add.deviceType' })}
                >
                  {getFieldDecorator('deviceType')(
                    <RadioGroup name="deviceType">
                      <Radio value={2}>{intl.formatMessage({ id: 'App.public.camera.type.2' })}</Radio>
                      <Radio value={1}>{intl.formatMessage({ id: 'App.public.camera.type.1' })}</Radio>
                    </RadioGroup>,
                    )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={intl.formatMessage({ id: 'App.ipc.add.account' })}
                >
                  {getFieldDecorator('account', {
                      rules: [{
                        required: true,
                        message: intl.formatMessage({ id: 'App.ipc.rule.account' }),
                        whitespace: true,
                      }],
                    })(
                      <Input placeholder={intl.formatMessage({ id: 'App.ipc.rule.account' })} />,
                    )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={intl.formatMessage({ id: 'App.ipc.add.password' })}
                >
                  {getFieldDecorator('pwd', {
                      rules: [{
                        required: true,
                        message: intl.formatMessage({ id: 'App.ipc.rule.password' }),
                        whitespace: true,
                      }],
                    })(
                      <Input placeholder={intl.formatMessage({ id: 'App.ipc.rule.password' })} type="password" />,
                    )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={intl.formatMessage({ id: 'App.ipc.add.port' })}
                >
                  {getFieldDecorator('port', {
                      rules: [{
                        required: true,
                        message: intl.formatMessage({ id: 'App.ipc.rule.port' }),
                      }],
                    })(
                      <InputNumber min={0} />,
                    )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  wrapperCol={{ offset: 8 }}
                >
                  {getFieldDecorator('type', {
                    })(
                      <Checkbox onChange={this.handleChange}>{intl.formatMessage({ id: 'App.ipc.add.InCamera' })}</Checkbox>,
                    )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  label={intl.formatMessage({ id: 'App.ipc.add.cameraName' })}
                >
                  {getFieldDecorator('name', {
                      rules: [{
                        required: true,
                        message: intl.formatMessage({ id: 'App.ipc.rule.cameraName' }),
                        whitespace: true,
                      }],
                    })(
                      <Input disabled={checkName} placeholder={intl.formatMessage({ id: 'App.ipc.rule.cameraName' })} />,
                    )}
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  wrapperCol={{ offset: 8 }}
                >
                  <Button className="btnOk" type="primary" htmlType="submit">{intl.formatMessage({ id: 'App.control.add' })}</Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col span={10}>
            <div>
              <h3>{intl.formatMessage({ id: 'App.ipc.add.cameraList' })}</h3>
              <MiniTable
                datas={bayonetCameras}
                tableHeight={337}
                tableWidth={278}
                hasPage
                hasTree={false}
                hasCheckbox={false}
                meta={{
                  current: pageCamera,
                  pageSize: pageSizeCamera,
                  total: bayonetCameras.length,
                }}
                onPaginationChange={this.handleCameraPaginationClick}
                onRowClick={this.handleRowCameraClick}
              />
            </div>
          </Col>
        </Row>
        <div className="window-content__footer buttons-group text-center">
          <Button onClick={hideModal}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            disabled={rowIndexCamera === -1}
            onClick={this.handleOkClick}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields({
    bayonets = {},
  }) {
    const { createFormField } = Form;

    return {
      ip: createFormField({
        value: bayonets.ip,
      }),
      bayonetId: createFormField({
        value: bayonets.bayonetId,
      }),
      deviceType: createFormField({
        value: bayonets.deviceType || 1,
      }),
      account: createFormField({
        value: bayonets.account,
      }),
      pwd: createFormField({
        value: bayonets.pwd,
      }),
      port: createFormField({
        value: bayonets.port,
      }),
      type: createFormField({
        value: bayonets.type,
      }),
      name: createFormField({
        value: bayonets.name,
      }),
    };
  },
})(BayonetNewAdd);
