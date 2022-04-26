import React, { PureComponent } from 'react';
import { func, number, object } from 'prop-types';
import { Row, Col, Button, Input, Icon, message, Select, InputNumber, Radio } from 'antd';

import MiniTable from '../../../shared/components/MiniTable';
import ResourceSelectFileTable from '../../../shared/components/MiniSelectDataTable';
import ListPagination from '../../../shared/components/ListPagination';
import { TASK_TYPE, API_URL } from '../../../constants/config';
import UploadFile from '../../../shared/components//UploadFile';

import './index.css';


class TaskVideoAdd extends PureComponent {
  static propTypes = {
    fetchResources: func.isRequired, // 目录列表
    fetchResourceTree: func.isRequired, // 目录下树
    fetchResourceTreeFile: func.isRequired, // 某目录下文件列表
    fetchFeatures: func.isRequired, // 结构化数据列表
    submitTask: func.isRequired,
    hideModal: func.isRequired,
    taskType: number.isRequired,
    intl: object.isRequired,
  }

  state = {
    carFeatures: [], // 车辆结构化列表
    personFeatures: [], // 人体结构化列表
    total: 0, // 当前结构化能够识别的总数
    taskName: '', // 任务名
    resourcePath: '', // resourcePath
    resourceName: '', // resourceName
    searchResourceName: '', // 检索ResourceName
    page: 1, // 当前页
    pageSize: 4, // 当前页数量
    pageFile: 1, // 当前页（文件列表）
    selectedRowKeys: [], // 选中的文件
    selectedCarRowKeys: [], // 选中的车辆结构化
    selectedPersonRowKeys: [], // 选中的人体结构化
    resourceMeta: {}, // 目录meta数据
    resources: [], // 目录数据
    resourceFiles: [], // Resource文件数据集合
    selectedFiles: [], // 选中的数据集合
    isShowArrow: 'none', // 是否显示箭头
    searchText: '', // 搜索关键字
    searchValue: '',
    frequency: 1, // 分析频率
    radioVal: '',
  }

  componentDidMount() {
    this.handleFetchResources();
    this.handleFetchFeatures();
  }

  onSearchValueChangeHandler = e => {
    this.setState({
      searchValue: e.target.value,
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

  handleSearch = value => {
    this.setState({
      searchResourceName: value,
    }, () => {
      this.handleFetchResources();
    });
  }

  handleChangeTaskName = e => {
    this.setState({
      taskName: e.target.value,
    });
  }

  /* 搜索视频 */
  handleLocalSearch = value => {
    this.setState({
      searchText: value,
    });
  }

  handleRemoveData = id => {
    const { selectedFiles } = this.state;
    selectedFiles.splice(selectedFiles.findIndex(f => f.id === id), 1);

    this.setState({
      selectedFiles: selectedFiles.slice(0),
    });
  }

  handleClearData = () => {
    const { selectedFiles } = this.state;
    selectedFiles.splice(0, selectedFiles.length);
    this.setState({
      selectedFiles: selectedFiles.slice(0),
    });
  }

  handleAddData = () => {
    const { selectedRowKeys, selectedFiles, resourceFiles } = this.state;

    const unSelectedFiles = selectedRowKeys.filter(id =>
      !selectedFiles.some(item => item.path === id));

    const selectedFilesTemp = resourceFiles.filter(item =>
      unSelectedFiles.some(id => item.path === id));

    this.setState({
      selectedFiles: selectedFiles.concat(selectedFilesTemp).slice(0),
    });
  }

  handleFetchResources = async () => {
    const { fetchResources, taskType } = this.props;
    const { page, pageSize, searchResourceName } = this.state;

    const filters = {
      search: searchResourceName,
      page,
      pageSize,
      type: taskType, // type: 1.实时 2.视频 3.图片
    };

    const self = this;
    const { response, meta } = await fetchResources(filters);
    if (response) {
      self.setState({
        resources: response.map(item => ({ ...item, children: [] })),
        resourceMeta: meta,
      });
    }
  }

  handleExpandClick = (expanded, record) => {
    const { fetchResourceTree } = this.props;
    const { resources } = this.state;
    if (resources.some(item => item.path === record.path)) {
      this.setState({
        resourceName: record.name,
      });
    }
    const self = this;
    if (expanded) {
      fetchResourceTree({ path: record.path }).then(({ response }) => {
        if (response) {
          const { path, children } = response;
          self.setState({
            resources: resources.map(item => {
              if (item.path === path) {
                item.children = children || []; // eslint-disable-line no-param-reassign
              }
              return item;
            }),
          });
        }
      });
    }
  }

  handleFetchResourceFiles = record => {
    this.setState({
      resourcePath: record.path,
      resourceName: record.name,
      pageFile: 1,
    }, () => {
      this.handleFetchResourceFilesReq();
    });
  }

  handleFetchResourceFilesReq = () => {
    const { fetchResourceTreeFile, taskType } = this.props;

    const { resourcePath } = this.state;

    const self = this;
    // type: 1.实时 2.视频 3.图片
    fetchResourceTreeFile({ type: taskType, path: resourcePath }).then(({ response }) => {
      if (response) {
        self.setState({
          resourceFiles: response,
          isShowArrow: response.length > 0 ? '' : 'none',
          searchText: '',
        });
      }
    });
  }

  handlePaginationClick = page => {
    this.setState({
      page,
    }, () => {
      this.handleFetchResources();
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
          disabled = selectedRows.concat(
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
      selectedRowKeys: selectedRowKeys.slice(0),
    });
  }

  handleAfterUpload = record => {
    const { selectedRowKeys, resourceFiles } = this.state;
    if (record) {
      const { name, path } = record;
      if (path && name) {
        if (!selectedRowKeys.includes(path)) {
          selectedRowKeys.push(path);
        }
        resourceFiles.unshift(record);
        this.setState({
          resourceFiles: resourceFiles.slice(0),
          selectedRowKeys: selectedRowKeys.slice(0),
        }, () => {
          this.handleAddData();
        });
      }
    }
  }

  handleOkClick = () => {
    const {
      submitTask, hideModal, taskType, intl,
    } = this.props;
    const {
      taskName,
      selectedCarRowKeys,
      selectedPersonRowKeys,
      selectedFiles,
      resourceName,
      frequency,
      carFeatures,
      personFeatures,
    } = this.state;

    if (selectedFiles.length === -1) {
      message.warn(taskType === TASK_TYPE.PIC ? '请选择需要添加任务的图片' : '请选择需要添加任务的视频');
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

    const datas = [];
    if (taskType === TASK_TYPE.PIC) {
      const obj = {
        resourceName,
        name: taskName,
        type: taskType,
        carFeatures: cars,
        personFeatures: persons,
        commonFeatures: commons,
        analysisList: selectedFiles.map(item => item.path),
        state: 1, // 默认为0不开启，创建任务后不开始执行，为1开始执行
      };
      datas.push(obj);
    } else {
      selectedFiles.forEach(item => {
        const obj = {
          resourceName,
          name: taskName,
          type: TASK_TYPE.VIDEO,
          carFeatures: cars,
          personFeatures: persons,
          commonFeatures: commons,
          analysisList: [item.path],
          frequency,
          state: 1, // 默认为0不开启，创建任务后不开始执行，为1开始执行
        };
        datas.push(obj);
      });
    }

    submitTask({ type: taskType, tasks: datas }).then(({ isOk }) => {
      if (isOk) {
        hideModal();
        message.success(intl.formatMessage({ id: 'App.message.add.success' }));
      }
    });
  }
  handleFilePaginationClick = page => {
    this.setState({
      pageFile: page,
    });
  }

  handleRefresh = () => {
    this.setState({
      searchValue: '',
      searchText: '',
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

  handleChangeFreRadio = e => {
    this.setState({
      radioVal: e.target.value,
    });
  }

  render() {
    const {
      hideModal,
      taskType,
      intl,
    } = this.props;
    const {
      selectedFiles,
      resourceMeta,
      selectedCarRowKeys,
      selectedPersonRowKeys,
      total,
      carFeatures,
      personFeatures,
      resources,
      isShowArrow,
      resourceFiles,
      selectedRowKeys,
      searchText,
      pageFile,
      searchValue,
      resourcePath,
      radioVal,
      frequency,
    } = this.state;
    return (
      <div className="app-task-pic-add">
        <div>
          <Row>
            <Col span={3}>
              <div className="lable">{intl.formatMessage({ id: 'App.RT.taskName' })}</div>
            </Col>
            <Col span={10} offset={1}>
              <div className="input">
                <Input onChange={this.handleChangeTaskName} placeholder={intl.formatMessage({ id: 'App.RT.rule.taskName' })} />
              </div>
            </Col>
            <Col span={10}>
              <div>
                <span className="lable">{intl.formatMessage({ id: 'App.RT.add.structural' })}</span>
                {total > 0 &&
                <span className="lable2" style={{ marginLeft: 20 }}>{intl.formatMessage({ id: 'App.RT.available' })}：{selectedCarRowKeys.length + selectedPersonRowKeys.length}/{total}</span>}
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col span={3}>
              <div className="lable">{taskType === TASK_TYPE.PIC ? intl.formatMessage({ id: 'App.picture.form.source' }) : intl.formatMessage({ id: 'App.video.form.source' })}</div>
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
                  datas={resources.map(element => ({ key: element.path, ...element }))}
                  tableHeight={150}
                  tableWidth={280}
                  hasPage
                  hasTree
                  hasCheckbox={false}
                  meta={resourceMeta}
                  onRowClick={this.handleFetchResourceFiles}
                  onPaginationChange={this.handlePaginationClick}
                  onExpandClick={this.handleExpandClick}
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
          <Row className="mb-8">
            <Col span={3}>
              <div className="lable">{taskType === TASK_TYPE.PIC ? intl.formatMessage({ id: 'App.public.upload.pic' }) : intl.formatMessage({ id: 'App.video.form.upload' })}</div>
            </Col>
            <Col span={6} offset={1}>
              <UploadFile
                url={`${API_URL}/file/upload`}
                accept={taskType === TASK_TYPE.PIC ? 'image/jpg,image/jpeg,image/png,image/bmp' : 'video/*'}
                disabled={resourcePath === ''}
                data={{ path: resourcePath, type: taskType }}
                removeIcon={false}
                name="file"
                showUploadList={{ showRemoveIcon: false }}
                afterUpload={this.handleAfterUpload}
              >
                <Button>
                  <Icon type="upload" /> {intl.formatMessage({ id: 'App.control.upload' })}
                </Button>
              </UploadFile>
            </Col>
          </Row>
          <Row className="mb-8">
            <Col span={3}>
              <div className="lable">{taskType === TASK_TYPE.PIC ? intl.formatMessage({ id: 'App.picture.form.select' }) : intl.formatMessage({ id: 'App.video.form.source' })}</div>
            </Col>
            <Col span={6} offset={1}>
              <Input.Search
                enterButton={intl.formatMessage({ id: 'App.control.search' })}
                onSearch={value => this.handleLocalSearch(value)}
                onChange={e => this.onSearchValueChangeHandler(e)}
                value={searchValue}
              />
            </Col>
            <Col span={2} className="ml-5">
              <Button className="ant-btn-warn" onClick={this.handleRefresh}>{intl.formatMessage({ id: 'App.video.form.fresh' })}</Button>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={4}>
              <div className="select-camera-table">
                <ListPagination
                  type={2}
                  page={pageFile}
                  datas={resourceFiles}
                  selectedRowKeys={selectedRowKeys}
                  onSelectChange={this.handleRowSelect}
                  searchText={searchText}
                  onPaginationChange={this.handleFilePaginationClick}
                />
              </div>
            </Col>
            <Col span={2}>
              <div style={{ marginLeft: 21, marginTop: 50, display: isShowArrow }}>
                <div>
                  <Button
                    size="small"
                    type="primary"
                    onClick={this.handleAddData}
                  >
                    <span>{'>'}</span>
                  </Button>
                </div>
                <div style={{ marginTop: 15 }}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={this.handleClearData}
                  >
                    <span>{'<'}</span>
                  </Button>
                </div>
              </div>
            </Col>
            <Col span={10}>
              <div style={{ marginTop: -30 }}>
                <div>
                  <span className="lable2">{taskType === TASK_TYPE.PIC ? intl.formatMessage({ id: 'App.picture.form.selected' }) : intl.formatMessage({ id: 'App.video.form.selected' })}:{selectedFiles.length}</span>
                  <span className="fr selected-camera-clear">
                    <Icon type="delete" />
                    <button onClick={this.handleClearData} className="selected-camera-tablelink">{intl.formatMessage({ id: 'App.control.clearAll' })}</button>
                  </span>
                </div>
                <div className="selected-camera">
                  <ResourceSelectFileTable
                    datas={selectedFiles}
                    tableHeight={186}
                    tableWidth={280}
                    removeData={this.handleRemoveData}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {taskType === TASK_TYPE.VIDEO &&
        <div>
          <Row>
            <Col span={3}>
              <div className="lable">分析频率</div>
            </Col>
            <Col span={3} offset={1}>
              <Select className="w-full" defaultValue={frequency} onChange={val => this.handleFreValue(-1, val)}>
                <Select.Option value={1}>1秒/帧</Select.Option>
                <Select.Option value={5}>5秒/帧</Select.Option>
                <Select.Option value={10}>10秒/帧</Select.Option>
                <Select.Option value={30}>30秒/帧</Select.Option>
                <Select.Option value={60}>60秒/帧</Select.Option>
              </Select>
            </Col>
            <Col span={3} className="lh-32 ml-15">
              <Radio.Group onChange={this.handleChangeFreRadio} value={radioVal}>
                <Radio value={1}>自定义</Radio>
              </Radio.Group>
            </Col>
            <Col span={3} className="ml-5 ml-r-36">
              <InputNumber min={1} onChange={val => this.handleFreValue(1, val)} />
            </Col>
            <Col span={1}>
              <div className="lh-32">秒/帧</div>
            </Col>
            <Col span={9} offset={1}>说明：单位“秒/帧”表示系统多长时间对视频
                进行一次截帧处理并进行结构化分析
            </Col>
          </Row>
        </div>
        }
        <div className="window-content__footer buttons-group text-center">
          <Button onClick={hideModal}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            disabled={selectedFiles.length === 0}
            onClick={this.handleOkClick}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default TaskVideoAdd;
