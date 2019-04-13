
import React, { Component } from 'react';
import {RouteWithSubRoutes} from 'utils';

import PrivateRoute from 'components/PrivateRoute';
import {routesMap,routes,routesList} from 'routes';

import { renderRoutes,matchRoutes } from 'react-router-config'

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
    };
  }


  componentDidMount(){

    
  }
  
  render() {
    const {route,routes,isLogin}=this.props;
    return(
      <div>
        {renderRoutes(route.routes, { someProp: 'these extra props are optional' })}
      </div>
    )
  }
}