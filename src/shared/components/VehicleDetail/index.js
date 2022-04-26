import React, { PureComponent } from 'react';
import { object } from 'prop-types';
import { Row, Col } from 'antd';
import './index.less';

class VehicleDetail extends PureComponent {
  static propTypes = {
    data: object.isRequired,
  }

  static defaultProps = {
  }


  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

  }

  render() {
    const {
      data,
    } = this.props;
    let list = data.driver;
    list = list.length && list.map((item, index) => (
      <li>
        <div className="table-cell w-80"><img width="100%" src={item.image} alt="" /></div>
        <div className="table-cell pl-15">
          <p className="header mb-5">驾驶人{index + 1}</p>
          <p className="title fs-12">捕捉时间</p>
          <p className="text mb-5 fs-12">{item.catchTime}</p>
          <p className="title fs-12">源任务ID</p>
          <p className="text fs-12">{item.originTaskId}</p>
        </div>
      </li>));
    return (
      <div className="vehicle-detail">
        <Row>
          <Col span="14" className="pr-15">
            <div className="car-panel">
              <div className="vehicle-photo">
                <img src={data.image} alt="" />
              </div>
              <p className="title mb-5">车牌号：<span className="text">{data.plate}</span></p>
              <p className="title mb-5">车辆型号：<span className="text">{data.type}</span></p>
              <p className="title mb-5">车辆颜色：<span className="text">{data.color}</span></p>
              <p className="title mb-5">驾驶人数量：<span className="text">{data.count}</span></p>
            </div>
          </Col>
          <Col span="10">
            <ul className="driver-list">
              {list}
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}

export default VehicleDetail;
