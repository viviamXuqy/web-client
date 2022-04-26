import React from 'react';
import { object, func } from 'prop-types';
import { Avatar, Button, Icon, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';

import Cookies from 'js-cookie';
import moment from 'moment';

import { BASE64_IMG_JPEG } from '../../../constants/config';
import { compressImage } from '../../../utils';

import './index.less';

const _isMountedObjArr = [];

class TaskResultsCard extends React.PureComponent {
  static propTypes = {
    taskresult: object.isRequired,
    getImg: func.isRequired,
    onDelete: func.isRequired,
    onCardClick: func.isRequired,
  }

  state = {
    imgUrl: '',
    resultId: '',
    imgLoading: true, // 图像的loading
  }

  componentDidMount() {
    if (this.props.taskresult && _isMountedObjArr[this.props.taskresult.resultId]) {
      this.handleImgShow();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.taskresult && nextProps.taskresult.resultId !== prevState.resultId) {
      _isMountedObjArr[nextProps.taskresult.resultId] = true;
      return {
        imgLoading: true,
        imgUrl: '',
        resultId: nextProps.taskresult.resultId,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.taskresult && _isMountedObjArr[this.props.taskresult.resultId]) {
      this.handleImgShow();
    }
  }

  componentWillUnmount() {
    const { taskresult } = this.props;
    _isMountedObjArr[taskresult.resultId] = false;
  }

  handleImgShow = () => {
    const { taskresult } = this.props;
    const { resultId } = taskresult;

    const self = this;

    const { getImg } = this.props;

    if (taskresult.image) {
      compressImage(taskresult.image, 693, resultId).then(({ src, data }) => {
        if (_isMountedObjArr[data]) {
          _isMountedObjArr[data] = false;
          self.setState({
            imgUrl: src,
            imgLoading: false,
          });
        }
      });
    } else {
      getImg(resultId, 2, 10).then(({ response }) => {
        if (response) {
          if (_isMountedObjArr[response.id]) {
            _isMountedObjArr[response.id] = false;
            self.setState({
              imgLoading: false,
              imgUrl: BASE64_IMG_JPEG + response.image,
            });
          }
        }
      });
    }
  }

  handleImgClick = () => {
    this.handleMouseDown();
  }

  handleMouseDown = event => {
    const { taskresult, onCardClick, onDelete } = this.props;

    if (event && event.target.name === 'taskresultDel') {
      onDelete([taskresult.id]);
    } else {
      onCardClick(taskresult);
    }
  }

  render() {
    const { taskresult } = this.props;
    const { imgUrl, imgLoading } = this.state;
    const user = JSON.parse(Cookies.get('user'));
    const elementResult = (
      <div
        className="taskresults-card-div"
      >
        <Spin spinning={imgLoading}>
          <Avatar
            className="taskresults-card__lazyload"
            shape="square"
            size="large"
            src={imgUrl}
            onClick={() => this.handleImgClick()}
          />
        </Spin>
        <div
          className="taskresults-card-content"
        >
          <div className="divhand" onMouseDown={this.handleMouseDown}>
            <p>
              <span className="taskresults-card-label"><FormattedMessage id="App.results.taskId" />: </span>
              <span className="taskresults-card-label-content">{taskresult.id && taskresult.id.length > 21 ? `${taskresult.id.slice(0, 21)}...` : taskresult.id}</span>
            </p>
            <p>
              <span className="taskresults-card-label"><FormattedMessage id="App.results.taskName" />: </span>
              <span className="taskresults-card-label-content">{taskresult.name}</span>
            </p>
            <p>
              <span className="taskresults-card-label"><FormattedMessage id="App.results.resultNum" />: </span>
              <span className="taskresults-card-label-content">{taskresult.total}</span>
            </p>
            <p>
              <span className="taskresults-card-label"><FormattedMessage id="App.public.deadline" />: </span>
              <span className="taskresults-card-label-content">{taskresult.endTime ? moment(Number(taskresult.endTime)).format('YYYY-MM-DD HH:mm:ss') : <FormattedMessage id="App.public.no" />}</span>
            </p>
            <p>
              <span className="taskresults-card-label"><FormattedMessage id="App.results.taskType" />: </span>
              <span className="taskresults-card-label-content"><FormattedMessage id={`App.results.${taskresult.type}`} /></span>
              <span className="taskresults-card-content__btnGroups">
                <Button
                  name="taskresultDel"
                  size="small"
                  type="dashed"
                  disabled={user.grade === '3'}
                >
                  <Icon className="large-icon" type="delete" />
                </Button>
              </span>
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {elementResult}
      </div>
    );
  }
}

export default TaskResultsCard;
