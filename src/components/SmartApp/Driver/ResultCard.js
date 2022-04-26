import React from 'react';
import { object, func, bool } from 'prop-types';
import { Avatar, Radio, Button, Icon, Spin, Modal } from 'antd';

import Cookies from 'js-cookie';
import VehicleDetail from '../../../shared/components/VehicleDetail';

import { BASE64_IMG_JPEG } from '../../../constants/config';
import classNames from 'classnames';
import './index.less';

const _isMountedObjArr = [];

class ResultsCard extends React.Component {
  static propTypes = {
    result: object.isRequired,
    getImg: func.isRequired,
    onDelete: func,
    onSelect: func,
    isSelected: bool,
    getResult: func.isRequired,
    intl: object.isRequired,
  }

  static defaultProps = {
    onDelete: () => {},
    onSelect: () => {},
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
    if (nextProps.result.id !== prevState.resultId) {
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
      self.setState({
        imgUrl: result.image,
        imgLoading: false,
      });
      _isMountedObjArr[resultId] = false;
    } else {
      getImg(resultId, 2, 10).then(({ response }) => {
        if (response) {
          if (_isMountedObjArr[response.id]) {
            self.setState({
              imgLoading: false,
              imgUrl: BASE64_IMG_JPEG + response.image,
            });
            _isMountedObjArr[response.id] = false;
          }
        }
      });
    }
  }

  handleImgClick = () => {
    const {
      result, getResult,
    } = this.props;
    getResult(result.id)
      .then(({ response }) => {
        if (response) {
          this.setState({ modalDetailVisible: true, detailData: response });
        }
      });
  }

  handleDelete=() => {
    const {
      result, onDelete,
    } = this.props;
    onDelete([result.id]);
  }

  hideModal=() => {
    this.setState({ modalDetailVisible: false });
  }

  handleChecked=() => {
    const {
      result, onSelect,
    } = this.props;
    onSelect(result.id);
  }

  render() {
    const { result, isSelected, intl } = this.props;
    const { imgUrl, imgLoading, detailData } = this.state;
    const user = JSON.parse(Cookies.get('user'));

    return (
      <div
        className={classNames(isSelected ? 'results-card-div-border' : 'results-card-div', 'pointer')}
      >
        <Spin spinning={imgLoading}>
          <Avatar
            shape="square"
            size="large"
            src={imgUrl}
            onClick={() => this.handleImgClick()}
          />
        </Spin>
        <div
          className="results-card-content"
        >
          <div>
            <p>
              <span className="results-card-label">车牌号: </span>
              <span className="results-card-label-content">{result.plate}</span>
            </p>
            <p>
              <span className="results-card-label">车辆型号: </span>
              <span className="results-card-label-content">{result.type}</span>
            </p>
            <p>
              <span className="results-card-label">车辆颜色: </span>
              <span className="results-card-label-content">{result.color}</span>
            </p>
            <p>
              <span className="results-card-label">驾驶人数量: </span>
              <span className="results-card-label-content">{result.count}</span>
            </p>
            <p>
              <span className="results-card-label">源任务ID: </span>
              <span className="results-card-label-content">{result.originTaskId}</span>
              <span className="results-card-content__btnGroups">
                <Button
                  name="resultDel"
                  size="small"
                  type="dashed"
                  disabled={user.grade === '3'}
                  onClick={this.handleDelete}
                >
                  <Icon className="large-icon" type="delete" />
                </Button>
                <Radio name="resultSelect" checked={isSelected} onClick={this.handleChecked} />
              </span>
            </p>
          </div>
        </div>
        {this.state.modalDetailVisible &&
          <Modal
            width={860}
            title="检测详情"
            visible={this.state.modalDetailVisible}
            footer={null}
            onCancel={() => this.hideModal()}
          >
            <VehicleDetail
              hideModal={() => this.hideModal()}
              intl={intl}
              data={detailData}
            />
          </Modal>}
      </div>
    );
  }
}

export default ResultsCard;
