import React, { PureComponent } from 'react';
import { array, func } from 'prop-types';
import { List } from 'antd';
import { injectIntl } from 'react-intl';
import { Scrollbars } from 'react-custom-scrollbars';

class ReviewPlatePreviewList extends PureComponent {
  static propTypes = {
    results: array.isRequired,
    onShowResultDetail: func.isRequired,
  }

  state = {
  }

  renderThumb = () => {
    const thumbStyle = {
      backgroundColor: '#00D8FF',
      borderRadius: 19,
      width: 5,
    };
    return (
      <div
        style={{ ...thumbStyle }}
      />
    );
  }

  render() {
    const { results, onShowResultDetail } = this.props;

    return (
      <Scrollbars
        style={{ width: 'calc(100% - 7)', height: 750 }}
        renderThumbVertical={this.renderThumb}
      >
        <div className="monitor__list">
          <List
            itemLayout="horizontal"
            dataSource={results}
            renderItem={item => (
              <List.Item>
                <div className="item">
                  <span>时间：{item.plateCheckedTime}</span>
                  <span>车牌：{item.result ? item.plate.plateNo : '车牌'}</span>
                  <div className="buttons-group">
                    <button onClick={() => onShowResultDetail(item)} className="tablelink" style={{ color: '#00D8FF' }}>查看详情</button>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Scrollbars>
    );
  }
}

export default injectIntl(ReviewPlatePreviewList);
