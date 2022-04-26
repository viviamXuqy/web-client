import React, { PureComponent } from 'react';
import { array, object, func } from 'prop-types';
import { Button, Table, Icon } from 'antd';
import { injectIntl } from 'react-intl';

import moment from 'moment';
import { TASK_TYPE } from '../../../constants/config';

class LogTable extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    logs: object.isRequired,
    replace: func.isRequired,
    selectedRowKeys: array.isRequired,
    onSelectChange: func.isRequired,
    onPaginationChange: func.isRequired,
    deleteLogs: func.isRequired,
  }

  handleGoView = record => {
    const { replace } = this.props;
    const { funType, recordId, taskType } = record;

    switch (funType) {
      case 1: // 设备
        replace({ pathname: '/cameras/ipc', state: { recordId } });
        break;
      case 2: {
        let pathname = '';
        if (taskType === TASK_TYPE.ANALYSIS) {
          pathname = '/tasks/analysis';
        } else if (taskType === TASK_TYPE.VIDEO) {
          pathname = '/tasks/video';
        } else if (taskType === TASK_TYPE.PIC) {
          pathname = '/tasks/pic';
        }
        replace({ pathname, state: { recordId } });
        break;
      }
      case 3: // 系统
        replace('/system/setting');
        break;
      default:
        break;
    }
  }

  render() {
    const {
      intl: { formatMessage },
      logs,
      meta,
      selectedRowKeys,
      onSelectChange,
      onPaginationChange,
      deleteLogs,
    } = this.props;

    const columns = [
      {
        title: formatMessage({ id: 'App.public.time' }),
        dataIndex: 'time',
        key: 'time',
        className: 'nowrap',
        render: (text, record) => (
          <div>
            <div>{moment(Number(record.time)).format('YYYY/MM/DD')}</div>
            <div>{moment(Number(record.time)).format('HH:mm:ss')}</div>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'App.system.log.funType' }),
        dataIndex: 'funType',
        key: 'funType',
        render: funType => (
          <span>{formatMessage({ id: `App.system.log.funType${funType}` })}</span>
        ),
      },
      {
        title: formatMessage({ id: 'App.system.log.doType' }),
        dataIndex: 'doType',
        key: 'doType',
        render: doType => (
          <span>{formatMessage({ id: `App.system.log.doType${doType}` })}</span>
        ),
      },
      {
        title: formatMessage({ id: 'App.control.content' }),
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: formatMessage({ id: 'App.control.view' }),
        key: 'view',
        className: 'nowrap',
        render: (text, record) => (
          <div className="app-table__actions buttons-group">
            <button onClick={() => this.handleGoView(record)} className="tablelink">{formatMessage({ id: 'App.control.view' })}</button>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'App.control.delete' }),
        dataIndex: 'id',
        key: 'delete',
        render: id => (
          <div className="app-table__actions buttons-group button-delete">
            <Button
              size="small"
              type="dashed"
              onClick={() => deleteLogs([id])}
            >
              <Icon type="delete" />
            </Button>
          </div>
        ),
      },
    ];

    const dataSource = [...logs.keys()]
      .slice(0, meta.pageSize)
      .map(id => ({
        key: id,
        ...logs.get(id),
      }));

    return (
      <div>
        <Table
          className="app-table"
          columns={columns}
          dataSource={dataSource}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={{
            ...meta,
            onChange: onPaginationChange,
          }}
        />
      </div>
    );
  }
}

export default injectIntl(LogTable);
