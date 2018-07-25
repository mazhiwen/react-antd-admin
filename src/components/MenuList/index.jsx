import * as React from 'react';
import {Menu,Icon} from 'antd';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';

const { SubMenu } = Menu;

const menus = [
  {
    
    text:'功能',
    children:[
      {
        key:'home',//菜单唯一key值，作为菜单激活样式判断依据
        path:'/home',
        text:'首页'
      },
      {
        key:'game',
        path:'/game/list',
        text:'game'
      }
    ]
  },
  {
    // path:'/aa',
    text:'账户',
    children:[
      {
        key:'games',
        path:'/game/list',
        text:'games'
      }
    ]
  }
]
class MenuList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedKeys:['home']
    };
  }
  componentDidMount(){
    this.props.history.listen((location, action)=>{
      this.setState({
        selectedKeys:[location.pathname.match(/\/([^/]*)/)[1]]
      });
    });

    

  }
  render(){
    return(
      <Menu
        mode="inline"
        selectedKeys={this.state.selectedKeys}
        openKeys={['0']}
        style={{ height: '100%', borderRight: 0 }}
        
      >
        {
          menus.map((v,index)=>
            <SubMenu 
              key={index} 
              title={
                <span><Icon type="user" />
                  {v.path?(<Link to={v.path}>{v.text}</Link>):(v.text)}
                </span>
              }
            >
              {
                v.children&&v.children.map((vSub,indexSub)=>
                  <Menu.Item key={vSub.key}><Link to={vSub.path}>{vSub.text}</Link></Menu.Item>
                )
              }
            </SubMenu>
          )
        }
      </Menu>
    )
  }
}

export default withRouter(MenuList)