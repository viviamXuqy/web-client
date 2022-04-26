import React from 'react';
import { number, array, string, bool } from 'prop-types';
import Chart from 'bizcharts/lib/components/Chart';
import Axis from 'bizcharts/lib/components/Axis';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Geom from 'bizcharts/lib/components/Geom';

class ChartsBar extends React.PureComponent {
  static propTypes = {
    data: array.isRequired,
    height: number.isRequired,
    xName: string.isRequired,
    yName: string.isRequired,
    isTooltip: bool,
  }

  static defaultProps = {
    isTooltip: true,
  }

  render() {
    const {
      data, height, xName, yName, isTooltip,
    } = this.props;

    const grid = {
      type: 'line' || 'polygon', // 网格的类型
      lineStyle: {
        stroke: '#fff',
        opacity: 0.12,
        lineWidth: 1, // 网格线的宽度复制代码
        lineDash: [0], // 网格线的虚线配置，第一个参数描述虚线的实部占多少像素，第二个参数描述虚线的虚部占多少像素
      }, // 网格线的样式配置，原有属性为 line
    };

    const line = {
      stroke: '#fff',
      lineWidth: 1,
      opacity: 0.12,
    };

    const labelLeft = {
      textStyle: {
        fontSize: 14,
        fill: '#fff',
      },
    };
    const labelBottom = {
      textStyle: {
        fontSize: 14,
        fill: '#00D8FF',
      },
    };

    return (
      <div>
        {isTooltip &&
        <Chart
          padding={{
            left: 80, right: 30, top: 30, bottom: 50,
          }}
          height={height}
          data={data}
          forceFit
        >
          <Axis name={xName} line={line} label={labelBottom} />
          <Axis name={yName} grid={grid} label={labelLeft} />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom color="#00D8FF" type="interval" position={`${xName}*${yName}`} />
        </Chart>
        }
        {!isTooltip &&
        <Chart
          padding={{
            left: 80, right: 30, top: 30, bottom: 50,
          }}
          height={height}
          data={data}
          forceFit
        >
          <Axis name={xName} line={line} label={labelBottom} />
          <Axis name={yName} grid={grid} label={labelLeft} />
          <Geom color="#00D8FF" type="interval" position={`${xName}*${yName}`} />
        </Chart>
        }
      </div>
    );
  }
}

export default ChartsBar;
