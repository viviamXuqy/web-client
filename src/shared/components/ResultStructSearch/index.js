import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Row, Col, Button } from 'antd';
import { injectIntl } from 'react-intl';

import MiniTable from '../../../shared/components/MiniTable';

import './index.css';

class ResultStructSearch extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    onSearch: func.isRequired,
    fetchFeatures: func.isRequired, // 结构化数据列表
    hideModal: func.isRequired,
  }

  state = {
    carFeatures: [], // 车辆结构化列表
    personFeatures: [], // 人体结构化列表
    selectedCarRowKeys: [], // 选中的车辆结构化
    selectedPersonRowKeys: [], // 选中的人体结构化
  }

  componentDidMount() {
    this.handleFetchFeatures();
  }

  handleFetchFeatures = async () => {
    const { fetchFeatures } = this.props;

    const { response } = await fetchFeatures();

    if (response) {
      this.setState({ ...response });
    }
  }

  handleSearch = () => {
    const { onSearch, hideModal } = this.props;
    const {
      carFeatures,
      personFeatures,
      selectedCarRowKeys,
      selectedPersonRowKeys,
    } = this.state;

    const cars = carFeatures.filter(item => selectedCarRowKeys.some(id => id === item.id));
    const persons = personFeatures.filter(item => selectedPersonRowKeys.some(id => id === item.id));

    const struct = cars.map(item => item.name).concat(persons.map(item => item.name)).join(',');

    onSearch({ struct });
    hideModal();
  }

  handleCarRowSelect = selectedRowKeys => {
    this.setState({
      selectedCarRowKeys: selectedRowKeys,
    });
  }

  handlePersonRowSelect = selectedRowKeys => {
    this.setState({
      selectedPersonRowKeys: selectedRowKeys,
    });
  }

  render() {
    const { hideModal, intl: { formatMessage } } = this.props;
    const {
      selectedCarRowKeys,
      selectedPersonRowKeys,
      carFeatures,
      personFeatures,
    } = this.state;

    return (
      <div className="app-result-struct-search">
        <div>
          <div style={{ marginBottom: 10 }}>
            <span className="lable">{formatMessage({ id: 'App.results.struct.search' })}</span>
          </div>
          <Row>
            <Col span={12}>
              <span className="lable2">{formatMessage({ id: 'App.public.struct.carFun' })}</span>
              <div className="feature">
                <MiniTable
                  datas={carFeatures.map(element => ({ key: element.id, ...element }))}
                  tableHeight={170}
                  tableWidth={120}
                  hasPage={false}
                  hasTree={false}
                  hasCheckbox
                  selectedRowKeys={selectedCarRowKeys}
                  onSelectChange={this.handleCarRowSelect}
                />
              </div>
            </Col>
            <Col span={12}>
              <span className="lable2">{formatMessage({ id: 'App.public.struct.personFun' })}</span>
              <div className="feature">
                <MiniTable
                  datas={personFeatures.map(element => ({ key: element.id, ...element }))}
                  tableHeight={170}
                  tableWidth={120}
                  hasPage={false}
                  hasTree={false}
                  hasCheckbox
                  selectedRowKeys={selectedPersonRowKeys}
                  onSelectChange={this.handlePersonRowSelect}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="window-content__footer buttons-group text-center">
          <Button onClick={hideModal}>{formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            disabled={selectedCarRowKeys.length === 0 && selectedPersonRowKeys.length === 0}
            onClick={this.handleSearch}
          >
            {formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(ResultStructSearch);
