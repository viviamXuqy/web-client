import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Row, Col, Button, Form, Select } from 'antd';
import { injectIntl } from 'react-intl';

import ImageSearchUploader from '../../../shared/components/ImageSearchUploader';

import { API_URL } from '../../../constants/config';
import { PERSON_FEATURE, JACKET_FEATURE, BOTTOMS_FEATURE, TRANSLATE_TARGET } from '../../../constants/stats';

import { decodeUnicode } from '../../../utils';

import './index.less';

class ResultSearch extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    onSearch: func.isRequired,
    hideModal: func.isRequired,
    form: object.isRequired,
    fetchCameraTask: func.isRequired,
  }

  state = {
    featureDetails: [],
    cameraList: [], // 摄像机列表
    camera: [], // 选中的摄像机
    areaId: 0, // 选中的区域id
    target: {}, // 选中区域的特征值
    areaMax: 1, // 最多可勾选1个区域
  }

  componentDidMount() {
    const { fetchCameraTask } = this.props;
    fetchCameraTask().then(({ response }) => {
      if (response) {
        this.setState({ cameraList: response });
      }
    });
  }

  handleSearch = () => {
    const { getFieldValue, getFieldsValue } = this.props.form;
    const { onSearch, hideModal } = this.props;
    let { target } = this.state;
    const {
      featureDetails,
      camera,
    } = this.state;
    let struct = [];
    if (featureDetails.length) { // 上传图片搜索
      const fs = target.features;
      struct = Object.values(fs).map(element => decodeUnicode(element));

      target = Object.keys(fs).map((item, index) => {
        let tg = featureDetails[target.id][item];

        if (tg) {
          const value = getFieldValue(item);
          if (value) {
            tg = value;
          }
          if (tg === 'all') {
            delete struct[index];
            return null;
          }
          return decodeUnicode(tg);
        }
        return null;
      }).filter(t => t);
      struct = struct.filter(t => t);
    } else { // 直接搜索
      let fileds = getFieldsValue();
      fileds = Object.entries(fileds);
      fileds = fileds.filter(item => item[1] !== 'all');
      target = [];
      for (let i = 0; i < fileds.length; i++) {
        struct.push(fileds[i][0]);
        target.push(fileds[i][1]);
      }
    }

    target = target && target.map(item => TRANSLATE_TARGET[item]);

    onSearch({ struct: struct.join(','), target: target.join(','), camera: camera.join(',') });
    hideModal();
  }

  handleTarget = id => {
    const { featureDetails } = this.state;
    this.setState({ target: featureDetails[id] });
  }

  handleUpdateResData = featureDetails => {
    const { areaId } = this.state;
    this.setState({ target: featureDetails[areaId], featureDetails });
  }

  handleChange=value => {
    const { camera } = this.state;
    this.setState({ camera: Object.assign(camera, value) });
  }

  render() {
    const { hideModal, intl, form } = this.props;
    const {
      areaId,
      target,
      areaMax,
    } = this.state;

    const { getFieldDecorator } = form;
    const cameraList = this.state.cameraList.map(item =>
      <Select.Option key={item}>{item}</Select.Option>);

    const { locale } = intl;
    const personFeatures = PERSON_FEATURE(locale).map(item => {
      let value = target && target[item.key];
      value = value ? decodeUnicode(value) : 'all';
      const { key } = item;
      return (
        <Col span={8} key={key}>
          <Form.Item label={item.name}>
            {getFieldDecorator(`${key}`, { initialValue: value })(
              <Select key={key} >
                {item.value.map(o => (
                  <Select.Option key={o.value} value={o.value}>{o.name}</Select.Option>))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      );
    });
    const jacketFeatures = JACKET_FEATURE(locale).map(item => {
      let value = target && target[item.key];
      value = value ? decodeUnicode(value) : 'all';
      const { key } = item;
      return (
        <Col span={8} key={key}>
          <Form.Item label={item.name}>
            {getFieldDecorator(`${key}`, { initialValue: value })(
              <Select key={key}>
                {item.value.map(o => (
                  <Select.Option key={o.value} value={o.value}>{o.name}</Select.Option>
                        ))}
              </Select>,
              )}
          </Form.Item>
        </Col>
      );
    });
    const bottomsFeatures = BOTTOMS_FEATURE(locale).map(item => {
      let value = target && target[item.key];
      value = value ? decodeUnicode(value) : 'all';
      const { key } = item;
      return (
        <Col span={8} key={key}>
          <Form.Item label={item.name}>
            {getFieldDecorator(`${key}`, { initialValue: value })(
              <Select key={key}>
                {item.value.map(o => (
                  <Select.Option key={o.value} value={o.value}>{o.name}</Select.Option>
                        ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      );
    });


    return (
      <div className="result-search-modal">
        <div>
          <Row>
            <Col span={11}>
              <div className="relative">
                <ImageSearchUploader
                  url={`${API_URL}/file/struct`}
                  onUpdateResData={this.handleUpdateResData}
                  onTarget={this.handleTarget}
                  btnType="primary"
                  defaultChecked={areaId}
                  areaMax={areaMax}
                />
                <span className="notice">{intl.formatMessage({ id: 'App.person.struct.note' })}</span>
              </div>
              <div className="mt-135">
                <h2 className="cameras-title">{intl.formatMessage({ id: 'App.person.struct.cameras' })}</h2>
                <Select
                  mode="multiple"
                  placeholder={intl.formatMessage({ id: 'App.person.struct.cameras.placeholder' })}
                  onChange={this.handleChange}
                  className="w-500"
                >
                  {cameraList}
                </Select>
              </div>
            </Col>
            <Col span={13} className="pl-15">
              <h3>{intl.formatMessage({ id: 'App.person.struct.title4' })}</h3>
              <div className="feature">
                <Form>
                  <h4 className="feature-title">{intl.formatMessage({ id: 'App.person.struct.title1' })}</h4>
                  <Row gutter={24}>
                    {personFeatures}
                  </Row>
                  <h4 className="feature-title">{intl.formatMessage({ id: 'App.person.struct.title2' })}</h4>
                  <Row gutter={24}>
                    {jacketFeatures}
                  </Row>
                  <h4 className="feature-title">{intl.formatMessage({ id: 'App.person.struct.title3' })}</h4>
                  <Row gutter={24}>
                    {bottomsFeatures}
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
        <div className="window-contentF buttons-group text-center mt-15">
          <Button onClick={hideModal}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            onClick={this.handleSearch}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default Form.create()(injectIntl(ResultSearch));
