import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Form, Button, Input, Icon } from 'antd';
import { injectIntl } from 'react-intl';

import classNames from 'classnames';

import Cicon from '../../shared/components/Cicon';
import Cookies from 'js-cookie';

class Filter extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    form: object.isRequired,
    onSearch: func.isRequired,
    onBayonetAdd: func.isRequired,
    onBayonetNewAdd: func.isRequired,
    onBayonetNewRtspAdd: func.isRequired,
    onUploadFile: func.isRequired,
  }

  state = {
    isReset: false, // 是否显示重置刷新按钮
  }

  handleSubmit = e => {
    e.preventDefault();

    const { onSearch } = this.props;

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSearch(values);
        this.setState({
          isReset: true,
        });
      }
    });
  }

  handleReset = () => {
    const { onSearch } = this.props;
    const options = { bayonetName: '' };
    onSearch(options);

    this.setState({
      isReset: false,
    });
  }

  handleUpload = () => {
  }

  render() {
    const {
      form, onBayonetAdd, onBayonetNewAdd, onBayonetNewRtspAdd, onUploadFile, intl,
    } = this.props;
    const { getFieldDecorator } = form;
    const { isReset } = this.state;
    const user = JSON.parse(Cookies.get('user'));
    return (
      <div className="cameras-search">
        <Form
          className={classNames('app-page__filter', 'clearfix')}
          layout="inline"
          onSubmit={this.handleSubmit}
        >
          <div className="fl">
            <Form.Item>
              {getFieldDecorator('bayonetName')(
                <Input placeholder={intl.formatMessage({ id: 'App.ipc.search.placeholder' })} />,
              )}
            </Form.Item>
            <Form.Item className="buttons-group">
              <Button type="primary" htmlType="submit" icon="search">
                {intl.formatMessage({ id: 'App.ipc.searchBtn' })}
              </Button>
            </Form.Item>
          </div>
          <div>
            <Form.Item label={`${intl.formatMessage({ id: 'App.ipc.addCamera' })}:`} className="buttons-group">
              <Button
                type="primary"
                onClick={onBayonetNewRtspAdd}
              >
                <Cicon type="addcamera" />{intl.formatMessage({ id: 'App.ipc.quickAdd.addcamera' })}
              </Button>
              <Button
                type="primary"
                onClick={onBayonetAdd}
                disabled={user.grade === '3'}
              >
                <Cicon type="alreadyhave" />{intl.formatMessage({ id: 'App.ipc.existCheckpoint' })}
              </Button>
              <Button
                type="primary"
                onClick={onBayonetNewAdd}
                disabled={user.grade === '3'}
              >
                <Cicon type="addcamera" />{intl.formatMessage({ id: 'App.ipc.addCheckpoint' })}
              </Button>
              <Button
                type="primary"
                onClick={onUploadFile}
                disabled={user.grade === '3'}
              >
                <Icon type="upload" />{intl.formatMessage({ id: 'App.ipc.upload' })}
              </Button>
              <Button
                style={{ display: (isReset ? '' : 'none') }}
                type="primary"
                onClick={this.handleReset}
              >
                <Cicon type="therefresh" />{intl.formatMessage({ id: 'App.control.reset' })}
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
      bayonetName = '',
    },
  }) {
    const { createFormField } = Form;

    return {
      bayonetName: createFormField({
        value: bayonetName,
      }),
    };
  },
})(injectIntl(Filter));
