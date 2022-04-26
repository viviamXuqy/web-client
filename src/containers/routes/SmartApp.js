import React from 'react';
import SmartApp from '../../components/SmartApp';
import Monitor from '../../containers/SmartApp/Monitor';
import Driver from '../../containers/SmartApp/Driver';
import Violation from '../../containers/SmartApp/Violation';
import ReviewPlateTask from '../../containers/SmartApp/ReviewPlateTask';
import ReviewPlateResult from '../../containers/SmartApp/ReviewPlateResult';
import ReviewPlatePreview from '../../containers/SmartApp/ReviewPlatePreview';

import { Switch, Route } from 'react-router';
import NoMatch from '../../components/Error/404';
import AuthenticatedRoute from './AuthenticatedRoute';

const SmartAppRouter = () => (
  <Switch>
    <AuthenticatedRoute exact path="/smartapp" component={SmartApp} />
    <AuthenticatedRoute exact path="/smartapp/monitor" component={Monitor} />
    <AuthenticatedRoute exact path="/smartapp/driver" component={Driver} />
    <AuthenticatedRoute exact path="/smartapp/violation" component={Violation} />
    <AuthenticatedRoute exact path="/smartapp/reviewplate/tasks" component={ReviewPlateTask} />
    <AuthenticatedRoute exact path="/smartapp/reviewplate/results" component={ReviewPlateResult} />
    <AuthenticatedRoute exact path="/smartapp/reviewplate/preview" component={ReviewPlatePreview} />
    <Route component={NoMatch} />
  </Switch>
);

export default SmartAppRouter;
