import React, { PureComponent } from 'react';
import { object, func, array } from 'prop-types';
import { List } from 'antd';

import ResultsCard from '../../shared/containers/ResultsCard';

class ResultsList extends PureComponent {
  static propTypes = {
    results: object.isRequired,
    meta: object.isRequired,
    selectedKeys: array.isRequired,
    onPaginationChange: func.isRequired,
    onDelete: func.isRequired,
    onSelect: func.isRequired,
    showResultDetail: func.isRequired,
  }

  isSelected = id => {
    const { selectedKeys } = this.props;
    return selectedKeys.indexOf(id) !== -1;
  }

  render() {
    const {
      results,
      meta,
      onPaginationChange,
      onDelete,
      onSelect,
      showResultDetail,
    } = this.props;

    const dataSource = [...results.keys()]
      .slice(0, meta.pageSize)
      .map(id => ({
        key: id,
        ...results.get(id),
      }));

    return (
      <div>
        <List
          bordered={false}
          className="results-list"
          grid={{ gutter: 20, column: 4 }}
          dataSource={dataSource}
          pagination={{
            ...meta,
            onChange: onPaginationChange,
          }}
          renderItem={item => (
            <List.Item className="results-list__item">
              <ResultsCard
                result={item}
                isResultList
                isSelected={this.isSelected(item.id)}
                onDelete={onDelete}
                onSelect={onSelect}
                showResultDetail={showResultDetail}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default ResultsList;
