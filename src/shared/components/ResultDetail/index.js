import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { List, Spin, Card } from 'antd';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import ImageShow from '../../../shared/components/ImageShow';

import { BASE64_IMG_JPEG } from '../../../constants/config';
import { decodeUnicode, drawCarRect, drawCarTxt, drawCheckBox, getImgNaturalDimensions, drawRectBackColorByWhite } from '../../../utils';
import { getCanvasPos } from '../../../utils/canvas.draw';

import './index.less';

function StructShow(props) {
  const { className, name, value } = props;
  if (!value) return '';
  const element = (
    <span className={className}>
      <span className="result-detail__results-card-label">{name}</span>
      <span className="result-detail__results-card-label-content">{value}</span>
    </span>
  );
  return (
    element
  );
}

function StructShowList(props) {
  const { datas } = props;
  const listItems = datas.map(item =>
    <StructShow key={item.name} className={item.className} name={item.name} value={item.value} />);

  return (
    listItems
  );
}

function TargetShow(props) {
  const { datas, formatMessage } = props;
  let ele = '';
  if (datas.length > 0) {
    ele = (
      <div className="mt-15">
        <List
          className="result-detail___mubiaocontent__target"
          bordered
          dataSource={datas}
          renderItem={item => (
            <List.Item>
              <div className="f-bold fl mr-20 textColorWhite">{formatMessage({ id: 'App.results.target' })}{item.index}</div>
              <div className="fl w-635">
                {item.attri.map((attri, index) => (
                  <span className={attri.className} key={index.toString()}>
                    <span className="result-detail__results-card-label-content-target">{attri.name}</span>
                    <span className="result-detail__results-card-label-content-target">{attri.value}</span>
                  </span>))}
              </div>
            </List.Item>
            )}
        />
      </div>
    );
  }

  return (ele);
}

class ResultDetail extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    currResult: object.isRequired, // 当前结果详情对象
    getImg: func.isRequired,
  }

  constructor(props) {
    super(props);
    // 创建 ref 存储 cvs DOM 元素
    this.canvas = React.createRef();
    // 创建 ref 存储 pic DOM 元素
    this.img = React.createRef();
  }

  state = {
    imgLoading: true, // 图像的loading
    ctx: null, // ctx
    sizeW: 0, // 图片width
    sizeH: 0, // 图片height
    wProp: 1,
    hProp: 1,
    featuresState: [],
    targetFeatures: [],
    tailorArea: [],
    innerTailorArea: [],
    ratioOld: '', // 原始图片分辨率
    imgUrl: '',
    isShowBigImg: false,
    // imgLoadedFlag: false, // 图片是否成功加载
  }

  // render之后被调用，并且仅调用一次 作用：渲染挂载组件；可以使用refs
  componentDidMount() {
    this.handleImgShow();
  }

  // 组件被卸载前调用
  componentWillUnmount() {
    this.canvas.current.onmousemove = null;
    this.canvas.current.onmousedown = null;
    const { ctx } = this.state;
    if (ctx != null) {
      ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    }
    this.setState({
      featuresState: [],
    });
  }

  // 图片加载完成后设置canvas
  setCanvas = async () => {
    await this.setState({
      sizeW: this.img.current.width,
      sizeH: this.img.current.height,
    });
    debugger
    this.canvas.current.setAttribute('width', this.img.current.width);
    this.canvas.current.setAttribute('height', this.img.current.height);
    this.resetFeatures();
  }

  getTargetIndex = featuresState => {
    let index = 1;
    if (featuresState.length > 0) {
      index += featuresState[featuresState.length - 1].index;
    }

    return index;
  }

  getTargetByPoint = (p, arr) => {
    const { wProp, hProp } = this.state;

    const fds = arr.filter(f => {
      const x = f.area[0] * wProp;
      const y = f.area[1] * hProp;
      const w = f.area[2] * wProp;
      const h = f.area[3] * hProp;
      return (p.x >= x && p.x <= (x + w) && p.y >= y && p.y <= (y + h));
    });

    return fds.find(f => (f.area[1] === Math.max(...fds.map(o => o.area[1]))));
  }

  handleImgShow = () => {
    const self = this;

    const { getImg, currResult } = this.props;
    if (currResult.image) {
      self.setState({
        imgUrl: currResult.image,
      });
    } else {
      getImg(currResult.id).then(({ response }) => {
        if (response) {
          self.setState({
            imgUrl: BASE64_IMG_JPEG.toString() + response.image.toString(),
          });
        }
      });
    }
  }

  // 图片加载完成
  imgLoaded = async () => {
    const { w, h } = await getImgNaturalDimensions(this.img.current);
    await this.setState({
      // imgLoadedFlag: true,
      imgLoading: false,
      ctx: this.canvas.current.getContext('2d'),
      ratioOld: `${w}x${h}`,
    });
    this.setCanvas();
  }

  imgError = () => {
    // message.warn('图片加载异常，请重试。');
  }

  // 重设结构化数据
  resetFeatures = async () => {
    const { currResult } = this.props;
    const {
      sizeW, sizeH, ratioOld,
    } = this.state;

    const {
      personFeatures, carFeatures, objectFeatures, personPose,
    } = currResult;

    const ratioTemp = ratioOld.split('x');
    let wProp = 1;
    let hProp = 1;
    if (ratioTemp.length > 0) {
      if (sizeW !== ratioTemp[0] || sizeH !== ratioTemp[1]) {
        wProp = sizeW / ratioTemp[0];
        hProp = sizeH / ratioTemp[1];
      }
    }

    await this.setState({ wProp, hProp });

    const featuresState = [];

    if (carFeatures && carFeatures.length > 0) { // 车辆
      this.handleResetFeatures(featuresState, carFeatures, 2);
    }

    // personFeatures
    if (personFeatures && personFeatures.length > 0) {
      this.handleResetFeatures(featuresState, personFeatures, 1);
    }

    if (featuresState.length === 0) {
      if (objectFeatures && objectFeatures.length > 0) { // 目标坐标
        this.handleResetFeatures(featuresState, objectFeatures, 3);
      } else if (personPose && personPose.length > 0) { // 行人姿态
        this.handleResetFeatures(featuresState, personPose, 4);
      }
    }

    await this.setState({ featuresState: featuresState.slice(0) });

    this.resetDraw();

    this.canvas.current.onmousemove = ev => {
      this.handleMouseMove(getCanvasPos(ev, this.canvas.current));
    };

    this.canvas.current.onmousedown = ev => {
      this.handleMouseDown(getCanvasPos(ev, this.canvas.current));
    };
  }

  // fType: 1-personFeatures; 2-carFeatures; 3-objectFeatures; 4-personPose
  handleResetFeatures = (featuresState, features, fType) => {
    const { intl: { formatMessage } } = this.props;

    const index = this.getTargetIndex(featuresState);

    features.forEach((featrue, i) => {
      const obj = {
        attri: [],
        index: index + i,
        area: [],
        checked: false,
        moveChecked: false,
        plateArea: [],
      };

      // 1-personFeatures; 2-carFeatures; 3-objectFeatures; 4-personPose
      switch (fType) {
        case 1:
          if (featrue.area) obj.area = [...featrue.area];

          if (featrue.attri) {
            Object.keys(featrue.attri).forEach((attriKey, j) => {
              const className = j === 0 ? '' : 'ml-20';
              obj.attri.push({ className, name: `${formatMessage({ id: `App.public.struct.${attriKey}` })}: `, value: decodeUnicode(featrue.attri[attriKey]) }); // 属性
            });
          }
          break;
        case 2:
          if (featrue.cararea) obj.area = [...featrue.cararea];

          if (featrue.type) obj.attri.push({ className: '', name: `${formatMessage({ id: 'App.public.struct.type' })}: `, value: decodeUnicode(featrue.type) }); // 车辆类型
          if (featrue.brand) obj.attri.push({ className: 'ml-20', name: `${formatMessage({ id: 'App.public.struct.brand' })}: `, value: decodeUnicode(featrue.brand) }); // 车辆品牌
          if (featrue.plate) obj.attri.push({ className: 'ml-20', name: `${formatMessage({ id: 'App.public.struct.plate' })}: `, value: decodeUnicode(featrue.plate) }); // 车牌号码
          if (featrue.carcolor) obj.attri.push({ className: 'ml-20', name: `${formatMessage({ id: 'App.public.struct.carcolor' })}: `, value: decodeUnicode(featrue.carcolor) }); // 车辆颜色
          if (featrue.platecolor) obj.attri.push({ className: 'ml-20', name: `${formatMessage({ id: 'App.public.struct.platecolor' })}: `, value: decodeUnicode(featrue.platecolor) }); // 车牌颜色

          if (featrue.platearea) obj.plateArea = [...featrue.platearea];
          break;
        case 3:
          {
            let mbArea = '';
            if (featrue.area) {
              obj.area = [...featrue.area];
              mbArea = `(${featrue.area[0]}, ${featrue.area[1]})`;
            }
            if (featrue.type) obj.attri.push({ className: '', name: `${decodeUnicode(featrue.type)}: `, value: mbArea });
            if (featrue.occupantNum) obj.attri.push({ className: 'ml-20', name: '乘员数量: ', value: featrue.occupantNum });
          }
          break;
        case 4:
          {
            if (featrue.area) obj.area = [...featrue.area];

            let poseArea = '';
            // 肢体坐标
            if (featrue.pose && featrue.pose.length > 0) {
              featrue.pose.forEach(p => {
                poseArea += `(${p.x}, ${p.y}) `;
              });
              poseArea = `${formatMessage({ id: 'App.results.poseArea' })}: ${poseArea}`;
            }

            if (featrue.type) obj.attri.push({ className: '', name: `${decodeUnicode(featrue.type)}: `, value: poseArea });
          }
          break;
        default:
          break;
      }

      featuresState.push(obj);
    });

    return featuresState;
  }

  resetDraw = () => {
    const { intl: { formatMessage } } = this.props;
    const {
      wProp, hProp, ctx, featuresState,
    } = this.state;

    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    featuresState.forEach(f => {
      let x = f.area[0] * wProp;
      let y = f.area[1] * hProp;
      const w = f.area[2] * wProp;
      const h = f.area[3] * hProp;
      const per = w / 50;

      if (f.moveChecked && f.area.length > 3) {
        drawRectBackColorByWhite(ctx, x, y, w, h);
      }

      drawCarRect(ctx, x, y, w, h);

      if (f.area.length > 3) {
        drawCarRect(ctx, x, y, w, h);
        const txtFontSize = (per * 14) > 14 ? 14 : ((per * 14) < 6 ? 6 : (per * 14)); // eslint-disable-line
        drawCarTxt(ctx, `${formatMessage({ id: 'App.results.target' })}${f.index}`, x, y - 2, txtFontSize);
      }

      if (f.plateArea.length > 3) {
        drawCarRect(ctx, f.plateArea[0] * wProp, f.plateArea[1] * hProp,
          f.plateArea[2] * wProp, f.plateArea[3] * hProp);
      }

      if (f.checked) {
        x = (x + w) - 19;
        y += 3;
        const checkBoxW = (per * 16) > 16 ? 16 : (per * 16) < 16 ? 9 : (per * 16); // eslint-disable-line
        x += (16 - checkBoxW);
        drawCheckBox(ctx, x, y, checkBoxW, checkBoxW);
      }
    });
  }

  handleMouseMove = async p => {
    let { featuresState } = this.state;
    featuresState = featuresState.map(f => ({ ...f, moveChecked: false }));
    const fdTemp = this.getTargetByPoint(p, featuresState);

    if (fdTemp && !fdTemp.moveChecked) {
      fdTemp.moveChecked = true;
    }

    await this.setState({ featuresState: featuresState.slice(0) });

    this.resetDraw();
  }

  handleMouseDown = async p => {
    let { featuresState } = this.state;

    featuresState = featuresState.map(f => ({ ...f, checked: false }));
    const fdTemp = this.getTargetByPoint(p, featuresState);

    if (fdTemp) {
      fdTemp.checked = !fdTemp.checked;
    }

    await this.setState({
      featuresState: featuresState.slice(0),
      targetFeatures: fdTemp ? [fdTemp] : [],
      tailorArea: fdTemp ? fdTemp.area : [],
      innerTailorArea: fdTemp ? fdTemp.plateArea : [],
    });

    this.handleShowBigImg(Boolean(fdTemp));

    this.resetDraw();
  }

  handleShowBigImg = isShowBigImg => {
    this.setState({ isShowBigImg });
  }

  render() {
    const { currResult, intl: { formatMessage } } = this.props;
    const {
      imgLoading, featuresState, imgUrl, targetFeatures,
      isShowBigImg, ratioOld, tailorArea, innerTailorArea,
    } = this.state;
    const data = [
      {
        name: `${formatMessage({ id: 'App.results.taskId' })}: `,
        className: '',
        value: currResult.taskId,
      },
      {
        name: `${formatMessage({ id: 'App.results.taskName' })}: `,
        className: '',
        value: currResult.taskName,
      },
      {
        name: `${formatMessage({ id: 'App.results.resultId' })}: `,
        className: '',
        value: currResult.id,
      },
      {
        name: `${formatMessage({ id: 'App.results.taskType' })}: `,
        className: '',
        value: formatMessage({ id: `App.results.${currResult.taskType}` }),
      },
      {
        name: `${formatMessage({ id: 'App.public.time' })}: `,
        className: '',
        value: moment(Number(currResult.time)).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        name: `${formatMessage({ id: 'App.public.address' })}: `,
        className: '',
        value: currResult.address,
      },
    ];
    return (
      <div className="result-detail">
        <div>
          <Spin spinning={imgLoading}>
            <div className="tupianImg">
              <img alt="" onLoad={this.imgLoaded} onError={this.imgError} src={imgUrl} ref={this.img} />
              <canvas ref={this.canvas}>
                {formatMessage({ id: 'App.public.canvas.support' })}
              </canvas>
              {isShowBigImg &&
                <div className="imgCard">
                  <Card
                    hoverable
                    style={{ width: 300, height: 222 }}
                    cover={
                      <ImageShow
                        img={this.img.current}
                        close={() => this.handleShowBigImg(false)}
                        width={300}
                        height={222}
                        ratioOld={ratioOld}
                        tailorArea={tailorArea}
                        innerTailorArea={innerTailorArea}
                      />
                    }
                  />
                </div>
              }
            </div>
          </Spin>
        </div>
        <div>
          <List
            className="result-detail___content"
            grid={{ gutter: 8, column: 3 }}
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <StructShow name={item.name} value={item.value} />
              </List.Item>
              )}
          />
          {targetFeatures && <TargetShow datas={targetFeatures} formatMessage={formatMessage} />}
          <List
            className="result-detail___mubiaocontent"
            bordered
            dataSource={featuresState}
            renderItem={item => (
              <List.Item>
                <div className="result-detail___mubiao fl mr-20">{formatMessage({ id: 'App.results.target' })}{item.index}</div>
                <div className="fl w-635"><StructShowList datas={item.attri} /></div>
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(ResultDetail);
