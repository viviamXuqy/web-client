import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Card, Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import ResultDetail from '../../../shared/containers/ResultDetail';
import Filter from './Filter';
import ResultTable from './Table';

import './index.less';

class ReviewPlateResult extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    filter: object.isRequired,
    results: object.isRequired,
    getReviewPlateResults: func.isRequired,
    getReviewPlateTaskStatistics: func.isRequired,
    updateFilter: func.isRequired,
    location: object.isRequired,
  }

  static defaultProps = {
  }

  state = {
    page: 1,
    pageSize: 200,
    plateNo: '', // 关键字
    taskId: '',
    currResult: '', // 当前操作的结果
    modalVisible: false, // 详细信息界面
    statistics: {
      vehicleNums: 0,
      identifiedNums: 0,
      unidentifiedNums: 0,
    },
  }

  componentDidMount() {
    this.setState({ taskId: this.props.location.state.taskId });
    this.handleGetReviewPlateResults(this.props.location.state.taskId);
    this.handleGetReviewPlateTaskStatistics(this.props.location.state.taskId);
  }

  handleGetReviewPlateTaskStatistics = async id => {
    const { getReviewPlateTaskStatistics } = this.props;
    const { response } = await getReviewPlateTaskStatistics(id);
    if (response) {
      this.setState({
        statistics: { ...response },
      });
    }
  }

  handleGetReviewPlateResults = taskId => {
    const { getReviewPlateResults } = this.props;
    const {
      page, pageSize, plateNo,
    } = this.state;

    const filters = {
      plateNo,
      page,
      pageSize,
    };

    this.updateFilter(filters);

    getReviewPlateResults({ taskId });
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('reviewPlateResults', values);
  }

  handleSearch = values => {
    const options = {
      plateNo: '',
      page: 1,
      ...values,
    };
    this.setState({
      ...options,
    }, () => {
      this.handleGetReviewPlateResults(this.state.taskId);
    });
  }

  handlePaginationClick = page => {
    this.setState({
      page,
    }, () => {
      this.handleGetReviewPlateResults(this.state.taskId);
    });
  }

  showModal = record => {
    this.setState({
      currResult: { ...record, image: record.webImage },
      modalVisible: true,
    });
  }

  hideModal = () => {
    this.setState({
      modalVisible: false,
    });
  }

  render() {
    const {
      meta, results, intl: { formatMessage }, filter,
    } = this.props;
    const { currResult, statistics } = this.state;
    return (
      <React.Fragment >
        <div className="reviewPlateResult">
          <Card
            bordered={false}
            className="app-card"
          >
            <h1 className="app-page__title">
              复审车牌任务识别结果列表
            </h1>
            <div className="btnList">
              <Link to={{ pathname: '/smartapp/reviewplate/tasks' }}>
                <Button type="primary">
                  查看列表
                </Button>
              </Link>
              <div className="statistics">
                <span>总识别车辆：{statistics.vehicleNums}</span>
                <span>有车牌数：{statistics.identifiedNums}</span>
                <span>无车牌数：{statistics.unidentifiedNums}</span>
              </div>
            </div>
            <Filter
              filter={filter}
              onSearch={this.handleSearch}
            />
            <ResultTable
              meta={meta}
              results={results}
              onPaginationChange={this.handlePaginationClick}
              onShowResultDetail={this.showModal}
            />

          </Card>
          {this.state.modalVisible &&
            <Modal
              width={790}
              title={formatMessage({ id: 'App.results.resultDetail' })}
              visible={this.state.modalVisible}
              onCancel={this.hideModal}
              footer={null}
            >
              <ResultDetail
                currResult={currResult}
              />
            </Modal>}
        </div>
      </React.Fragment>
    );
  }
}

export default (injectIntl(ReviewPlateResult));
