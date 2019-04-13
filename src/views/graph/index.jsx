
import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config'

export default class App extends Component {

  render() {
    const {route}=this.props;
    return(
      <div>
        {renderRoutes(route.routes, { someProp: 'these extra props are optional' })}
      </div>
    )
  }
}