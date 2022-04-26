import React from 'react';
import Cameras from '../../containers/Cameras';
import Nvr from '../../containers/Cameras/Nvr';

import { Switch, Route } from 'react-router';
import NoMatch from '../../components/Error/404';
import AuthenticatedRoute from './AuthenticatedRoute';

const CamerasRouter = () => (
  <Switch>
    <AuthenticatedRoute exact path="/cameras/ipc" component={Cameras} />
    <AuthenticatedRoute exact path="/cameras/nvr" component={Nvr} />
    <Route component={NoMatch} />
  </Switch>
);

export default CamerasRouter;
