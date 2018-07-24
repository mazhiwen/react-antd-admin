import * as React from 'react';
import {Route } from 'react-router-dom'
import gameList from './list';
import gameAdd from './list';

class game extends React.Component {
  
  render(){
    return (
      <div>
        <Route path={`${this.props.match.url}/list`} component={gameList}/>
        <Route path={`${this.props.match.url}/add`} component={gameAdd}/>
      </div>
    )
  }


}

export default game;