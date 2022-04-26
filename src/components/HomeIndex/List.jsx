import React, { PureComponent } from 'react';
import { object } from 'prop-types';
import { List, Modal } from 'antd';
import { injectIntl } from 'react-intl';

import ResultsCard from '../../shared/containers/ResultsCard';
import ResultDetail from '../../shared/containers/ResultDetail';

class ResultList extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    results: object.isRequired,
    meta: object.isRequired,
  }

  state = {
    currResult: '', // 当前操作的结果
    modalVisible: false, // 详细信息界面
  }

  showModal = record => {
    this.setState({
      currResult: record,
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
      intl: { formatMessage },
      results,
      meta,
    } = this.props;

    const dataSource = [...results.keys()]
      .slice(0, meta.pageSize)
      .map(id => ({
        key: id,
        ...results.get(id),
      }));

    const { currResult } = this.state;

    return (
      <div>
        <div>
          <List
            className="homeindex-results-list"
            grid={{ gutter: 20, column: 5 }}
            dataSource={dataSource}
            renderItem={item => (
              <List.Item className="homeindex-results-list__item">
                <ResultsCard
                  result={item}
                  isResultList={false}
                  showResultDetail={this.showModal}
                />
              </List.Item>
            )}
          />
        </div>
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
    );
  }
}

export default injectIntl(ResultList);
