import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Row, Col, Button, message, InputNumber, Select, Radio } from 'antd';

import moment from 'moment';

import MiniTable from '../../../shared/components/MiniTable';
import TaskTime from '../../../shared/components/TaskTime';
import './index.less';


class TaskSet extends PureComponent {
  static propTypes = {
    task: object.isRequired,
    setTask: func.isRequired, // 设置任务
    fetchFeatures: func.isRequired, // 结构化数据列表
    hideModal: func.isRequired,
    intl: object.isRequired,
  }

  constructor(props) {
    super(props);
    const { task } = this.props;
    const timeType = task.duration.length > 0 ? Number(task.duration[0].toString().split(',')[0].toString()) : 1;
    const duration = [];
    // 非持续状态
    if (timeType !== 1) {
      task.duration.forEach((durItem, index) => {
        const item = durItem.toString().split(',');

        const type = Number(item[0] || 1);
        const startTime = Number(item[1] || 0);
        const endTime = Number(item[2] || 0);
        const date = moment(moment(startTime).format('YYYY-MM-DD')).valueOf();

        const obj = {
          key: index + 1,
          type: type || 1,
          date: type === 3 ? date : 0,
          sTime: type === 3 ? (startTime - date) : startTime,
          eTime: type === 3 ? (endTime - date) : endTime,
          startTime,
          endTime,
        };
        duration.push(obj);
      });
    }
    this.state = {
      carFeatures: [], // 车辆结构化列表
      personFeatures: [], // 人体结构化列表
      total: 0,
      selectedPersonRowKeys: task.personFeatures, // 选中的人体结构化
      selectedCarRowKeys: task.carFeatures, // 选中的车辆结构化
      duration, // 时间组{type: 1, startTime: xxx, endTime: xxx, sTime, eTime, date}
      timeType, // 默认永续
      frequency: task.frequency,
      radioVal: [1, 5, 10, 30, 60].includes(task.frequency) ? -1 : 1,
    };
  }

  componentDidMount() {
    const { duration } = this.state;
    this.handleFetchFeatures();

    if (duration.length <= 0) this.handleAddTime(1); // 默认添加一个时间
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
      await this.setState({
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

    const {
      selectedCarRowKeys, selectedPersonRowKeys, carFeatures, personFeatures,
    } = this.state;

    this.handleFunSelect(
      selectedCarRowKeys,
      carFeatures.filter(c => selectedCarRowKeys.includes(c.id)),
      [],
      carFeatures,
      selectedPersonRowKeys,
      personFeatures,
    );

    this.handleFunSelect(
      selectedPersonRowKeys,
      personFeatures.filter(c => selectedPersonRowKeys.includes(c.id)),
      [],
      personFeatures,
      selectedCarRowKeys,
      carFeatures,
    );
  }

  // handleServerDuration = duration => {
  //   duration.forEach(element => {
  //     const item = element.toString().split(',');
  //     const type = item[0] || 1;
  //     const startTime = item[1] || 0;
  //     const endTime = item[2] || 0;
  //   });
  // }

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

  handleCarRowSelectChange = (selectedRowKeys, selectedRows) => {
    const {
      selectedCarRowKeys, selectedPersonRowKeys, carFeatures, personFeatures, total,
    } = this.state;

    let selectedRowKeysTemp = selectedRowKeys;
    if (total > 0 && (selectedRowKeysTemp.length + selectedPersonRowKeys.length) > total) {
      message.warn(this.props.intl.formatMessage({ id: 'App.RT.struct.rule.max' }));
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
      message.warn(this.props.intl.formatMessage({ id: 'App.RT.struct.rule.max' }));
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

  handleOkClick = () => {
    const {
      setTask, hideModal, task, intl,
    } = this.props;
    const {
      timeType,
      selectedCarRowKeys,
      selectedPersonRowKeys,
      duration,
      frequency,
      carFeatures,
      personFeatures,
    } = this.state;

    const cars = selectedCarRowKeys.filter(id => +carFeatures.find(cs => cs.id === id).model === 2);
    const persons = selectedPersonRowKeys.filter(id =>
      +personFeatures.find(ps => ps.id === id).model === 2);
    const commons = selectedCarRowKeys.concat(selectedPersonRowKeys)
      .filter(id => carFeatures.concat(personFeatures).find(c => c.id === id).model === 1);

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
    }
    duration.splice(0, duration.length);

    const obj = {
      duration: durationTemp,
      carFeatures: cars,
      personFeatures: persons,
      commonFeatures: commons,
      status: task.status,
      frequency,
    };

    setTask(task.id, obj).then(({ isOk }) => {
      if (isOk) {
        hideModal();
        message.success(intl.formatMessage({ id: 'App.message.save.success' }));
      }
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
      hideModal, intl,
    } = this.props;
    const {
      selectedCarRowKeys,
      selectedPersonRowKeys,
      total,
      carFeatures,
      personFeatures,
      duration,
      radioVal,
      frequency,
    } = this.state;

    return (
      <div className="app-task-set">
        <div className="select-camera">
          <Row>
            <Col span={3}>
              <div className="lable" />
            </Col>
            <Col span={6} offset={18}>
              {total > 0 &&
              <div className="lable2 ml-20">{intl.formatMessage({ id: 'App.RT.available' })}：{selectedCarRowKeys.length + selectedPersonRowKeys.length}/{total}</div>}
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col span={3}>
              <div className="lable" >{intl.formatMessage({ id: 'App.RT.taskSetting.structural' })}</div>
            </Col>
            <Col span={8} offset={1}>
              <div className="select-camera-table">
                <span className="lable2">{intl.formatMessage({ id: 'App.public.struct.carFun' })}</span>
                <div className="feature">
                  <MiniTable
                    datas={carFeatures.map(element => ({ key: element.id, ...element }))}
                    tableHeight={192}
                    tableWidth={280}
                    hasPage={false}
                    hasTree={false}
                    hasCheckbox
                    selectedRowKeys={selectedCarRowKeys}
                    onSelectChange={this.handleCarRowSelectChange}
                  />
                </div>
              </div>
            </Col>
            <Col span={2} offset={1} />
            <Col span={8}>
              <div className="selected-camera">
                <span className="lable2">{intl.formatMessage({ id: 'App.public.struct.personFun' })}</span>
                <div className="feature">
                  <MiniTable
                    datas={personFeatures.map(element => ({ key: element.id, ...element }))}
                    tableHeight={192}
                    tableWidth={280}
                    hasPage={false}
                    hasTree={false}
                    hasCheckbox
                    selectedRowKeys={selectedPersonRowKeys}
                    onSelectChange={this.handlePersonRowSelectChange}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Row className="mt-30">
          <Col span={3}>
            <div className="lable">{intl.formatMessage({ id: 'App.RT.add.frequency' })}</div>
          </Col>
          <Col span={3} offset={1}>
            <Select className="w-full" defaultValue={radioVal === -1 ? frequency : 1} onChange={val => this.handleFreValue(-1, val)}>
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
            <InputNumber min={1} onChange={val => this.handleFreValue(1, val)} defaultValue={radioVal === 1 ? frequency : ''} />
          </Col>
          <Col span={1}>
            <div className="lh-32">{intl.formatMessage({ id: 'App.RT.add.frequency.unit' })}</div>
          </Col>
          <Col span={9} offset={1}>{intl.formatMessage({ id: 'App.RT.add.frequency.note' })}
          </Col>
        </Row>
        <div className="mt-36">
          <Row>
            <Col span={3}>
              <div className="lable">{intl.formatMessage({ id: 'App.RT.add.setTime' })} </div>
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
            onClick={this.handleOkClick}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default TaskSet;
