import React from 'react';
import { object, func } from 'prop-types';
import { injectIntl } from 'react-intl';
import Top from './Top';
import MiddleList from './MiddleList';
import ResultList from './List';

import './index.less';


class HomeIndex extends React.PureComponent {
  static propTypes = {
    intl: object.isRequired,
    results: object.isRequired,
    meta: object.isRequired,
    fetchResults: func.isRequired,
    updateFilter: func.isRequired,
  }

  componentDidMount() {
    const { fetchResults } = this.props;

    // page 传最大值就是最后一页 server端1亿
    const MAX_INT = 10;

    const filters = {
      page: MAX_INT,
      pageSize: 5,
      search: '',
      begin: '',
      end: '',
      taskBeginId: '',
      taskEndId: '',
    };

    this.updateFilter(filters);

    fetchResults();
  }

  updateFilter = values => {
    const { updateFilter } = this.props;

    updateFilter('results', values);
  }

  render() {
    const { intl } = this.props;

    return (
      <div className="index-page">
        <Top lang={intl.locale} />
        <div className="index-page-container">
          <div className="index-page-container-container">
            <MiddleList />
          </div>
        </div>
        <div className="index-page-container-table">
          <div className="index-page-container-container-table">
            <ResultList results={this.props.results} meta={this.props.meta} />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(HomeIndex);
