import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Modal, message, Card, Tag } from 'antd';
import { injectIntl } from 'react-intl';
import Cookies from 'js-cookie';

import Sider from '../../containers/layout/Sider';

import ImageCut from '../../shared/containers/CameraImageCut';
import BayonetAdd from '../../shared/containers/BayonetAdd';
import BayonetNewAdd from '../../shared/containers/BayonetNewAdd';
import BayonetNewRtspAdd from '../../shared/containers/BayonetNewRtspAdd';

import Filter from './Filter';
import Table from './Table';
import UploadCameras from './UploadCameras';

import './index.css';


class Camera extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    filter: object.isRequired,
    meta: object.isRequired,
    cameras: object.isRequired,
    fetchCameras: func.isRequired,
    updateFilter: func.isRequired,
    deleteCameras: func.isRequired,
    updateCameraRec: func.isRequired,
    updateCameraRecs: func.isRequired,
    uploadFile: func.isRequired,
    getCameraNum: func.isRequired,
    getTasknum: func.isRequired,
  }

  state = {
    currCamera: '', // 当前操作的摄像机对象
    modalVisible: false, // 设置界面
    modalVisibleBayonetAdd: false, // 已有卡口界面
    modalVisibleBayonetNewAdd: false, // 新增卡口界面
    modalVisibleBayonetNewRtspAdd: false, // 新增Rtsp卡口界面
    uploadFileModal: false, // 上传批量刷新列表界面
    selectedRowKeys: [],
    bayonetName: '', // 卡口名字
    page: 1, // 当前页
    pageSize: 14, // 当前页数量
    cameraNameOrder: 0, // 摄像头名称排序
    deviceTypeOrder: 0, // 设备类型排序 0默认不传给服务器
    ipOrder: 0, // 集成IP排序
    portOrder: 0, // 端口排序
    delSize: 0, // 一个用户删除个数，用来避免最后一页删除后，还是请求的没有用的
    num: 0, // 任务开启数量
    total: 0, // 任务能开启的总数量
  }

  componentDidMount() {
    // 接口暂定
    const { getCameraNum } = this.props; // eslint-disable-line no-unused-vars

    // getCameraNum().then(({ response }) => {
    //   if (response) {
    //     this.setState({
    //       ...response,
    //     });
    //   }
    // });
    this.handleFetchCameras();
  }

  handleFetchCameras = () => {
    const { fetchCameras, meta } = this.props;
    const {
      bayonetName, page, pageSize, cameraNameOrder, deviceTypeOrder, ipOrder, portOrder, delSize,
    } = this.state;

    let pageTemp = Math.ceil((meta.total - delSize) / pageSize);
    pageTemp = page > pageTemp ? (page - 1) : page;
    pageTemp = pageTemp <= 0 ? 1 : pageTemp;

    const filters = {
      bayonetName,
      page: pageTemp,
      pageSize,
      cameraNameOrder: cameraNameOrder === 0 ? '' : cameraNameOrder,
      deviceTypeOrder: deviceTypeOrder === 0 ? '' : deviceTypeOrder,
      ipOrder: ipOrder === 0 ? '' : ipOrder,
      portOrder: portOrder === 0 ? '' : portOrder,
    };

    this.updateFilter(filters);

    fetchCameras();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('cameras', values);
  }

  handleSearch = values => {
    this.setState({
      ...values,
      page: 1,
    }, () => {
      this.handleFetchCameras();
    });
  }

  showCameraSet = (text, record) => {
    this.setState({
      currCamera: record,
      modalVisible: true,
    });
  }

  showModal = modal => {
    const nextState = {};
    nextState[modal] = true;
    this.setState(nextState);
  }

  hideModal = modal => {
    const nextState = {};
    nextState[modal] = false;
    this.setState(nextState);
  }

  handleDelete = id => {
    const self = this;
    const {
      intl, cameras, deleteCameras,
    } = this.props;

    this.setState({
      delSize: 1,
    });

    const msg = intl.formatMessage({ id: 'App.message.delete.warn' });
    const title = (
      <span>
        {msg}&nbsp;&nbsp;
        {id.map(idTemp => {
          const camera = cameras.get(idTemp);

          return camera && <Tag color="orange" key={idTemp}>{camera.name}</Tag>;
        })}?
      </span>
    );
    const successMsg = intl.formatMessage({ id: 'App.message.delete.success' });

    Modal.confirm({
      title,
      okType: 'danger',
      onOk() {
        deleteCameras(id)
          .then(({ isOk }) => {
            if (isOk) {
              self.setState({
                selectedRowKeys: [],
              });
              message.success(successMsg);
              self.handleFetchCameras();
            }
          });
      },
    });
  }

  handleRowSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  handleMultiSwitch = () => {
    const { selectedRows } = this.state;
    const { updateCameraRecs, getTasknum, intl } = this.props;
    const states = selectedRows.map(item => ({
      id: item.id,
      state: item.state === 1 ? 0 : 1,
    }));
    let checked = states.filter(item => item.state === 0);
    if (checked.length) {
      checked = checked.map(item => item.id).join(',');
      const me = this;
      getTasknum(checked).then(({ isOk }) => {
        if (isOk) {
          Modal.confirm({
            title: intl.formatMessage({ id: 'App.ipc.closeCamera.message' }),
            okType: 'danger',
            onOk() {
              updateCameraRecs({ states }).then().then(() => me.handleFetchCameras());
            },
          });
        } else {
          updateCameraRecs({ states }).then().then(() => me.handleFetchCameras());
        }
      });
    } else {
      updateCameraRecs({ states }).then().then(() => this.handleFetchCameras());
    }
  }

  handleChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    const { order, columnKey } = sorter;
    this.setState({
      cameraNameOrder: 0,
      deviceTypeOrder: 0,
      ipOrder: 0,
      portOrder: 0,
    });
    switch (columnKey) {
      case 'name':
        this.setState({
          cameraNameOrder: order === 'ascend' ? 1 : -1,
          page: current,
        }, () => {
          this.handleFetchCameras();
        });
        break;
      case 'deviceType':
        this.setState({
          deviceTypeOrder: order === 'ascend' ? 1 : -1,
          page: current,
        }, () => {
          this.handleFetchCameras();
        });
        break;
      case 'ip':
        this.setState({
          ipOrder: order === 'ascend' ? 1 : -1,
          page: current,
        }, () => {
          this.handleFetchCameras();
        });
        break;
      case 'port':
        this.setState({
          portOrder: order === 'ascend' ? 1 : -1,
          page: current,
        }, () => {
          this.handleFetchCameras();
        });
        break;
      default:
        this.setState({
          page: current,
        }, () => {
          this.handleFetchCameras();
        });
        break;
    }
  }

  render() {
    const {
      meta, cameras, filter, uploadFile, updateCameraRec, getTasknum, intl,
    } = this.props;
    const {
      selectedRowKeys, currCamera, uploadFileModal, num, total,
    } = this.state;
    const user = JSON.parse(Cookies.get('user'));
    return (
      <React.Fragment>
        <Sider selectedKey="cameras-ipc" />
        <div className="app-page">
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">
              {intl.formatMessage({ id: 'App.ipc.title' })}
            </h1>
            {total > 0 && <div className="cameras-task">任务开启：{num}/{total}</div>}
            <Filter
              filter={filter}
              onSearch={this.handleSearch}
              onBayonetAdd={() => this.showModal('modalVisibleBayonetAdd')}
              onBayonetNewAdd={() => this.showModal('modalVisibleBayonetNewAdd')}
              onBayonetNewRtspAdd={() => this.showModal('modalVisibleBayonetNewRtspAdd')}
              onUploadFile={() => this.showModal('uploadFileModal')}
            />
            <div className="app-page__actions buttons-group">
              <Button
                type="warn"
                icon="primary"
                disabled={user.grade === '3' || selectedRowKeys.length === 0}
                onClick={this.handleMultiSwitch}
              >
                {intl.formatMessage({ id: 'App.ipc.switch.all' })}
              </Button>
            </div>
            <Table
              cameras={cameras}
              meta={meta}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={this.handleRowSelect}
              showCameraSet={(text, record) => { this.showCameraSet(text, record); }}
              deleteCameras={this.handleDelete}
              updateCameraStatus={this.updateCameraStatus}
              updateCameraRec={updateCameraRec}
              handleChange={this.handleChange}
              handleFetchCameras={this.handleFetchCameras}
              getTasknum={getTasknum}
            />
          </Card>
          {this.state.modalVisible &&
            <Modal
              width={483}
              title={intl.formatMessage({ id: 'App.ipc.camera.setting' })}
              visible={this.state.modalVisible}
              onCancel={() => this.hideModal('modalVisible')}
              footer={<center><Button onClick={() => this.hideModal('modalVisible')}>{intl.formatMessage({ id: 'App.control.close' })}</Button></center>}
            >
              <ImageCut
                currCamera={currCamera}
                handleFreshTable={this.handleFetchCameras}
              />
            </Modal>}
          {this.state.modalVisibleBayonetAdd &&
            <Modal
              width={740}
              title={intl.formatMessage({ id: 'App.ipc.existCheckpoint' })}
              visible={this.state.modalVisibleBayonetAdd}
              footer={null}
              onCancel={() => this.hideModal('modalVisibleBayonetAdd')}
            >
              <BayonetAdd
                intl={intl}
                hideModal={() => this.hideModal('modalVisibleBayonetAdd')}
              />
            </Modal>}
          {this.state.modalVisibleBayonetNewAdd &&
            <Modal
              width={740}
              title={intl.formatMessage({ id: 'App.ipc.add.title' })}
              visible={this.state.modalVisibleBayonetNewAdd}
              footer={null}
              onCancel={() => this.hideModal('modalVisibleBayonetNewAdd')}
            >
              <BayonetNewAdd
                hideModal={() => this.hideModal('modalVisibleBayonetNewAdd')}
                intl={intl}
              />
            </Modal>}
          {this.state.modalVisibleBayonetNewRtspAdd &&
          <Modal
            width={600}
            title={intl.formatMessage({ id: 'App.ipc.quickAdd.title' })}
            visible={this.state.modalVisibleBayonetNewRtspAdd}
            footer={null}
            onCancel={() => this.hideModal('modalVisibleBayonetNewRtspAdd')}
          >
            <BayonetNewRtspAdd
              hideModal={() => this.hideModal('modalVisibleBayonetNewRtspAdd')}
              intl={intl}
            />
          </Modal>}
          {uploadFileModal &&
          <Modal
            width={740}
            title={intl.formatMessage({ id: 'App.ipc.uploadModal.title' })}
            visible={uploadFileModal}
            footer={null}
            onCancel={() => this.hideModal('uploadFileModal')}
          >
            <UploadCameras
              hideModal={() => this.hideModal('uploadFileModal')}
              onUploadFile={this.handleFetchCameras}
              uploadFile={uploadFile}
            />
          </Modal>}
        </div>
      </React.Fragment>
    );
  }
}

export default (injectIntl(Camera));
