import React, { ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';

import TagsGenerator from '~forms/TagsGenerator';
import routes from '~dictionaries/routes';

const Routing = (): ReactElement =>
  <Switch>
    {routes.map(({ path, component }) => <Route exact key={path} path={path}
      component={component}/>)}
    <Route component={TagsGenerator}/>
  </Switch>;

export default Routing;
