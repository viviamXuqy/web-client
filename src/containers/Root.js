import React, { PureComponent } from 'react';
import { object } from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Layout } from 'antd';

import { updateFilter } from '../actions/filter';
import Loading from '../shared/containers/Loading';

import LocaleProvider from './Locale';
import Footer from './layout/Footer';
import Routes from './routes';
import ErrorMessage from './ErrorMessage';


class Root extends PureComponent {
  static propTypes = {
    store: object.isRequired,
    history: object.isRequired,
  }

  render() {
    const { store, history } = this.props;

    // When the route changes, clear filters.
    history.listen(() => {
      store.dispatch(updateFilter('all'));
    });

    return (
      <Provider store={store}>
        <LocaleProvider>
          {/* ConnectedRouter will use the store from Provider automatically */}
          <ConnectedRouter history={history}>
            <Layout className="root-layout">
              <Layout>
                <Routes />
              </Layout>
              <Footer />
              <Loading />
              <ErrorMessage />
            </Layout>
          </ConnectedRouter>
        </LocaleProvider>
      </Provider>
    );
  }
}

export default Root;
