import React, { PureComponent } from 'react';
import { Pagination, Checkbox } from 'antd';
import { array, func, number, string } from 'prop-types';
import classNames from 'classnames';
import './index.less';

// type: 1 是server端数据翻页； 2 是本地翻页
class ListPagination extends PureComponent {
  static propTypes = {
    type: number.isRequired, // eslint-disable-line react/no-unused-prop-types
    page: number.isRequired,
    datas: array.isRequired, // eslint-disable-line react/no-unused-prop-types
    selectedRowKeys: array.isRequired, // eslint-disable-line react/no-unused-prop-types
    defaultPageSize: number,
    total: number, // eslint-disable-line react/no-unused-prop-types
    onSelectChange: func.isRequired,
    onPaginationChange: func,
    searchText: string, // eslint-disable-line react/no-unused-prop-types
  }

  static defaultProps = {
    defaultPageSize: 5,
    total: 0,
    onPaginationChange: () => {},
    searchText: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // 选中项
      list: [],
      total: 0,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      datas,
      type,
      defaultPageSize,
      page,
      searchText,
      total,
      selectedRowKeys,
    } = nextProps;
    if (type === 1) {
      const list = datas.slice(0, defaultPageSize);
      return {
        list,
        total,
        selectedRowKeys,
      };
    } else if (type === 2) {
      const list = datas.filter(item =>
        item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
        .sort((l1, l2) => l1.name.split('.')[0] - l2.name.split('.')[0]);
      const startIndex = defaultPageSize * (page - 1);
      return {
        list: list.slice(startIndex, startIndex + defaultPageSize),
        total: list.length,
        selectedRowKeys,
      };
    }
    return null;
  }

  handlePageChange = page => {
    const { onPaginationChange } = this.props;
    onPaginationChange(page);
  }

  handleChecked = (id, e) => {
    const { selectedRowKeys } = this.state;
    const { onSelectChange } = this.props;
    if (e.target.checked) {
      selectedRowKeys.push(id);
    } else {
      selectedRowKeys.splice(selectedRowKeys.findIndex(v => id === v), 1);
    }
    this.setState({
      selectedRowKeys: selectedRowKeys.slice(0),
    }, () => {
      onSelectChange(selectedRowKeys);
    });
  }

  render() {
    const {
      page, defaultPageSize,
    } = this.props;
    let { list } = this.state;
    const { selectedRowKeys, total } = this.state;
    list = list && list.map(item => {
      const id = item.path || item.id;
      return (
        <li key={id} className={classNames(selectedRowKeys.includes(id) && 'selected')}>
          <Checkbox className="checkbox" checked={selectedRowKeys.includes(id)} onChange={e => this.handleChecked(id, e)}>{item.name}</Checkbox>
        </li>
      );
    });

    return (
      <div className="list-pagination">
        <ul className="list-box">
          {list}
        </ul>
        <Pagination
          style={{ display: list.length > 0 ? '' : 'none' }}
          simple
          current={page}
          total={total}
          onChange={this.handlePageChange}
          defaultPageSize={defaultPageSize}
          className="pagination"
        />
      </div>
    );
  }
}

export default ListPagination;
