import React, { PureComponent } from 'react';
import { func, number, array } from 'prop-types';
import { Table, Icon } from 'antd';

import './index.less';

class MiniSelectDataTable extends PureComponent {
  static propTypes = {
    datas: array.isRequired,
    tableWidth: number.isRequired, // 宽度
    tableHeight: number.isRequired, // 高度
    removeData: func.isRequired, // 移除
  }

  render() {
    const {
      datas,
      tableWidth,
      tableHeight,
      removeData,
    } = this.props;

    const columns = [
      {
        title: '',
        dataIndex: 'name',
        key: 'name',
        width: tableWidth,
      },
      {
        title: '',
        dataIndex: 'id',
        render: id => (
          <div className="">
            <Icon
              style={{ cursor: 'pointer' }}
              type="delete"
              onClick={() => removeData(id)}
            />
          </div>
        ),
      },
    ];

    let dataSource = [];
    if (undefined !== datas && datas.length !== 0) {
      dataSource = datas
        .map(element => ({
          key: element.id,
          ...element,
        })).reverse();
    }

    return (
      <div className="app-mini-select-data-table">
        <Table
          locale={{ emptyText: '' }}
          pagination={false}
          size="small"
          showHeader={false}
          scroll={{ y: tableHeight }}
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    );
  }
}

export default MiniSelectDataTable;
