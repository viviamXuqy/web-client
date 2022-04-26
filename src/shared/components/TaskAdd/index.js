import React, { PureComponent } from 'react';
import { object, func, number } from 'prop-types';
import { Row, Col, Button, Input, Icon, message, Select, InputNumber, Radio } from 'antd';

import ListPagination from '../../../shared/components/ListPagination';
import MiniTable from '../../../shared/components/MiniTable';
import BayonetSelectCameraTable from '../../../shared/components/MiniSelectDataTable';
import TaskTime from '../../../shared/components/TaskTime';
import './index.css';

class TaskAdd extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    updateFilter: func.isRequired,
    bayonets: object.isRequired,
    fetchBayonets: func.isRequired, // 已有卡口列表
    fetchBayonetCameras: func.isRequired, // 某卡口下摄像头列表
    submitTask: func.isRequired, // 添加任务
    fetchFeatures: func.isRequired, // 结构化数据列表
    taskType: number.isRequired,
    hideModal: func.isRequired,
  }

  state = {
    carFeatures: [], // 车辆结构化列表
    personFeatures: [], // 人体结构化列表
    total: 0, // 当前结构化能够识别的总数
    taskName: '', // 任务名
    bayonetId: '', // bayonetID
    bayonetName: '', // bayonetName
    searchBayonetName: '', // 检索bayonetName
    page: 1, // 当前页
    pageSize: 4, // 当前页数量
    pageCamera: 1, // 当前页（摄像头列表）
    pageSizeCamera: 5, // 当前页数量（摄像头列表）
    selectedRowKeys: [], // 选中的摄像头
    selectedCarRowKeys: [], // 选中的车辆结构化
    selectedPersonRowKeys: [], // 选中的人体结构化
    bayonetMeta: {},
    bayonetCameras: [], // bayonet摄像头数据集合
    selectedCameras: [], // 摄像头数据集合
    duration: [], // 时间组{type: 1, startTime: xxx, endTime: xxx, sTime, eTime, date}
    timeType: 1, // 默认永续
    deviceType: 1,
    isShowArrow: 'none', // 是否显示箭头
    frequency: 1, // 分析频率
    radioVal: '',
  }

  componentDidMount() {
    this.handleFetchBayonets();
    this.handleFetchFeatures();
    this.handleAddTime(1); // 默认添加一个时间
  }

  getDuration = key => {
    const { duration } = this.state;
    let typeTemp = -1;
    let obj = null;
    duration.forEach(d => {
      if (d.type === 1) {
        typeTemp = 1;
      }
      if (d.key === key) {
        obj = d;
      }
    });
    this.setState({
      timeType: typeTemp,
    });
    return obj;
  }

  dealTime = (key, date, sTime, eTime, type) => {
    const { duration } = this.state;
    let obj = this.getDuration(key);
    if (obj !== null) {
      obj.date = date || obj.date || 0;
      obj.type = type || obj.type || 1;
      obj.date = obj.type !== 3 ? 0 : obj.date;
      obj.sTime = sTime || obj.sTime || 0;
      obj.eTime = eTime || obj.eTime || 0;
      obj.startTime = obj.date + obj.sTime;
      obj.endTime = obj.date + obj.eTime;
    } else {
      obj = {
        key,
        type: type || 1,
        date: date || 0,
        sTime: sTime || 0,
        eTime: eTime || 0,
        startTime: (date || 0) + (sTime || 0),
        endTime: (date || 0) + (eTime || 0),
      };
      duration.push(obj);
    }
    this.setState({
      duration: duration.slice(0),
    }, () => {
      this.getDuration(key);
    });
  }

  handleFetchFeatures = async () => {
    const { fetchFeatures } = this.props;
    const { response } = await fetchFeatures();
    if (response) {
      const { carFeatures, personFeatures } = response;
      this.setState({
        ...response,
        carFeatures: carFeatures.map(item => ({
          ...item,
          key: item.id,
          // disabled: +item.model === 2,
          // tip: +item.model === 2,
          // title: +item.model === 2 && '该功能不能启动',
          funType: +item.id === 6 ? -1 : 0,
        })),
        personFeatures: personFeatures.map(item => ({
          ...item,
          key: item.id,
          // disabled: +item.model === 2,
          // tip: +item.model === 2,
          // title: +item.model === 2 && '该功能不能启动',
          funType: +item.id === 7 ? -1 : (+item.id === 8 ? 1 : 0), // eslint-disable-line
        })),
      });
    }
  }

  handleChangeStartTime = (timeString, key) => {
    this.dealTime(key, undefined, timeString, undefined, undefined);
  }

  handleChangeEndTime = (timeString, key) => {
    this.dealTime(key, undefined, undefined, timeString, undefined);
  }

  handleChangeDate = (date, key) => {
    this.dealTime(key, date, undefined, undefined, 3);
  }

  handleChangeRadio = (value, key) => {
    this.dealTime(key, undefined, undefined, undefined, value);
  }

  handleRemoveTime = key => {
    const { duration } = this.state;
    duration.splice(duration.findIndex(d => d.key === key), 1);
    this.setState({
      duration: duration.slice(0),
    });
  }

  handleAddTime = key => {
    this.dealTime(key, undefined, undefined, undefined, undefined);
  }

  handleChangeTaskName = e => {
    this.setState({
      taskName: e.target.value,
    });
  }

  handleSearch = value => {
    this.setState({
      searchBayonetName: value,
      page: 1, // 检索的时候页数重置为1
    }, () => {
      this.handleFetchBayonets();
    });
  }

  handleRemoveCamera = id => {
    const { selectedCameras } = this.state;
    selectedCameras.splice(selectedCameras.findIndex(c => c.id === id), 1);
    this.setState({
      selectedCameras: selectedCameras.slice(0),
    });
  }

  handleClearCamera = () => {
    const { selectedCameras } = this.state;
    selectedCameras.splice(0, selectedCameras.length);
    this.setState({
      selectedCameras: selectedCameras.slice(0),
    });
  }

  handleAddCamera = () => {
    const { selectedRowKeys, selectedCameras, bayonetCameras } = this.state;

    const unSelectedCameras = selectedRowKeys.filter(id =>
      !selectedCameras.some(item => item.id === id));

    const selectedCamerasTemp = bayonetCameras.filter(item =>
      unSelectedCameras.some(id => item.id === id));

    this.setState({
      selectedCameras: selectedCameras.concat(selectedCamerasTemp).slice(0),
    });
  }

  handleFetchBayonets = () => {
    const { fetchBayonets, updateFilter } = this.props;
    const { page, pageSize, searchBayonetName } = this.state;

    const filters = { search: searchBayonetName, page, pageSize };

    updateFilter('bayonets', filters);

    fetchBayonets();
  }

  handleFetchBayonetCameras = bayonet => {
    this.setState({
      bayonetId: bayonet.bayonetId,
      bayonetName: bayonet.name,
      deviceType: bayonet.deviceType,
      pageCamera: 1,
    }, () => {
      this.handleFetchBayonetCamerasReq();
    });
  }

  handleFetchBayonetCamerasReq = () => {
    const { fetchBayonetCameras } = this.props;

    const { pageCamera, pageSizeCamera, bayonetId } = this.state;
    const options = { page: pageCamera, pageSize: pageSizeCamera };

    fetchBayonetCameras(bayonetId, options).then(({ response, meta }) => {
      if (response) {
        this.setState({
          bayonetCameras: response,
          bayonetMeta: meta,
          isShowArrow: response.length > 0 ? '' : 'none',
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
      selectedRowKeys: [],
    }, () => {
      this.handleFetchBayonetCamerasReq();
    });
  }

  handleCarRowSelectChange = (selectedRowKeys, selectedRows) => {
    const {
      selectedCarRowKeys, selectedPersonRowKeys, carFeatures, personFeatures, total,
    } = this.state;

    let selectedRowKeysTemp = selectedRowKeys;
    if (total > 0 && (selectedRowKeysTemp.length + selectedPersonRowKeys.length) > total) {
      message.warn('不能超过最大结构化识别数量，请重新选择');
      selectedRowKeysTemp = selectedCarRowKeys;
    }

    this.handleFunSelect(
      selectedRowKeysTemp,
      selectedRows,
      selectedCarRowKeys,
      carFeatures,
      selectedPersonRowKeys,
      personFeatures,
    );

    this.setState({
      selectedCarRowKeys: selectedRowKeysTemp,
    });
  }

  handlePersonRowSelectChange = (selectedRowKeys, selectedRows) => {
    const {
      selectedCarRowKeys, selectedPersonRowKeys, carFeatures, personFeatures, total,
    } = this.state;

    let selectedRowKeysTemp = selectedRowKeys;
    if (total > 0 && (selectedRowKeysTemp.length + selectedCarRowKeys.length) > total) {
      message.warn('不能超过最大结构化识别数量，请重新选择');
      selectedRowKeysTemp = selectedPersonRowKeys;
    }

    this.handleFunSelect(
      selectedRowKeysTemp,
      selectedRows,
      selectedPersonRowKeys,
      personFeatures,
      selectedCarRowKeys,
      carFeatures,
    );

    this.setState({
      selectedPersonRowKeys: selectedRowKeysTemp,
    });
  }

  handleFunSelect = (
    selectedRowKeys,
    selectedRows,
    currSelectedRowKeys,
    currFeatures,
    otherSelectedRowKeys,
    otherFeatures,
  ) => {
    const {
      carFeatures, personFeatures,
    } = this.state;

    let disabled = true;
    let id = selectedRowKeys.find(idTemp => !currSelectedRowKeys.includes(idTemp)); // 选中id
    if (!id) {
      disabled = false;
      id = currSelectedRowKeys.find(idTemp => !selectedRowKeys.includes(idTemp)); // 取消选中id
    }
    if (id) {
      const item = currFeatures.find(itemTemp => itemTemp.id === id);
      if (item) {
        if (!disabled) {
          disabled = currFeatures.filter(c => selectedRowKeys.includes(c.id)).concat(
            otherFeatures.filter(i => otherSelectedRowKeys.includes(i.id)),
          ).find(i => (i.funType === item.funType)) ? true : disabled; // 其他已有选中相同类型的
        }
        const funType = -item.funType; // 互斥类型
        if (+item.model === 1 && item.funType !== 0) { // 模型为remark
          this.setState({
            personFeatures: personFeatures.map(itemTemp => ({
              ...itemTemp,
              disabled: itemTemp.funType === funType ? disabled : itemTemp.disabled,
              tip: itemTemp.funType === funType ? disabled : itemTemp.tip,
              title: itemTemp.funType === funType ? '与已选功能不能同时启动' : itemTemp.title,
            })),
            carFeatures: carFeatures.map(itemTemp => ({
              ...itemTemp,
              disabled: itemTemp.funType === funType ? disabled : itemTemp.disabled,
              tip: itemTemp.funType === funType ? disabled : itemTemp.tip,
              title: itemTemp.funType === funType ? '与已选功能不能同时启动' : itemTemp.title,
            })),
          });
        }
      }
    }
  }

  handleRowSelect = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  }

  handleOkClick = () => {
    const {
      taskType, submitTask, hideModal, intl,
    } = this.props;
    const {
      bayonetName,
      bayonetId,
      taskName,
      timeType,
      deviceType,
      selectedCarRowKeys,
      selectedPersonRowKeys,
      duration,
      selectedCameras,
      frequency,
      carFeatures,
      personFeatures,
    } = this.state;

    if (selectedCameras.length === -1) {
      message.warn('请选择需要添加任务的摄像头');
      return;
    }
    if (taskName === '') {
      message.warn(intl.formatMessage({ id: 'App.RT.rule.taskName' }));
      return;
    }

    const cars = selectedCarRowKeys.filter(id => +carFeatures.find(cs => cs.id === id).model === 2);
    const persons = selectedPersonRowKeys.filter(id =>
      +personFeatures.find(ps => ps.id === id).model === 2);
    const commons = selectedCarRowKeys.concat(selectedPersonRowKeys)
      .filter(id => carFeatures.concat(personFeatures).find(c => c.id === id).model === 1);

    let state = 0; // 默认为0不开启，创建任务后不开始执行，为1开始执行

    const durationTemp = [];
    if (timeType !== 1) {
      for (let i = 0; i < duration.length; i++) {
        const {
          type, startTime, endTime, sTime, eTime,
        } = duration[i];
        durationTemp.push(`${type},${startTime},${endTime}`);
        if (type !== 1) {
          if (startTime === 0 || endTime === 0) {
            message.warn(intl.formatMessage({ id: 'App.RT.rule.time.required' }));
            return;
          }
          if (sTime > eTime) {
            message.warn(intl.formatMessage({ id: 'App.RT.rule.time.section' }));
            return;
          }
        }
      }
    } else {
      durationTemp.push('1,0,0'); // 1为永续
      state = 1;
    }
    duration.splice(0, duration.length);

    const datas = [];
    selectedCameras.forEach(c => {
      const obj = {
        bayonetId,
        bayonetName,
        cameraName: c.name,
        name: taskName,
        type: taskType,
        cameraId: c.id,
        duration: durationTemp,
        deviceType,
        carFeatures: cars,
        personFeatures: persons,
        commonFeatures: commons,
        frequency,
        state,
      };
      datas.push(obj);
    });

    submitTask({ type: taskType, tasks: datas }).then(({ isOk }) => {
      if (isOk) {
        hideModal();
        message.success(intl.formatMessage({ id: 'App.message.add.success' }));
      }
    });
  }

  handleChangeFreRadio = e => {
    this.setState({
      radioVal: e.target.value,
    });
  }

  handleFreValue = (radioVal, value) => {
    if (+value) {
      this.setState({
        frequency: +value,
        radioVal,
      });
    }
  }

  render() {
    const {
      hideModal, bayonets, meta, intl,
    } = this.props;
    const {
      bayonetCameras,
      bayonetMeta,
      selectedRowKeys,
      selectedCarRowKeys,
      selectedPersonRowKeys,
      carFeatures,
      personFeatures,
      total,
      selectedCameras,
      isShowArrow,
      duration,
      pageCamera,
      pageSizeCamera,
      radioVal,
      frequency,
    } = this.state;

    return (
      <div className="app-task-add save-panel">
        <div>
          <Row>
            <Col span={3}>
              <div className="label">{intl.formatMessage({ id: 'App.RT.taskName' })}</div>
            </Col>
            <Col span={10} offset={1}>
              <div className="input">
                <Input onChange={this.handleChangeTaskName} placeholder={intl.formatMessage({ id: 'App.RT.rule.taskName' })} />
              </div>
            </Col>
            <Col span={10}>
              <div>
                <span className="label">{intl.formatMessage({ id: 'App.RT.add.structural' })}</span>
                {total > 0 &&
                <span className="lable2" style={{ marginLeft: 20 }}>{intl.formatMessage({ id: 'App.RT.available' })}：{selectedCarRowKeys.length + selectedPersonRowKeys.length}/{total}</span>}
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col span={3}>
              <div className="label">{intl.formatMessage({ id: 'App.RT.add.checkpoint' })}</div>
            </Col>
            <Col span={10} offset={1}>
              <div>
                <Input.Search
                  enterButton={intl.formatMessage({ id: 'App.control.search' })}
                  style={{ width: 280 }}
                  onSearch={value => this.handleSearch(value)}
                />
              </div>
              <div className="bayonet-table">
                <MiniTable
                  datas={[...bayonets.keys()].map(id => ({ key: id, ...bayonets.get(id) }))}
                  tableHeight={150}
                  tableWidth={280}
                  hasPage
                  hasTree={false}
                  hasCheckbox={false}
                  meta={meta}
                  onRowClick={this.handleFetchBayonetCameras}
                  onPaginationChange={this.handlePaginationClick}
                />
              </div>
            </Col>
            <Col span={10}>
              <div>
                <Row>
                  <Col span={12}>
                    <span className="lable2">{intl.formatMessage({ id: 'App.public.struct.carFun' })}</span>
                    <div className="feature">
                      <MiniTable
                        datas={carFeatures}
                        tableHeight={170}
                        tableWidth={120}
                        hasPage={false}
                        hasTree={false}
                        hasCheckbox
                        selectedRowKeys={selectedCarRowKeys}
                        onSelectChange={this.handleCarRowSelectChange}
                        disableCheckbox
                        className="disabled"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <span className="lable2">{intl.formatMessage({ id: 'App.public.struct.personFun' })}</span>
                    <div className="feature">
                      <MiniTable
                        datas={personFeatures}
                        tableHeight={170}
                        tableWidth={120}
                        hasPage={false}
                        hasTree={false}
                        hasCheckbox
                        selectedRowKeys={selectedPersonRowKeys}
                        onSelectChange={this.handlePersonRowSelectChange}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div className="select-camera">
          <Row>
            <Col span={3}>
              <div className="label">{intl.formatMessage({ id: 'App.RT.add.select.camera' })}</div>
            </Col>
            <Col span={8} offset={1}>
              <div className="select-camera-table">
                <ListPagination
                  type={1}
                  defaultPageSize={pageSizeCamera}
                  page={pageCamera}
                  datas={bayonetCameras}
                  selectedRowKeys={selectedRowKeys}
                  onSelectChange={this.handleRowSelect}
                  onPaginationChange={this.handleCameraPaginationClick}
                  total={bayonetMeta.total}
                />
              </div>
            </Col>
            <Col span={2}>
              <div style={{ marginLeft: 21, marginTop: 50, display: isShowArrow }}>
                <div>
                  <Button
                    size="small"
                    type="primary"
                    onClick={this.handleAddCamera}
                  >
                    <span>{'>'}</span>
                  </Button>
                </div>
                <div style={{ marginTop: 15 }}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={this.handleClearCamera}
                  >
                    <span>{'<'}</span>
                  </Button>
                </div>
              </div>
            </Col>
            <Col span={10}>
              <div style={{ marginTop: -30 }}>
                <div>
                  <span className="lable2">{intl.formatMessage({ id: 'App.RT.add.checked.camera' })}：{selectedCameras.length}</span>
                  <span className="fr selected-camera-clear">
                    <Icon type="delete" />
                    <button onClick={this.handleClearCamera} className="selected-camera-tablelink">{intl.formatMessage({ id: 'App.control.clearAll' })}</button>
                  </span>
                </div>
                <div className="selected-camera">
                  <BayonetSelectCameraTable
                    datas={selectedCameras}
                    tableHeight={186}
                    tableWidth={280}
                    removeData={this.handleRemoveCamera}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col span={3}>
              <div className="lable">{intl.formatMessage({ id: 'App.RT.add.frequency' })}</div>
            </Col>
            <Col span={3} offset={1}>
              <Select className="w-full" defaultValue={frequency} onChange={val => this.handleFreValue(-1, val)}>
                <Select.Option value={1}>1{intl.formatMessage({ id: 'App.RT.add.frequency.unit' })}</Select.Option>
                <Select.Option value={5}>5{intl.formatMessage({ id: 'App.RT.add.frequency.unit' })}</Select.Option>
                <Select.Option value={10}>10{intl.formatMessage({ id: 'App.RT.add.frequency.unit' })}</Select.Option>
                <Select.Option value={30}>30{intl.formatMessage({ id: 'App.RT.add.frequency.unit' })}</Select.Option>
                <Select.Option value={60}>60{intl.formatMessage({ id: 'App.RT.add.frequency.unit' })}</Select.Option>
              </Select>
            </Col>
            <Col span={3} className="lh-32 ml-15">
              <Radio.Group onChange={this.handleChangeFreRadio} value={radioVal}>
                <Radio value={1}>{intl.formatMessage({ id: 'App.RT.add.frequency.custom' })}</Radio>
              </Radio.Group>
            </Col>
            <Col span={3} className="ml-5 ml-r-36">
              <InputNumber min={1} onChange={val => this.handleFreValue(1, val)} />
            </Col>
            <Col span={1}>
              <div className="lh-32">{intl.formatMessage({ id: 'App.RT.add.frequency.unit' })}</div>
            </Col>
            <Col span={9} offset={1}>{intl.formatMessage({ id: 'App.RT.add.frequency.note' })}
            </Col>
          </Row>
        </div>
        <div className="mt-36">
          <Row>
            <Col span={3}>
              <div className="label">{intl.formatMessage({ id: 'App.RT.add.setTime' })}</div>
            </Col>
            <Col span={23} offset={-1}>
              <div style={{ marginTop: -32 }}>
                <TaskTime
                  duration={duration}
                  onChangeStartTime={this.handleChangeStartTime}
                  onChangeEndTime={this.handleChangeEndTime}
                  onChangeDate={this.handleChangeDate}
                  onChangeRadio={this.handleChangeRadio}
                  onRemoveTime={this.handleRemoveTime}
                  onAddTime={this.handleAddTime}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="window-content__footer buttons-group text-center">
          <Button onClick={hideModal}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            disabled={selectedCameras.length === 0}
            onClick={this.handleOkClick}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default TaskAdd;
