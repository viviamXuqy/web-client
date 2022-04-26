import React from 'react';
import { Switch, Route } from 'react-router';
import NoMatch from '../../components/Error/404';
import SignIn from './SignInPage';
import Logout from './LogoutPage';
import AuthenticatedRoute from './AuthenticatedRoute';
import HomeIndex from './HomeIndex';
import Tasks from './Tasks';
import Cameras from './Cameras';
import Results from './Results';
import System from './System';
import SmartApp from './SmartApp';

const Routes = () => (
  <Switch>
    <Route path="/login" component={SignIn} />
    <Route path="/logout" component={Logout} />
    <AuthenticatedRoute exact path="/" component={HomeIndex} />
    <Route path="/tasks" component={Tasks} />
    <Route path="/cameras" component={Cameras} />
    <Route path="/results" component={Results} />
    <Route path="/system" component={System} />
    <Route path="/smartapp" component={SmartApp} />
    <Route component={NoMatch} />
  </Switch>
);

export default Routes;
