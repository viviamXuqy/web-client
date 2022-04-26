import React from 'react';
import { object, func } from 'prop-types';
import { Avatar, List, Card, Button } from 'antd';

import { Scrollbars } from 'react-custom-scrollbars';

import moment from 'moment';

import { BASE64_IMG_JPEG } from '../../../constants/config';

import './index.less';

import MonitorShow from './MonitorShow';

class MonitorDetailCard extends React.PureComponent {
  static propTypes = {
    monitor: object.isRequired,
    close: func.isRequired,
    intl: object.isRequired,
  }

  renderThumb = () => {
    const thumbStyle = {
      backgroundColor: '#00D8FF',
      borderRadius: 19,
    };
    return (
      <div
        style={{ ...thumbStyle }}
      />
    );
  }

  render() {
    const {
      monitor, close, intl,
    } = this.props;

    const attri = Object.keys(monitor.attri).map(key => {
      const classNameVal = key === 'type' ? 'textColorWhite f-bold' : 'textColorWhite';
      return {
        classNameVal,
        name: `${intl.formatMessage({ id: `App.public.struct.${key}` })}: `,
        value: monitor.attri[key],
      };
    }).concat([{
      classNameVal: 'textColorWhite',
      name: `${intl.formatMessage({ id: 'App.public.struct.time' })}: `,
      value: moment(monitor.time).format('YYYY/MM/DD hh:mm'),
    }]);

    return (
      <div className="monitor-detail-card">
        <Card
          title={intl.formatMessage({ id: 'App.public.detailInfo' })}
          extra={<Button onClick={close} shape="circle" icon="close" theme="outlined" />}
        >
          <div>
            <Avatar
              className="monitor-detail-card___img"
              shape="square"
              size="large"
              src={`${BASE64_IMG_JPEG}${monitor.image}`}
            />
          </div>
          <Scrollbars
            className="monitor-detail___attri"
            renderThumbVertical={this.renderThumb}
          >
            <div>
              <List
                className="monitor-detail___attri__content"
                itemLayout="horizontal"
                dataSource={attri}
                renderItem={item => (
                  <List.Item>
                    <MonitorShow
                      classNameVal={item.classNameVal}
                      name={item.name}
                      value={item.value}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Scrollbars>
        </Card>
      </div>
    );
  }
}

export default MonitorDetailCard;
