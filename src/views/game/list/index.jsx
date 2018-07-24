import * as React from 'react';
import {Table,Button} from 'antd';
import {axios} from '../../../utils/axios';
import { withRouter } from 'react-router-dom';

class GameListOrigin extends React.Component{
  constructor(props){
    super(props);
    this.state={
      gameListData:[]
    }

  }
  getGameList=()=>{
    axios.get('/game/list').then(res=>{
      
      this.setState({
        gameListData:res.data
      });
      
    })
  }
  addHandler=()=>{
    this.props.history.push('/game/add');
  }
  componentDidMount(){
    console.log(this.props);
    this.getGameList();
  }
  render(){

    const columns = [{
      title: '游戏名称',
      dataIndex: 'name'
    }, {
      title: '研发商',
      dataIndex: 'developer'
    }, {
      title: '发行日期',
      dataIndex: 'releaseDate',
      render:(text, record, index)=>{
        return new Date(text).toString();  
      }
    }];
    
    return(
      <div>
        <Button onClick={this.addHandler}>添加</Button>
        
        <Table rowKey={record=>record.id} dataSource={this.state.gameListData} columns={columns} />
      </div>
    )
  }
}
const gameList=withRouter(GameListOrigin);
export default gameList