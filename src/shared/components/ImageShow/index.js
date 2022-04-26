import React, { PureComponent } from 'react';
import { object, func, number, string, array } from 'prop-types';
import { Button } from 'antd';
import { injectIntl } from 'react-intl';

import './index.less';

class ImageShow extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    img: object.isRequired,
    close: func.isRequired,
    width: number.isRequired,
    height: number.isRequired,
    ratioOld: string.isRequired, // eslint-disable-line react/no-unused-prop-types
    tailorArea: array.isRequired, // eslint-disable-line
    innerTailorArea: array, // eslint-disable-line
  }

  static defaultProps = {
    innerTailorArea: [],
  }

  constructor(props) {
    super(props);
    // 创建 ref 存储 cvs DOM 元素
    this.canvas = React.createRef();
  }

  state = {
    ctx: null, // ctx
    tailorX: 0,
    tailorY: 0,
    tailorW: 0,
    tailorH: 0,
    imgScale: 1,
  }

  // render之后被调用，并且仅调用一次 作用：渲染挂载组件；可以使用refs
  componentDidMount() {
    this.setState({
      ctx: this.canvas.current.getContext('2d'),
    });
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      ratioOld, width, height, tailorArea, innerTailorArea,
    } = nextProps;
    if (tailorArea.length > 3) {
      const rate = width / height;
      const [tX, tY, tW, tH] = tailorArea;
      const ratioTemp = ratioOld.split('x');

      let x = tX;
      let y = tY;
      let w = tW;
      let h = tH;

      if (tW >= tH) {
        h = w / rate;
        if ((tY + h) > ratioTemp[1]) {
          h = ratioTemp[1] - tY;
        }
      } else {
        w = h * rate;
        if ((tX + w) > ratioTemp[0]) {
          w = ratioTemp[0] - tX;
        }
      }
      const imgScale = width / w;
      if (innerTailorArea.length > 0) {
        const [itX, itY, itW, itH] = innerTailorArea;
        const iitW = (itX + itW) - tX;
        const iitH = (itY + itH) - tY;
        if (w < iitW) {
          x += iitW - w;
        }
        if (h < iitH) {
          y += iitH - h;
        }
      }

      return {
        tailorX: x,
        tailorY: y,
        tailorW: w,
        tailorH: h,
        imgScale,
      };
    }
    return null;
  }

  componentDidUpdate() {
    this.drawImage();
  }

  // 组件被卸载前调用
  componentWillUnmount() {
  }

  drawImage = () => {
    const { img } = this.props;
    const {
      ctx, tailorX, tailorY, tailorW, tailorH, imgScale,
    } = this.state;
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);

    ctx.drawImage(
      img,
      tailorX, tailorY,
      tailorW, tailorH,
      0, 0,
      tailorW * imgScale, tailorH * imgScale,
    );
  }

  render() {
    const {
      intl: { formatMessage }, width, height, close,
    } = this.props;

    return (
      <div className="image-show">
        <div className="img__tupianImg" style={{ width, height }}>
          <canvas ref={this.canvas} width={width} height={height}>
            {formatMessage({ id: 'App.public.canvas.support' })}
          </canvas>
          <Button
            shape="circle"
            icon="close"
            onClick={close}
            size="small"
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(ImageShow);
