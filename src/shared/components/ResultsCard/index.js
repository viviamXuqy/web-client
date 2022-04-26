import React from 'react';
import { object, func, bool } from 'prop-types';
import { Avatar, Radio, Button, Icon, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';

import moment from 'moment';
import Cookies from 'js-cookie';

import { BASE64_IMG_JPEG } from '../../../constants/config';
import { decodeUnicode, compressImage } from '../../../utils';

import './index.less';

const _isMountedObjArr = [];

class ResultsCard extends React.Component {
  static propTypes = {
    isResultList: bool.isRequired, // 是否是识别结果列表
    result: object.isRequired,
    fetchResult: func.isRequired,
    getImg: func.isRequired,
    onDelete: func,
    onSelect: func,
    showResultDetail: func,
    isSelected: bool,
  }

  static defaultProps = {
    onDelete: () => {},
    onSelect: () => {},
    showResultDetail: () => {},
    isSelected: false,
  }

  state = {
    imgUrl: '',
    resultId: '',
    imgLoading: true, // 图像的loading
  }

  componentDidMount() {
    if (this.props.result && _isMountedObjArr[this.props.result.id]) {
      this.handleImgShow();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.result && nextProps.result.id !== prevState.resultId) {
      _isMountedObjArr[nextProps.result.id] = true;
      return {
        imgLoading: true,
        imgUrl: '',
        resultId: nextProps.result.id,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.result && _isMountedObjArr[this.props.result.id]) {
      this.handleImgShow();
    }
  }

  componentWillUnmount() {
    const { result } = this.props;
    _isMountedObjArr[result.id] = false;
  }

  handleImgShow = () => {
    const { id: resultId } = this.props.result;
    const self = this;

    const { getImg, result } = this.props;
    if (result.image) {
      compressImage(result.image, 693, resultId).then(({ src, data }) => {
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
    const {
      result, showResultDetail, fetchResult, onDelete, onSelect,
    } = this.props;

    if (event && event.target.name === 'resultDel') {
      onDelete([result.id]);
    } else if (event && event.target.name === 'resultSelect') {
      onSelect(result.id);
    } else {
      fetchResult(result.id)
        .then(({ response }) => {
          if (response) {
            showResultDetail({
              ...response,
            });
          }
        });
    }
  }

  render() {
    const { result, isResultList, isSelected } = this.props;
    const { imgUrl, imgLoading } = this.state;
    const user = JSON.parse(Cookies.get('user'));
    const element = (
      <div className="results-card-div">
        <Spin spinning={imgLoading}>
          <Avatar
            className="results-card__lazyload"
            shape="square"
            size="large"
            src={imgUrl}
            onClick={() => this.handleImgClick()}
          />
        </Spin>
        <div className="results-card-content">
          <div className="divhand" onMouseDown={event => this.handleMouseDown(event)}>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.results.resultId" />: </span>
              <span className="results-card-label-content">{result.id && result.id.length > 13 ? `${result.id.slice(0, 13)}...` : result.id}</span>
            </p>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.results.taskId" />: </span>
              <span className="results-card-label-content">{result.taskId && result.taskId.length > 13 ? `${result.taskId.slice(0, 13)}...` : result.taskId}</span>
            </p>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.public.time" />: </span>
              <span className="results-card-label-content">{result.time ? moment(Number(result.time)).format('YYYY-MM-DD HH:mm:ss') : <FormattedMessage id="App.public.no" />}</span>
            </p>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.public.type" />: </span>
              <span className="results-card-label-content">{decodeUnicode(result.targetType)}</span>
            </p>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.results.taskType" />: </span>
              <span className="results-card-label-content"><FormattedMessage id={`App.results.${result.taskType}`} /></span>
            </p>
          </div>
        </div>
      </div>
    );

    const elementResult = (
      <div
        className={isSelected ? 'results-card-div-border' : 'results-card-div'}
      >
        <Spin spinning={imgLoading}>
          <Avatar
            className="results-card__lazyload"
            shape="square"
            size="large"
            src={imgUrl}
            onClick={() => this.handleImgClick()}
          />
        </Spin>
        <div
          className="results-card-content"
        >
          <div className="divhand" onMouseDown={event => this.handleMouseDown(event)}>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.results.resultId" />: </span>
              <span className="results-card-label-content">{result.id && result.id.length > 21 ? `${result.id.slice(0, 21)}...` : result.id}</span>
            </p>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.results.taskId" />: </span>
              <span className="results-card-label-content">{result.taskId && result.taskId.length > 21 ? `${result.taskId.slice(0, 21)}...` : result.taskId}</span>
            </p>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.public.time" />: </span>
              <span className="results-card-label-content">{result.time ? moment(Number(result.time)).format('YYYY-MM-DD HH:mm:ss') : <FormattedMessage id="App.public.no" />}</span>
            </p>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.public.type" />: </span>
              <span className="results-card-label-content">{decodeUnicode(result.targetType)}</span>
            </p>
            <p>
              <span className="results-card-label"><FormattedMessage id="App.results.taskType" />: </span>
              <span className="results-card-label-content"><FormattedMessage id={`App.results.${result.taskType}`} /></span>
              <span className="results-card-content__btnGroups">
                <Button
                  name="resultDel"
                  size="small"
                  type="dashed"
                  disabled={user.grade === '3'}
                >
                  <Icon className="large-icon" type="delete" />
                </Button>
                <Radio name="resultSelect" checked={isSelected} />
              </span>
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {!isResultList && element}
        {isResultList && elementResult}
      </div>
    );
  }
}

export default ResultsCard;
