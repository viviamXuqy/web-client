/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Table, Modal } from 'antd';
import { injectIntl } from 'react-intl';

import { BASE64_IMG_JPEG } from '../../../constants/config';

class ReviewPlateResult extends PureComponent {
  static propTypes = {
    meta: object.isRequired,
    results: object.isRequired,
    onPaginationChange: func.isRequired,
    onShowResultDetail: func.isRequired,
  }

  static defaultProps = {
  }

  state = {
    previewVisible: false,
    previewImage: null,
  }

  componentDidMount() {
  }

  handleShowPlateImage = img => {
    if (img) {
      this.setState({
        previewVisible: true,
        previewImage: BASE64_IMG_JPEG + img,
      });
    }
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  }

  render() {
    const { previewVisible, previewImage } = this.state;
    const {
      results,
      meta,
      onPaginationChange,
      onShowResultDetail,
    } = this.props;
    const columns = [
      {
        title: '结果编号',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '任务名',
        dataIndex: 'taskName',
        key: 'taskName',
      }, {
        title: '时间',
        dataIndex: 'plateCheckedTime',
        key: 'plateCheckedTime',
      }, {
        title: '车牌号码',
        dataIndex: 'plate',
        key: 'plate',
        render: (plate, record) => (
          <span>{record.result ? plate.plateNo : '车牌'}</span>
        ),
      }, {
        title: '车牌图片',
        dataIndex: 'plateImage',
        key: 'plateImage',
        render: image => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img alt="" className="photo" src={BASE64_IMG_JPEG + image} onClick={() => this.handleShowPlateImage(image)} />
        ),
      }, {
        title: '查看详情',
        dataIndex: 'id',
        key: 'detail',
        render: (id, record) => (
          <div className="app-table__actions buttons-group">
            <button onClick={() => onShowResultDetail(record)} className="tablelink">查看详情</button>
          </div>
        ),
      },
    ];
    const dataSource = Object.keys(results).length ? [...Object.values(results)]
      .map(item => ({
        key: item.id,
        ...item,
      })) : [];

    return (
      <div>
        <Table
          className="app-table"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            ...meta,
            onChange: onPaginationChange,
          }}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default injectIntl(ReviewPlateResult);
