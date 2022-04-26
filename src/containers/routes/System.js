import React from 'react';
import System from '../../containers/System';
import Log from '../../containers/System/Log';

import { Switch, Route } from 'react-router';
import NoMatch from '../../components/Error/404';
import AuthenticatedRoute from './AuthenticatedRoute';

const SystemRouter = () => (
  <Switch>
    <AuthenticatedRoute exact path="/system/setting" component={System} />
    <AuthenticatedRoute exact path="/system/log" component={Log} />
    <Route component={NoMatch} />
  </Switch>
);

export default SystemRouter;
