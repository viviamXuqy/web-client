import React, { PureComponent } from 'react';
import { object, array, number, func } from 'prop-types';
import { List } from 'antd';
import { injectIntl } from 'react-intl';
import { Scrollbars } from 'react-custom-scrollbars';

import moment from 'moment';

import MonitorCard from '../../../shared/components/MonitorCard';

class MonitorList extends PureComponent {
  static propTypes = {
    type: number.isRequired,
    monitors: array.isRequired,
    intl: object.isRequired,
    onShowMonitorDetail: func.isRequired,
  }

  state = {
    vehicleShowKeys: ['type', 'plate', 'brand', 'carcolor', 'originalTaskName'],
    personShowKeys: ['type', 'sex', 'age', 'originalTaskName'],
  }

  renderThumb = () => {
    const thumbStyle = {
      backgroundColor: '#00D8FF',
      borderRadius: 19,
      width: 5,
    };
    return (
      <div
        style={{ ...thumbStyle }}
      />
    );
  }

  render() {
    const {
      type, monitors, intl, onShowMonitorDetail,
    } = this.props;
    const { personShowKeys, vehicleShowKeys } = this.state;
    const showKeys = type === 1 ? personShowKeys : vehicleShowKeys;
    const dataSource = monitors.map(m => ({
      ...m,
      attri: Object.keys(m.attri).filter(fKey =>
        (showKeys.includes(fKey))).map(key => {
        const classNameVal = key === 'type' ? 'textColorWhite f-bold' : 'textColorWhite';
        return {
          classNameVal,
          name: `${intl.formatMessage({ id: `App.public.struct.${key}` })}: `,
          value: m.attri[key],
        };
      }).concat([{
        classNameVal: 'textColorWhite',
        name: `${intl.formatMessage({ id: 'App.public.struct.time' })}: `,
        value: moment(m.time).format('YYYY/MM/DD hh:mm'),
      }]),
    }));

    return (
      <Scrollbars
        style={{ width: 'calc(100% - 7)', height: 750 }}
        renderThumbVertical={this.renderThumb}
      >
        <div className="monitor__list">
          <List
            itemLayout="horizontal"
            dataSource={dataSource}
            renderItem={item => (
              <List.Item>
                <MonitorCard
                  onShowMonitorDetail={onShowMonitorDetail}
                  monitor={item}
                />
              </List.Item>
            )}
          />
        </div>
      </Scrollbars>
    );
  }
}

export default injectIntl(MonitorList);
