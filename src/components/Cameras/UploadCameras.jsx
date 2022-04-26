import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { Form, Upload, Button, Icon, message } from 'antd';
import { injectIntl } from 'react-intl';
import Cookies from 'js-cookie';
// import Cicon from 'shared/components/Cicon';
import { API } from '../../constants/config';

class UploadCameras extends PureComponent {
    static propTypes = {
      onUploadFile: func.isRequired,
      hideModal: func.isRequired,
      uploadFile: func.isRequired,
      intl: object.isRequired,
    }

    constructor(props) {
      super(props);
      this.state = { fileList: [], uploading: false, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    }

    beforeUpload = f => {
      const file = f;
      const isValidType = file.type === this.state.type;
      const { intl } = this.props;
      if (!isValidType) {
        message.error(intl.formatMessage({ id: 'App.ipc.uploadModal.require' }));

        return false;
      }
      const isLt30M = file.size / 1024 / 1024 <= 30;
      if (!isLt30M) {
        message.error(intl.formatMessage({ id: 'App.ipc.uploadModal.size' }));
        return false;
      }

      this.setState({
        fileList: [].concat(file),
      });
      return false;
    }

    removeFile = file => {
      this.setState(({ fileList }) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
      });
    }

    handleUpload = () => {
      const { fileList } = this.state;
      const { onUploadFile } = this.props;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('file', file);
      });

      this.setState({
        uploading: true,
      });
      const { uploadFile, hideModal, intl } = this.props;
      uploadFile(formData).then(({ isOk }) => {
        if (isOk) {
          message.success(intl.formatMessage({ id: 'App.ipc.uploadModal.success' }));
          this.setState({
            fileList: [],
            uploading: false,
          }, () => {
            hideModal();
            onUploadFile();
          });
        }
      });
    }

    render() {
      const { fileList, uploading } = this.state;
      const { intl } = this.props;
      const token = Cookies.get('token');
      return (
        <div
          className="upload-modal"
        >
          <Upload
            action="/api/cameraFlush"
            className="cameras-uploader"
            beforeUpload={this.beforeUpload}
            onRemove={this.removeFile}
            headers={
              token ? { token } : {}
            }
            fileList={fileList}
          >
            <Button>
              <Icon type="upload" />{intl.formatMessage({ id: 'App.ipc.upload' })}
            </Button>
          </Upload>
          <div className="mb-8"><span className="text-danger">{intl.formatMessage({ id: 'App.ipc.uploadModal.notice' })}</span>
            <a href={`${API}/eye/template.xlsx`}>{intl.formatMessage({ id: 'App.ipc.uploadModal.download' })}</a>
          </div>
          <div>
            <Button
              type="primary"
              disabled={this.state.fileList.length === 0}
              loading={uploading}
              onClick={this.handleUpload}
              className="mr-8"
            >{intl.formatMessage({ id: 'App.control.refresh' })}
            </Button>
            <Button onClick={this.props.hideModal}>{intl.formatMessage({ id: 'App.control.close' })}</Button>
          </div>
        </div>
      );
    }
}

export default Form.create({})(injectIntl(UploadCameras));
