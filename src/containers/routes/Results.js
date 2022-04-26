import React from 'react';
import { Switch, Route } from 'react-router';
import Results from '../../containers/Results';
import TaskResults from '../../containers/Results/TaskResults';
import NoMatch from '../../components/Error/404';
import AuthenticatedRoute from './AuthenticatedRoute';

const ResultsRouter = () => (
  <Switch>
    <AuthenticatedRoute exact path="/results/resultsList" component={Results} />
    <AuthenticatedRoute path="/results/task" exact component={TaskResults} />
    <Route component={NoMatch} />
  </Switch>
);

export default ResultsRouter;
