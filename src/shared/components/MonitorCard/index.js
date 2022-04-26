import React from 'react';
import { object, func } from 'prop-types';
import { Avatar, List, Row, Col } from 'antd';

import { BASE64_IMG_JPEG } from '../../../constants/config';

import './index.less';

function MonitorShow(props) {
  const { classNameVal = '', name = '', value } = props;
  if (!value) return '';
  const element = (
    <span className="monitor-card__item_span">
      <span className="fl">{name}</span>
      <span className={`${classNameVal} fr`}>{value}</span>
    </span>
  );
  return (
    element
  );
}

class MonitorCard extends React.PureComponent {
  static propTypes = {
    monitor: object.isRequired,
    onShowMonitorDetail: func.isRequired,
  }

  handleImgClick = () => {
    this.handleMouseDown();
  }

  handleMouseDown = () => {
    const { monitor, onShowMonitorDetail } = this.props;
    onShowMonitorDetail(monitor.key);
  }

  render() {
    const { monitor } = this.props;

    return (
      <div className="monitor-card pointer" onMouseDown={() => this.handleMouseDown()}>
        <Row>
          <Col span={8}>
            <Avatar
              className="monitor-card___img"
              shape="square"
              size="large"
              src={`${BASE64_IMG_JPEG}${monitor.image}`}
            />
          </Col>
          <Col span={14} offset={2}>
            <List
              dataSource={monitor.attri}
              renderItem={item => (
                <List.Item className="monitor-card-list-item">
                  <MonitorShow
                    classNameVal={item.classNameVal}
                    name={item.name}
                    value={item.value}
                  />
                </List.Item>
                )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MonitorCard;
