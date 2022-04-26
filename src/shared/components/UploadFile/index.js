import React, { PureComponent } from 'react';

import { string, object, func } from 'prop-types';
import { Upload, message } from 'antd';

import Cookies from 'js-cookie';
import './index.css';

class UploadFile extends PureComponent {
    static propTypes = {
      text: string,
      url: string.isRequired,
      accept: string,
      listType: string,
      children: object,
      afterUpload: func,
      beforeUpload: func,
    }

    static defaultProps = {
      text: '上传',
      accept: '', // 'image/jpg,image/jpeg,image/png,image/bmp',
      listType: 'text',
      children: {},
      afterUpload: () => {},
      beforeUpload: () => {},
    }

    state={
      fileList: [],
    }
    componentDidMount() {

    }
    beforeUpload = () => {
      const { beforeUpload } = this.props;
      if (!beforeUpload()) {
        return false;
      }
      return true;
    }

    handleChange= info => {
      const { afterUpload } = this.props;
      let { fileList } = info;
      fileList = fileList.slice(-1);
      fileList = fileList.filter(file => {
        if (!file.status) {
          return false;
        }
        const { response } = file;
        if (response) {
          const { code, result } = response;
          if (code === 200) {
            afterUpload(result);
          } else {
            message.error('服务器出错，请重试');
          }
        }
        return true;
      });

      this.setState({ fileList });
    }
    render() {
      const {
        children, url, accept, listType, ...rest
      } = this.props;
      const { fileList } = this.state;
      const token = Cookies.get('token');
      return (
        <div className="file-uploader">
          <Upload
            action={url}
            beforeUpload={this.beforeUpload}
            fileList={fileList}
            onChange={this.handleChange}
            accept={accept}
            listType={listType}
            headers={token ? { token } : {}}
            {...rest}
          >
            {children}
          </Upload>
        </div>
      );
    }
}

export default UploadFile;
