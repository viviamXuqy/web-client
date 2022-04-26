import React, { PureComponent } from 'react';
import { object, func, string, number } from 'prop-types';
import { Upload, Button, message } from 'antd';
import { injectIntl } from 'react-intl';
import { camelizeKeys } from 'humps';

import Cookies from 'js-cookie';
import { resetOrientation, drawCarRect, drawCheckBox, drawRectBackColorByWhite } from '../../../utils';
import { getCanvasPos } from '../../../utils/canvas.draw';

import './index.css';

class ImageSearchUploader extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    url: string.isRequired,
    onUpdateResData: func.isRequired,
    onTarget: func.isRequired,
    btnType: string,
    defaultChecked: number,
    areaMax: number,
  }
  static defaultProps = {
    btnType: 'default',
    defaultChecked: -1, // defaultChecked可配置，选中第index项或者全部选中
    areaMax: -1, // areaMax可配置，>0为最多可以勾选areaMax个区域，-1为勾选区域无限制
  }
  constructor(props) {
    super(props);
    // 创建 ref 存储 cvs DOM 元素
    this.canvas = React.createRef();
    // 创建 ref 存储 pic DOM 元素
    this.img = React.createRef();

    this.state = {
      imageUrl: '',
      loading: false,
      ctx: null, // ctx
      sizeW: 0, // 图片width
      sizeH: 0, // 图片height
      wProp: 1,
      hProp: 1,
      ratio: '', // 图片分辨率
      featureDetails: [],
      checkedId: props.defaultChecked,
    };
  }

  // 组件被卸载前调用
  componentWillUnmount() {
    this.canvas.current.onmousemove = null;
    this.canvas.current.onmousedown = null;
    const { ctx } = this.state;
    if (ctx != null) {
      ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    }
  }

  // 图片加载完成后设置canvas
  setCanvas = () => {
    this.setState({
      sizeW: this.img.current.width,
      sizeH: this.img.current.height,
    }, () => {
      this.canvas.current.setAttribute('width', this.img.current.width);
      this.canvas.current.setAttribute('height', this.img.current.height);
      this.setArea();
    });
  }

  setArea = () => {
    const {
      sizeW, sizeH, ratio,
    } = this.state;

    const ratioTemp = ratio.split('x');
    let wProp = 1;
    let hProp = 1;
    if (ratioTemp.length > 0) {
      if (sizeW !== ratioTemp[0] || sizeH !== ratioTemp[1]) {
        wProp = sizeW / ratioTemp[0];
        hProp = sizeH / ratioTemp[1];
      }
    }
    this.setState({
      wProp,
      hProp,
    }, () => {
      this.resetDraw();
    });

    this.canvas.current.onmousedown = ev => {
      this.handleMouseDown(getCanvasPos(ev, this.canvas.current));
    };

    this.canvas.current.onmousemove = ev => {
      this.handleMouseMove(getCanvasPos(ev, this.canvas.current));
    };
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

  resetDraw = () => {
    const {
      wProp, hProp, featureDetails, ctx,
    } = this.state;

    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    featureDetails.forEach(f => {
      let x = f.area[0] * wProp;
      let y = f.area[1] * hProp;
      const w = f.area[2] * wProp;
      const h = f.area[3] * hProp;
      const per = w / 50;

      if (f.moveChecked) {
        drawRectBackColorByWhite(ctx, x, y, w, h);
      }

      drawCarRect(ctx, x, y, w, h);

      if (f.checked) {
        x = (x + w) - 19;
        y += 3;
        const checkBoxW = (per * 16) > 16 ? 16 : (per * 16) < 16 ? 9 : (per * 16); // eslint-disable-line
        x += (16 - checkBoxW);
        drawCheckBox(ctx, x, y, checkBoxW, checkBoxW);
      }
    });
  }

  handleMouseMove = p => {
    let { featureDetails } = this.state;
    featureDetails = featureDetails.map(f => ({ ...f, moveChecked: false }));
    const fdTemp = this.getTargetByPoint(p, featureDetails);

    if (fdTemp && !fdTemp.moveChecked) {
      fdTemp.moveChecked = true;
    }

    this.setState({
      featureDetails: featureDetails.slice(0),
    }, () => {
      this.resetDraw();
    });
  }

  handleMouseDown = async p => {
    const { onTarget, areaMax } = this.props;
    const { featureDetails, checkedId } = this.state;
    const fdTemp = await this.getTargetByPoint(p, featureDetails);

    if (areaMax > 0) { // 最多可以勾选areaMax个区域
      if (fdTemp) {
        fdTemp.checked = true;
      }
      if (fdTemp && checkedId !== fdTemp.id) {
        const fds = this.state.featureDetails;
        fds[checkedId].checked = false;
        await this.setState({
          featureDetails: fds,
          checkedId: fdTemp.id,
        }, () => {
          this.resetDraw();
          onTarget(fdTemp.id);
        });
      }
    } else { // 勾选区域无限制
      if (fdTemp) {
        fdTemp.checked = !fdTemp.checked;
      }

      await this.setState({
        featureDetails: featureDetails.slice(0),
      }, () => {
        this.resetDraw();
        onTarget(fdTemp.id);
      });
    }
  }

  beforeUpload = file => {
    const { intl } = this.props;

    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJPGorPNG) {
      message.error(intl.formatMessage({ id: 'App.form.upload.msg.file' }));
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error(intl.formatMessage({ id: 'App.form.upload.msg.max' }));
    }

    if (isJPGorPNG && isLt5M) {
      return true;
    }

    return false;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    const { intl, onUpdateResData, defaultChecked } = this.props;
    if (info.file.status === 'error') {
      this.setState({ loading: true });
      message.error(intl.formatMessage({ id: `App.error.${info.file.error.status}` }));
      return;
    }
    if (info.file.status === 'done') {
      const { code, result } = info.file.response;

      if (code !== 200) {
        message.error(intl.formatMessage({ id: `App.error.${code}` }));
        return;
      }

      const self = this;
      // Get this url from response in real world.
      resetOrientation(info.file.originFileObj, imageUrl => {
        self.setState({
          imageUrl,
          loading: false,
          ctx: this.canvas.current.getContext('2d'),
        });

        const data = camelizeKeys(result ? JSON.parse(result) : { ratio: '', featureDetails: [] });
        if (!result) {
          message.error(intl.formatMessage({ id: 'App.results.struct.img.nostructs' }));
        }

        const { ratio, featureDetails = [] } = data;
        if (featureDetails) {
          self.setState({
            ratio,
            featureDetails: featureDetails.filter(f => f.area && f.area.length > 3 && f.features)
              .map((f, index) => ({
                ...f,
                id: index,
                checked: defaultChecked > -1 ? (index === defaultChecked) : true,
                moveChecked: false, // 移动选中
              })),
            checkedId: defaultChecked,
          }, () => {
            self.setCanvas();
            onUpdateResData(self.state.featureDetails);
          });
        }
      });
    }
  }

  render() {
    const { url, intl: { formatMessage }, btnType } = this.props;
    const { imageUrl } = this.state;

    const uploadTrigger = (
      <div>
        <Button icon={this.state.loading ? 'loading' : 'upload'} type={btnType} >{formatMessage({ id: 'App.public.upload.pic' })}</Button>
      </div>
    );

    const token = Cookies.get('token');

    return (
      <div className="image-search-uploader">
        <div className="tupianImg">
          <img src={imageUrl} alt="" ref={this.img} />
          <canvas ref={this.canvas}>
            {formatMessage({ id: 'App.public.canvas.support' })}
          </canvas>
        </div>
        <Upload
          action={url}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          headers={token ? { token } : {}}
          onChange={this.handleChange}
          accept="image/jpg,image/jpeg,image/png"
        >
          {uploadTrigger}
        </Upload>
      </div>
    );
  }
}

export default (injectIntl(ImageSearchUploader));
