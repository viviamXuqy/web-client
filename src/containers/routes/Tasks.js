import React from 'react';
import Task from '../../containers/Tasks';
import TaskPic from '../../containers/Tasks/TaskPic';
import TaskVideo from '../../containers/Tasks/TaskVideo';
import { Switch, Route } from 'react-router';
import NoMatch from '../../components/Error/404';
 import AuthenticatedRoute from './AuthenticatedRoute';

const TaskRouter = () => (
  <Switch>

     <AuthenticatedRoute path="/tasks/analysis" exact component={Task} />
    <AuthenticatedRoute path="/tasks/pic" exact component={TaskPic} />
    <AuthenticatedRoute path="/tasks/video" exact component={TaskVideo} />
    <Route component={NoMatch} />
  </Switch>
);

export default TaskRouter;
