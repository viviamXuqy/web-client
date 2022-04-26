import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { message, Button, Select, Radio, Row, Col } from 'antd';
import Cicon from '../../../shared/components/Cicon';
import classNames from 'classnames';
import ImageCut from '../../../shared/containers/ImageCut';
import './index.less';

class ViolationAdd extends PureComponent {
  static propTypes = {
    addVehicleTask: func.isRequired,
    fetchActiveTask: func.isRequired,
    hideModal: func.isRequired,
    intl: object.isRequired,
  }

  static defaultProps = {
  }


  constructor(props) {
    super(props);
    this.state = {
      list: [],
      maxTime: [10, 30, 60, 90, 120], // 违停时间设置
      areas: [1, 2, 3], // 违停区域设置
      activeTaskValue: '', // 基础任务值
      addBtnEnable: true, // 添加区域按钮置灰
    };
  }
  componentDidMount() {
    const { fetchActiveTask } = this.props;
    fetchActiveTask().then(result => {
      this.setState({ list: result.response });
    });
  }
  onRef = ref => {
    this.child = ref;
  }
  setCallback=() => {
    this.setState({ addBtnEnable: true });
  }
  handleSubmit=() => {
    const { addVehicleTask, intl, hideModal } = this.props;
    const { checkedId } = this.state;
    if (checkedId) {
      addVehicleTask({ originalTaskId: checkedId }).then(({ response }) => {
        if (response) {
          message.success(intl.formatMessage({ id: 'App.message.add.success' }));
          hideModal();
        }
      });
    } else {
      this.setState({ error: true });
    }
  }

  handleChange=(name, value) => {
    const nextState = {};
    nextState[name] = value;
    this.setState({ ...nextState });
  }

  // 添加区域
  handleSetArea=() => {
    const { areas } = this.state;
    this.setState({ areas: [...areas, areas.length + 1], addBtnEnable: false });
    this.child.imgCutDraw();
  }

  render() {
    const {
      hideModal, intl,
    } = this.props;
    let {
      list, maxTime, areas,
    } = this.state;
    const { activeTaskValue, addBtnEnable } = this.state;
    const { error } = this.state;
    list = list.length && list.map(item => (
      <Select.Option
        value={item.originalTaskId}
        key={item.originalTaskId}
      >{item.originalTaskName}
      </Select.Option>));
    maxTime = maxTime.length && maxTime.map(item => (
      <Select.Option
        value={item}
        key={item}
      >{item}秒
      </Select.Option>));
    areas = areas.length && areas.map((item, index) => (
      <Radio className="area-item" value={index + 1}>
        <span>违停区域{index + 1}</span>
        <div className="btns">
          <button className="tablelink">
          重置
          </button>
          <button className="tablelink">
          删除
          </button>
        </div>
      </Radio>));
    return (
      <div className="violation-add-modal save-panel">
        <Row>
          <Col span={3}>
            <div className="label">任务类型</div>
          </Col>
          <Col span={21}>
            <Radio.Group onChange={this.onChange} value={this.state.value}>
              <Radio value={1}>城市道路违停</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <div className="label">基础任务</div>
          </Col>
          <Col span={21}>
            <Select defaultValue="选择运行中的任务" className={classNames('select', error && 'error')} onChange={value => this.handleChange(activeTaskValue, value)}>
              {list}
            </Select>
            <Button type="primary" className="ml-8" icon="">
              <Cicon type="addcamera" />新建基础任务
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <div className="label">任务设置:</div>
          </Col>
          <Col span={21} >
            <div className="label">城市道路违停</div>
          </Col>
        </Row>
        <Row>
          <Col span={15}>
            <ImageCut id="23232" onRef={this.onRef} setCallback={this.setCallback} />
          </Col>
          <Col span={9} className="pl-15">
            <div className="area-panel">
              <Radio.Group value={this.state.value} className="w-full">
                {areas}
              </Radio.Group>
            </div>
            <div className="btn-panel">
              <Button type="primary" onClick={this.handleSetArea} disabled={!addBtnEnable}><Cicon type="addcamera" />添加区域</Button>
              <Button type="primary ml-10">重置所有</Button>
              <Button type="primary ml-10">保存</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={3} ><div className="label">违停时间</div></Col>
          <Col span={5}>
            <Select className="w-full" placeholder="请选择违停时间">
              {maxTime}
            </Select>
          </Col>
          <Col>
            <Button type="primary">设置</Button>
          </Col>
        </Row>

        <div className="window-content__footer buttons-group text-center">
          <Button onClick={hideModal}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            onClick={this.handleSubmit}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default ViolationAdd;
