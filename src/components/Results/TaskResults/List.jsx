import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { List, Modal } from 'antd';
import { injectIntl } from 'react-intl';

import TaskResultsCard from '../../../shared/containers/TaskResultsCard';

class TaskResultsList extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    taskresults: object.isRequired,
    meta: object.isRequired,
    // selectedKeys: array.isRequired,
    onPaginationChange: func.isRequired,
    onDelete: func.isRequired,
    onCardClick: func.isRequired,
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

  render() {
    const {
      intl: { formatMessage },
      taskresults,
      meta,
      onPaginationChange,
      onDelete,
      onCardClick,
    } = this.props;

    const dataSource = [...taskresults.keys()]
      .slice(0, meta.pageSize)
      .map(id => ({
        key: id,
        ...taskresults.get(id),
      }));

    const { previewVisible, previewImage } = this.state;

    return (
      <div>
        <div>
          <List
            bordered={false}
            className="taskresults-list"
            grid={{ gutter: 20, column: 4 }}
            dataSource={dataSource}
            pagination={{
              ...meta,
              onChange: onPaginationChange,
            }}
            renderItem={item => (
              <List.Item className="taskresults-list__item">
                <TaskResultsCard
                  taskresult={item}
                  onImgClick={this.handleImgClick}
                  onDelete={onDelete}
                  onCardClick={onCardClick}
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

export default injectIntl(TaskResultsList);
