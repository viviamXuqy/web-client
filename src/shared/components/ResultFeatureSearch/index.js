import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Row, Col, Button } from 'antd';
import { injectIntl } from 'react-intl';

import MiniTable from '../../../shared/components/MiniTable';
import ImageSearchUploader from '../../../shared/components/ImageSearchUploader';

import { API_URL } from '../../../constants/config';

import { decodeUnicode, findKey } from '../../../utils';

import './index.css';

class ResultFeatureSearch extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    onSearch: func.isRequired,
    hideModal: func.isRequired,
  }

  state = {
    features: [], // 结构化列表
    selectedRowKeys: [], // 选中的车辆结构化
    featureDetails: [],
    selectedTargetKeys: [],
  }

  componentDidMount() {
  }

  handleSearch = () => {
    const { onSearch, hideModal } = this.props;
    const {
      features,
      selectedRowKeys,
      featureDetails,
      selectedTargetKeys,
    } = this.state;

    const struct = features.filter(element => selectedRowKeys.some(id => id === element))
      .map(element => decodeUnicode(element)).join(',');

    const target = [];
    selectedTargetKeys.forEach(id => {
      const item = featureDetails.find(f => f.id === id);
      if (item) {
        const t = [];
        Object.values(item.features).filter(k => selectedRowKeys.includes(k))
          .forEach(k => {
            const key = findKey(item.features, k);
            if (key && item[key]) {
              t.push(decodeUnicode(item[key]));
            }
          });
        if (t.length > 0) {
          target.push(t.join(','));
        }
      }
    });

    onSearch({ struct, target: target.join('|') });
    hideModal();
  }

  handleTarget = id => {
    const { selectedTargetKeys, selectedRowKeys } = this.state;
    let flag = false;
    if (selectedTargetKeys.includes(id)) {
      flag = true;
      selectedTargetKeys.splice(selectedTargetKeys.findIndex(i => i === id), 1);
    } else {
      selectedTargetKeys.push(id);
    }

    const { featureDetails } = this.state;
    const featuresTemp = [];
    featureDetails.forEach(element => {
      if (selectedTargetKeys.includes(element.id)) {
        featuresTemp.push(...Object.values(element.features));
      }
    });

    const fs = [...new Set(featuresTemp)];
    const item = featureDetails.find(f => f.id === id);
    if (item) {
      if (flag) {
        Object.values(item.features).filter(k => !fs.includes(k))
          .forEach(k => {
            if (selectedRowKeys.includes(k)) {
              selectedRowKeys.splice(selectedRowKeys.findIndex(i => i === k), 1);
            }
          });
      } else {
        Object.values(item.features).filter(k => fs.includes(k))
          .forEach(k => {
            if (!selectedRowKeys.includes(k)) selectedRowKeys.push(k);
          });
      }
    }


    this.setState({
      features: fs,
      selectedRowKeys: selectedRowKeys.slice(0),
      selectedTargetKeys: selectedTargetKeys.slice(0),
    });
  }

  handleRowSelect = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  }

  handleUpdateResData = featureDetails => {
    const selectedTargetKeysTemp = [];
    const featuresTemp = [];
    featureDetails.forEach(element => {
      selectedTargetKeysTemp.push(element.id);
      featuresTemp.push(...Object.values(element.features));
    });

    const fs = [...new Set(featuresTemp)];
    this.setState({
      features: fs,
      selectedRowKeys: [...fs],
      featureDetails: featureDetails.slice(0),
      selectedTargetKeys: selectedTargetKeysTemp,
    });
  }

  render() {
    const { hideModal, intl: { formatMessage } } = this.props;
    const {
      selectedRowKeys,
      features,
    } = this.state;

    return (
      <div className="app-result-feature-search">
        <div>
          <div style={{ marginBottom: 10 }}>
            <span className="lable">{formatMessage({ id: 'App.results.struct.img.msg' })}</span>
          </div>
          <Row>
            <Col span={15}>
              <span className="lable2">{formatMessage({ id: 'App.public.upload.pic' })}</span>
              <div className="feature">
                <ImageSearchUploader
                  url={`${API_URL}/file/struct`}
                  onUpdateResData={this.handleUpdateResData}
                  onTarget={this.handleTarget}
                />
              </div>
            </Col>
            <Col span={9}>
              <span className="lable2">{formatMessage({ id: 'App.results.struct.img.select' })}  ({selectedRowKeys.length}/{features.length})</span>
              <div className="feature">
                <MiniTable
                  datas={features.map(element =>
                    ({ key: element, name: decodeUnicode(element), id: element }))}
                  tableHeight={260}
                  tableWidth={280}
                  hasPage={false}
                  hasTree={false}
                  hasCheckbox
                  selectedRowKeys={selectedRowKeys}
                  onSelectChange={this.handleRowSelect}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="window-contentF buttons-group text-center">
          <Button onClick={hideModal}>{formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={this.handleSearch}
          >
            {formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(ResultFeatureSearch);
