
import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config'

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
    };
  }


  componentDidMount(){

    
  }
  
  render() {
    const {route}=this.props;
    return(
      <div>
        {renderRoutes(route.routes, { someProp: 'these extra props are optional' })}
      </div>
    )
  }
}