import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Card, Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import ReviewPlateTaskImageCut from '../../../shared/containers/ReviewPlateTaskImageCut';
import TaskTable from './Table';
import './index.less';

class ReviewPlateTask extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    tasks: object.isRequired,
    getReviewPlateTasks: func.isRequired,
    updateFilter: func.isRequired,
    putReviewPlateTaskStart: func.isRequired,
  }

  static defaultProps = {
  }

  state = {
    page: 1,
    pageSize: 100,
    currTask: {},
    modalVisible: false,
  }

  componentDidMount() {
    this.handleGetReviewPlateTasks();
  }

  handleGetReviewPlateTasks = () => {
    const { getReviewPlateTasks } = this.props;
    const {
      page, pageSize,
    } = this.state;

    const filters = {
      page,
      pageSize,
    };

    this.updateFilter(filters);

    getReviewPlateTasks();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('reviewPlateTasks', values);
  }

  showModal = (text, record) => {
    this.setState({
      currTask: record,
      modalVisible: true,
    });
  }

  hideModal = modal => {
    const nextState = {};
    nextState[modal] = false;
    this.setState({ ...nextState });
  }

  handlePaginationClick = page => {
    this.setState({
      page,
    }, () => {
      this.handleGetReviewPlateTasks();
    });
  }

  render() {
    const { currTask } = this.state;
    const {
      intl, meta, tasks, putReviewPlateTaskStart,
    } = this.props;
    return (
      <React.Fragment >
        <div>
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">
              复审车牌任务列表
            </h1>
            <TaskTable
              meta={meta}
              tasks={tasks}
              onPaginationChange={this.handlePaginationClick}
              onShowReviewTaskImageSet={(text, record) => { this.showModal(text, record); }}
              onPutReviewPlateTaskStart={putReviewPlateTaskStart}
            />

          </Card>
        </div>
        {this.state.modalVisible &&
          <Modal
            width={483}
            title="设置"
            visible={this.state.modalVisible}
            onCancel={() => this.hideModal('modalVisible')}
            footer={<center><Button onClick={() => this.hideModal('modalVisible')}>{intl.formatMessage({ id: 'App.control.close' })}</Button></center>}
          >
            <ReviewPlateTaskImageCut
              currTask={currTask}
            />
          </Modal>}
      </React.Fragment>
    );
  }
}

export default (injectIntl(ReviewPlateTask));
