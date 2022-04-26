import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Row, Col, Button, Input, message } from 'antd';

import MiniTable from '../../../shared/components/MiniTable';

import './index.css';

class BayonetAdd extends PureComponent {
  static propTypes = {
    meta: object.isRequired,
    updateFilter: func.isRequired,
    bayonets: object.isRequired,
    fetchBayonets: func.isRequired, // 已有卡口列表
    fetchBayonetCameras: func.isRequired, // 某卡口下摄像头列表
    addCamera: func.isRequired, // 添加摄像头
    renameBayonet: func.isRequired, // 重命名卡口
    hideModal: func.isRequired,
    intl: object.isRequired,
  }

  state = {
    bayonetId: '',
    bayonetName: '',
    renameBayonetName: '',
    cameraName: '', // 摄像头名称
    rtsp: '', // rtsp
    bayonetCameras: [], // bayonet摄像头数据集合
    page: 1, // 当前页
    pageSize: 4, // 当前页数量
    pageCamera: 1, // 当前页（摄像头列表）
    pageSizeCamera: 4, // 当前页数量（摄像头列表）
  }

  componentDidMount() {
    this.handleFetchBayonets();
  }

  handleRowCameraClick = camera => {
    this.setState({
      cameraName: camera.name,
      rtsp: camera.rtsp,
    });
  }

  handleFetchBayonets = () => {
    const { fetchBayonets, updateFilter } = this.props;
    const { page, pageSize } = this.state;

    const filters = { page, pageSize };

    updateFilter('bayonets', filters);

    fetchBayonets();
  }

  handleFetchBayonetCameras = bayonet => {
    this.setState({
      cameraName: '',
      bayonetId: bayonet.bayonetId,
      bayonetName: bayonet.name,
      pageCamera: 1,
    }, () => {
      this.handleFetchBayonetCamerasReq();
    });
  }

  handleFetchBayonetCamerasReq = () => {
    const { fetchBayonetCameras, intl } = this.props;

    const {
      bayonetId, bayonetName,
    } = this.state;

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

  handlePaginationClick = page => {
    this.setState({
      page,
    }, () => {
      this.handleFetchBayonets();
    });
  }

  handleCameraPaginationClick = page => {
    this.setState({
      pageCamera: page,
      cameraName: '',
    });
  }

  handleOkClick = () => {
    const { addCamera, hideModal, intl } = this.props;
    const {
      bayonetId, cameraName, rtsp,
    } = this.state;

    if (cameraName === '') {
      message.warn(intl.formatMessage({ id: 'App.ipc.add.message.camera' }));
      return;
    }

    const options = {
      bayonetId, name: cameraName, rtsp, type: 1,
    };

    addCamera(options).then(({ isOk }) => {
      if (isOk) {
        hideModal();
        message.success(intl.formatMessage({ id: 'App.ipc.addCamera.success' }));
      }
    });
  }

  handleRenameBayonet = () => {
    const { renameBayonet, intl } = this.props;
    const { renameBayonetName, bayonetId } = this.state;

    if (bayonetId === '') {
      message.warn(intl.formatMessage({ id: 'App.ipc.rule.checkpoint' }));
      return;
    }
    if (renameBayonetName === '') {
      message.warn(intl.formatMessage({ id: 'App.ipc.rule.checkpoint.isRequired' }));
      return;
    }

    // 这里发送数据
    const options = { bayonetName: renameBayonetName };
    renameBayonet(bayonetId, options).then(({ isOk }) => {
      if (isOk) {
        message.success(intl.formatMessage({ id: 'App.message.rename.success' }));
      }
    });
  }

  handleChangeBayonetName = e => {
    this.setState({
      renameBayonetName: e.target.value,
    });
  }

  render() {
    const {
      hideModal, bayonets, meta, intl,
    } = this.props;
    const {
      bayonetCameras, bayonetName, pageCamera, pageSizeCamera, cameraName,
    } = this.state;

    return (
      <div className="app-camera-bayonetAdd">
        <Row>
          <Col span={10}>
            <div>
              <h3>{intl.formatMessage({ id: 'App.ipc.checkpoints.exists' })}</h3>
              <MiniTable
                datas={[...bayonets.keys()].map(id => ({ key: id, ...bayonets.get(id) }))}
                tableHeight={150}
                tableWidth={278}
                hasPage
                hasTree={false}
                hasCheckbox={false}
                meta={meta}
                onRowClick={this.handleFetchBayonetCameras}
                onPaginationChange={this.handlePaginationClick}
              />
            </div>
            <div className="fl" style={{ display: 'none' }}>
              <Input onChange={this.handleChangeBayonetName} placeholder={bayonetName} />
              <Button type="primary" onClick={this.handleRenameBayonet}>{intl.formatMessage({ id: 'App.ipc.checkpoint.rename' })}</Button>
            </div>
          </Col>
          <Col span={2} offset={1} className="app-camera-bayonetAdd__actions">
            <Button
              size="small"
              type="primary"
            >
              <span>{'>'}</span>
            </Button>
          </Col>
          <Col span={10}>
            <div>
              <h3>{intl.formatMessage({ id: 'App.ipc.corresponding' })}</h3>
              <MiniTable
                datas={bayonetCameras}
                tableHeight={150}
                tableWidth={278}
                hasPage
                hasTree={false}
                hasCheckbox={false}
                meta={{
                  current: pageCamera,
                  pageSize: pageSizeCamera,
                  total: bayonetCameras.length,
                }}
                onRowClick={this.handleRowCameraClick}
                onPaginationChange={this.handleCameraPaginationClick}
              />
            </div>
          </Col>
        </Row>
        <div className="window-content__footer buttons-group text-center">
          <Button onClick={hideModal}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            disabled={cameraName === ''}
            onClick={this.handleOkClick}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default BayonetAdd;
