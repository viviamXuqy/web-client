import React, { PureComponent } from 'react';
import { array, object, func } from 'prop-types';
import { Button, Table, Icon } from 'antd';
import { injectIntl } from 'react-intl';
import Cookies from 'js-cookie';

class NvrTable extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    nvrs: object.isRequired,
    selectedRowKeys: array.isRequired,
    onSelectChange: func.isRequired,
    onPaginationChange: func.isRequired,
    deleteNvrs: func.isRequired,
    onEdit: func.isRequired,
  }

  render() {
    const {
      intl: { formatMessage },
      nvrs,
      meta,
      selectedRowKeys,
      onSelectChange,
      onPaginationChange,
      deleteNvrs,
      onEdit,
    } = this.props;
    const user = JSON.parse(Cookies.get('user'));
    const columns = [
      {
        title: formatMessage({ id: 'App.cameras.nvr.no' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: formatMessage({ id: 'App.cameras.nvr.name' }),
        dataIndex: 'nvrName',
        key: 'nvrName',
      },
      {
        title: formatMessage({ id: 'App.table.port' }),
        dataIndex: 'port',
        key: 'port',
      },
      {
        title: formatMessage({ id: 'App.cameras.nvr.ip' }),
        dataIndex: 'nvrIp',
        key: 'nvrIp',
      },
      {
        title: formatMessage({ id: 'App.cameras.nvr.capacity' }),
        key: 'useDiskSize',
        render: (text, record) => (
          <span>{record.useDiskSize}/{record.tatolDiskSize}</span>
        ),
      },
      {
        title: formatMessage({ id: 'App.cameras.nvr.set' }),
        key: 'set',
        render: (text, record) => (
          <div className="app-table__actions buttons-group">
            <button onClick={() => onEdit(text, record)} className="tablelink" disabled={user.grade === '3'} >{formatMessage({ id: 'App.control.set' })}</button>
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
              onClick={() => deleteNvrs([id])}
              disabled={user.grade === '3'}
            >
              <Icon type="delete" />
            </Button>
          </div>
        ),
      },
    ];

    const dataSource = [...nvrs.keys()]
      .slice(0, meta.pageSize)
      .map(id => ({
        key: id,
        ...nvrs.get(id),
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

export default injectIntl(NvrTable);
