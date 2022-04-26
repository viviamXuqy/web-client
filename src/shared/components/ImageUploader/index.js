import React, { PureComponent } from 'react';
import { object, func, string } from 'prop-types';
import { Upload, Button, message } from 'antd';
import { injectIntl } from 'react-intl';
import { camelizeKeys } from 'humps';

import Cookies from 'js-cookie';
import { resetOrientation } from '../../../utils';

import './index.css';

class ImageUploader extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    url: string.isRequired,
    onUpdateResData: func.isRequired,
  }

  state = {
    imageUrl: '',
    loading: false,
  };

  beforeUpload = file => {
    const { intl } = this.props;

    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJPGorPNG) {
      message.error(intl.formatMessage({ id: 'App.form.upload.msg.file' }));
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error(intl.formatMessage({ id: 'App.form.upload.msg.max' }));
    }

    if (isJPGorPNG && isLt5M) {
      return true;
    }

    return false;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      const { intl, onUpdateResData } = this.props;
      const { code, result } = info.file.response;
      if (code !== 200 || !result) {
        message.error(intl.formatMessage({ id: 'App.error.57' }));
        return;
      }

      // Get this url from response in real world.
      resetOrientation(info.file.originFileObj, imageUrl => {
        this.setState({
          imageUrl,
          loading: false,
        });

        onUpdateResData(camelizeKeys(result));
      });
    }
  }

  render() {
    const { url } = this.props;
    const { imageUrl } = this.state;

    const uploadTrigger = (
      <div>
        <Button type="primary" shape="circle" icon={this.state.loading ? 'loading' : 'plus'} />
        {/* <Icon type={this.state.loading ? 'loading' : 'plus-circle'} /> */}
      </div>
    );

    const token = Cookies.get('token');

    return (
      <div className="image-uploader">
        <Upload
          action={url}
          showUploadList={false}
          listType="picture-card"
          beforeUpload={this.beforeUpload}
          headers={token ? { token } : {}}
          onChange={this.handleChange}
          accept="image/jpg,image/jpeg,image/png"
        >
          {imageUrl ? <img src={imageUrl} alt="" className="image-uploader__single" /> : uploadTrigger}
        </Upload>
      </div>
    );
  }
}

export default (injectIntl(ImageUploader));
