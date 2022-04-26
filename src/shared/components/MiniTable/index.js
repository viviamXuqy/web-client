import React, { PureComponent } from 'react';
import { object, func, number, array, bool } from 'prop-types';
import { Table, Tooltip } from 'antd';

import './index.less';

const Item = props => {
  const { record } = props;
  let el;

  if (record.tip) {
    el = <Tooltip title={record.title} ><span>{record.name}</span></Tooltip>;
  } else {
    el = <span>{record.name}</span>;
  }

  const element = <span disabled={record.disabled}>{el}</span>;

  return element;
};

class MiniTable extends PureComponent {
  static propTypes = {
    datas: array.isRequired,
    tableWidth: number.isRequired, // 宽度
    tableHeight: number.isRequired, // 高度
    hasPage: bool.isRequired,
    hasTree: bool.isRequired,
    hasCheckbox: bool.isRequired,
    meta: object,
    selectedRowKeys: array, // 多选的时候的keys
    onPaginationChange: func,
    onSelectChange: func, // 多选的时候的func
    onSelect: func, // 多选时用户手动选择/取消选择某列的回调
    onRowClick: func,
    onExpandClick: func,
    disableCheckbox: bool,
  }

  static defaultProps = {
    meta: {},
    selectedRowKeys: [],
    onRowClick: () => {},
    onPaginationChange: () => {},
    onSelectChange: () => {},
    onExpandClick: () => {},
    onSelect: () => {},
    disableCheckbox: false,
  }

  state = {
    rowKey: -1, // 选中的 row
    selectedRows: [],
  }

  handlePaginationChange = page => {
    const { onPaginationChange } = this.props;
    this.setState({
      rowKey: -1,
    }, () => {
      onPaginationChange(page);
    });
  }

  handleRowClick = record => {
    if (this.props.disableCheckbox) {
      return;
    }
    const {
      onRowClick, hasTree, hasCheckbox,
    } = this.props;
    if (hasTree) {
      const { path } = record;
      if (!path) return;
    }
    if (hasCheckbox && !record.disabled) {
      this.handleSelectChange(record);
    } else {
      const { rowKey } = this.state;
      if (rowKey === record.key) return;
      this.setState({
        rowKey: record.key,
      }, () => {
        onRowClick(record);
      });
    }
  }

  handleSelectChange = async record => {
    const { id } = record;
    const { selectedRowKeys, onSelectChange } = this.props;
    const { selectedRows } = this.state;
    const ids = [...selectedRowKeys];
    if (!ids.find(idTemp => idTemp === id)) {
      ids.push(id);
      selectedRows.push(record);
    } else {
      ids.splice(ids.findIndex(v => id === v), 1);
      selectedRows.splice(selectedRows.findIndex(v => id === v.id));
    }

    await this.setState({
      selectedRows: selectedRows.slice(0),
    });

    onSelectChange(ids, this.state.selectedRows);
  }

  render() {
    const {
      datas,
      tableWidth,
      tableHeight,
      meta,
      hasPage,
      onExpandClick,
      selectedRowKeys,
      onSelectChange,
      onSelect,
      hasCheckbox,
      disableCheckbox,
      className,
    } = this.props;

    const { rowKey } = this.state;

    const columns = [
      {
        title: '',
        dataIndex: 'name',
        key: 'name',
        width: tableWidth,
        render: (name, record) => (
          <Item record={record} />
        ),
      },
    ];

    return (
      <div className="app-mini-table">
        <Table
          locale={{ emptyText: '' }}
          pagination={
            hasPage ?
            {
              ...meta,
              simple: true,
              onChange: this.handlePaginationChange,
            }
            : false
          }
          size="small"
          showHeader={false}
          scroll={{ y: tableHeight }}
          columns={columns}
          dataSource={datas}
          rowClassName={
            !hasCheckbox ?
            record => (record.key === rowKey ? 'rowHighClassName app-table__avatar' : 'app-table__avatar')
            : 'app-table__avatar'
          }
          onRow={record => ({
            onClick: () => this.handleRowClick(record), // 点击行
          })}
          onExpand={(expanded, record) => onExpandClick(expanded, record)}
          rowSelection={
            hasCheckbox ?
            {
              selectedRowKeys,
              onChange: onSelectChange,
              onSelect,
              getCheckboxProps: record => ({
                disabled: !!record.disabled || disableCheckbox,
              }),
            }
            : undefined
          }
          className={className}
        />
      </div>
    );
  }
}

export default MiniTable;
