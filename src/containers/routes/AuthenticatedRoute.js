import React, { PureComponent } from 'react';
import { string, func, object } from 'prop-types';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
import { scrollTop } from '../../utils';
import Cookies from 'js-cookie';
import { AUTH } from '../../constants/site';
import NoMatch from '../../components/Error/404';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Header from '../layout/Header';

class AuthenticatedRoute extends PureComponent {
  static propTypes = {
    path: string.isRequired,
    component: func.isRequired,
    onLoginOut: func.isRequired,
    intl: object.isRequired,
  }
  constructor(props) {
    super(props);
    const { onLoginOut } = props;
    if (!Cookies.get('token')) {
      onLoginOut();
    }
  }
  componentDidMount() {

  }
  render() {
    const {
      component: Component,
      path,
      ...rest
    } = this.props;


    let user = Cookies.get('user');
    let auth = null;
    if (user) {
      user = JSON.parse(Cookies.get('user'));
      auth = user.grade && AUTH[user.grade].includes(path);
    }


    if (auth) {
      return (<Route
        {...rest}
        render={props => {
                    scrollTop();
          return (
            <Layout>
              <Header />
              <Layout className={classNames(((path === '/smartapp/monitor' || path === '/smartapp/reviewplate/preview') && 'smart-app-monitor-layout') || (path === '/smartapp' && 'smart-app-layout'))}>
                <Component {...props} />
              </Layout>
            </Layout>);
        }}
      />
      );
    }
    return (
      <Route component={NoMatch} />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onLoginOut: () => {
    dispatch(replace('/logout'));
  },
});

export default connect(null, mapDispatchToProps)(injectIntl(AuthenticatedRoute));
