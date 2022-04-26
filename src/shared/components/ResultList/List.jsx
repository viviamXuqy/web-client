import React, { PureComponent } from 'react';
import { object, func, array } from 'prop-types';
import { List, Modal } from 'antd';
import { injectIntl } from 'react-intl';

import ResultsCard from '../../../shared/containers/ResultsCard';

class ResultsList extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    results: object.isRequired,
    meta: object.isRequired,
    selectedKeys: array.isRequired,
    onPaginationChange: func.isRequired,
    onDelete: func.isRequired,
    onSelect: func.isRequired,
    showResultDetail: func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleImgClick = this.handleImgClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  state = {
    previewVisible: false,
    previewImage: null,
  }

  handleImgClick = img => {
    if (img) {
      this.setState({
        previewVisible: true,
        previewImage: img,
      });
    }
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  }

  isSelected = id => {
    const { selectedKeys } = this.props;
    return selectedKeys.indexOf(id) !== -1;
  }

  render() {
    const {
      intl: { formatMessage },
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

    const { previewVisible, previewImage } = this.state;

    return (
      <div>
        <div>
          <List
            bordered={false}
            className="results-list2"
            grid={{ gutter: 20, column: 4 }}
            dataSource={dataSource}
            pagination={{
              ...meta,
              onChange: onPaginationChange,
            }}
            renderItem={item => (
              <List.Item className="results-list2__item">
                <ResultsCard
                  result={item}
                  isResultList
                  isSelected={this.isSelected(item.id)}
                  onImgClick={this.handleImgClick}
                  handleCancel={this.handleCancel}
                  onDelete={onDelete}
                  onSelect={onSelect}
                  showResultDetail={showResultDetail}
                />
              </List.Item>
            )}
          />
        </div>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt={formatMessage({ id: 'App.control.previewAvatar' })} style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default injectIntl(ResultsList);
