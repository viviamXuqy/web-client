import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Modal, Button, message, Spin } from 'antd';
import { injectIntl } from 'react-intl';

import * as canvasDraw from '../../../utils/canvas.draw';
import { getImgNaturalDimensions } from '../../../utils';

import { BASE64_IMG_JPEG } from '../../../constants/config';

import './index.less';

class ReviewPlateTaskImageCut extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    currTask: object.isRequired,
    getReviewPlatePreviewImage: func.isRequired,
    putReviewPlateArea: func.isRequired,
    getReviewPlateTasks: func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.img = React.createRef();
    this.hint = React.createRef();

    this.state = {
      imgLoading: true,
      setAreaState: 0, // 显示按钮方式：0是未设置，1是正在设置，2是已设置
      imgUrl: '',
      pointArr: [],
      ctx: null,
      sizeW: 0, // 图片width
      sizeH: 0, // 图片height
      ratio: '', // 图片分辨率
      imgLoadedFlag: false, // 图片是否成功加载
      isShowHint: false,
    };
  }

  async componentDidMount() {
    const self = this;

    const { getReviewPlatePreviewImage, currTask } = this.props;
    const { response } = await getReviewPlatePreviewImage(currTask.id, 20);
    if (response) {
      self.setState({
        imgUrl: BASE64_IMG_JPEG + response,
      });
    }
  }

  componentWillUnmount() {
    this.canvas.current.onmousemove = null;
    this.canvas.current.onmouseout = null;
    this.canvas.current.onmousedown = null;
    const { ctx } = this.state;
    if (ctx != null) {
      ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    }
  }

  setCanvas = () => {
    this.setState({
      sizeW: this.img.current.width,
      sizeH: this.img.current.height,
      ratio: `${this.img.current.width}x${this.img.current.height}`,
    }, () => {
      this.canvas.current.setAttribute('width', this.img.current.width);
      this.canvas.current.setAttribute('height', this.img.current.height);
      this.resetArea();
    });
  }

  setArea = () => {
    this.canvas.current.onmousemove = ev2 => {
      const p2 = canvasDraw.getCanvasPos(ev2, this.canvas.current);

      this.showHint(p2);
    };

    this.canvas.current.onmousedown = ev => {
      const p = canvasDraw.getCanvasPos(ev, this.canvas.current);
      this.drawMouseDown(p);
    };

    this.canvas.current.onmouseout = () => {
      this.setState({
        isShowHint: false,
      });
    };
  }

  drawMouseDown = p => {
    const { pointArr, ctx } = this.state;
    const _self = this;
    if (canvasDraw.checkDraw(p, pointArr)) {
      canvasDraw.clickDrawPoint(ctx, p, pointArr);
      const pObj = {
        x: p.x.toFixed(2),
        y: p.y.toFixed(2),
      };
      pointArr.push(pObj);

      if (canvasDraw.checkCrossForList(pointArr)) {
        Modal.warning({
          title: this.props.intl.formatMessage({ id: 'App.ipc.analytics.rule.error' }),
          content: '',
          onOk() {
            _self.clickBackDraw();
          },
        });
      }
    }
  }

  clickBackDraw = () => {
    const { pointArr, ctx } = this.state;
    const pObj = pointArr.pop();
    canvasDraw.backDraw(ctx, pObj, pointArr);
  }

  imgCutDrawBack = () => {
    this.clickBackDraw();
  }

  imgCutDrawCancel = () => {
    this.resetDatas();
    this.setState({
      setAreaState: 0,
    });
  }

  imgCutDrawOk = () => {
    const {
      currTask, putReviewPlateArea, getReviewPlateTasks, intl,
    } = this.props;
    const { pointArr, ratio, ctx } = this.state;
    if (pointArr.length < 3) {
      Modal.warning({
        title: intl.formatMessage({ id: 'App.ipc.analytics.rule.min' }),
        content: '',
      });
      return;
    }

    if (canvasDraw.checkCrossForList2(pointArr)) {
      Modal.error({
        title: intl.formatMessage({ id: 'App.ipc.analytics.clear' }),
        content: '',
        onOk() {
          // canvasDraw.drawPointAndLine(ctx, pointArr, false);
        },
      });
      return;
    }

    const area = [];
    pointArr.forEach(p => area.push(`${p.x},${p.y}`));

    const options = { area, ratio };
    const self = this;
    putReviewPlateArea(currTask.id, options).then(({ isOk }) => {
      if (isOk) {
        canvasDraw.drawPointAndLine(ctx, pointArr, null);
        getReviewPlateTasks();
        message.success(intl.formatMessage({ id: 'App.ipc.analytics.success' }));

        self.setState({
          setAreaState: 2,
          isShowHint: false,
        });

        self.canvas.current.onmousemove = null;
        self.canvas.current.onmouseout = null;
        self.canvas.current.onmousedown = null;
      }
    });
  }

  imgLoaded = async () => {
    await getImgNaturalDimensions(this.img.current);
    await this.setState({
      imgLoadedFlag: true,
      imgLoading: false,
      ctx: this.canvas.current.getContext('2d'),
      // ratioOld: `${w}x${h}`,
    });
    this.setCanvas();
  }

  imgError = () => {
    // message.warn('图片加载异常，请重试。');
  }

  // 重设点坐标 { "area": ["197.50,119.00", "181.50,119.00"],"ratio": "483x260"}
  resetArea = () => {
    const { currTask } = this.props;
    const {
      sizeW, sizeH, ctx,
    } = this.state;

    const pointArrServer = currTask.area;
    const pointArrTemp = [];
    if (pointArrServer != null && undefined !== pointArrServer && pointArrServer.length >= 3) {
      const ratioTemp = currTask.ratio.split('x');
      let wProp = 1;
      let hProp = 1;
      if (ratioTemp.length > 0) {
        if (sizeW !== ratioTemp[0] || sizeH !== ratioTemp[1]) {
          wProp = sizeW / ratioTemp[0];
          hProp = sizeH / ratioTemp[1];
        }
      }

      pointArrServer.forEach(p => {
        const pArr = p.split(',');
        const pObj = {
          x: (pArr[0] * wProp),
          y: (pArr[1] *= hProp),
        };
        pointArrTemp.push(pObj);
      });

      canvasDraw.drawPointAndLine(ctx, pointArrTemp, null);

      this.setState({
        setAreaState: 2,
        pointArr: pointArrTemp,
      });
    }
  }

  // 开始画线
  imgCutDraw = () => {
    const { imgLoadedFlag } = this.state;
    if (imgLoadedFlag === false) return;
    const _self = this;
    this.setState({
      setAreaState: 1,
    }, () => {
      _self.setArea();
    });
  }

  imgCutDrawUpdate = () => {
    const { imgLoadedFlag } = this.state;
    const { currTask, putReviewPlateArea, intl } = this.props;
    if (imgLoadedFlag === false) return;
    const self = this;
    Modal.confirm({
      title: intl.formatMessage({ id: 'App.ipc.analytics.clear' }),
      content: '',
      onOk() {
        self.setState({
          pointArr: [],
        });
        const options = { area: [], ratio: 'x' };
        putReviewPlateArea(currTask.id, options).then(({ isOk }) => {
          if (isOk) {
            self.setState({
              setAreaState: 1,
            });
            self.resetDatas();
            self.setArea();
          }
        });
      },
      onCancel() {
      },
    });
  }

  resetDatas = () => {
    const { ctx } = this.state;
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);

    this.canvas.current.onmousemove = null;
    this.canvas.current.onmouseout = null;
    this.canvas.current.onmousedown = null;

    this.setState({
      pointArr: [],
      isShowHint: false,
    });
  }

  showHint = p2 => {
    const _self = this;
    const { intl } = this.props;
    this.setState({
      isShowHint: true,
    }, () => {
      let xTemp = `${p2.x + 25}px`;
      const yTemp = `${p2.y + 150}px`;
      const p2x = p2.x + 25;
      if (p2x > (this.sizeW - 180)) {
        xTemp = (p2x - 180);
      }
      // if ((p2.y + 25) > (sizeH))
      _self.hint.current.style.left = xTemp;
      _self.hint.current.style.top = yTemp;
      _self.hint.current.innerHTML = `${intl.formatMessage({ id: 'App.ipc.analytics.x' })}：${p2.x.toFixed(2)}，
      ${intl.formatMessage({ id: 'App.ipc.analytics.y' })}： ${p2.y.toFixed(2)}`;
    });
  }

  render() {
    const { intl } = this.props;
    const { imgLoading, imgUrl, isShowHint } = this.state;
    const setArea0Element = (
      <div>
        <Button type="primary" onClick={this.imgCutDraw}>{intl.formatMessage({ id: 'App.ipc.analytics.setting' })}</Button>
      </div>
    );
    const setArea1Element = (
      <div>
        <div>
          <Button type="primary" className="btn" onClick={this.imgCutDrawBack}>{intl.formatMessage({ id: 'App.control.back' })}</Button>
          <Button type="primary" className="btn" onClick={this.imgCutDrawCancel}>{intl.formatMessage({ id: 'App.control.quit' })}</Button>
          <Button type="primary" onClick={this.imgCutDrawOk}>{intl.formatMessage({ id: 'App.control.ok' })}</Button>
        </div>
        <div className="setArea1"><span>{intl.formatMessage({ id: 'App.ipc.analytics.rule.notice' })}</span></div>
      </div>
    );
    const setArea2Element = (
      <div>
        <Button type="primary" onClick={this.imgCutDrawUpdate}>{intl.formatMessage({ id: 'App.ipc.analytics.update' })}</Button>
        <div className="setArea1"><span>{intl.formatMessage({ id: 'App.ipc.analytics.exists' })}</span></div>
      </div>
    );
    return (
      <div className="reviewPlateTaskImage-set">
        <div>
          <div>
            <div>
              <Spin spinning={imgLoading}>
                <div className="tupianImg" id="img-container">
                  <img alt="" onLoad={this.imgLoaded} onError={this.imgError} src={imgUrl} ref={this.img} />
                  <canvas ref={this.canvas}>
                      当前浏览器不支持canvas
                  </canvas>
                </div>
              </Spin>
              <div className="setArea">
                {this.state.setAreaState === 0 && setArea0Element}
                {this.state.setAreaState === 1 && setArea1Element}
                {this.state.setAreaState === 2 && setArea2Element}
              </div>
            </div>
          </div>
        </div>
        {isShowHint && <div ref={this.hint} className="hint" />}
      </div>
    );
  }
}

export default injectIntl(ReviewPlateTaskImageCut);
