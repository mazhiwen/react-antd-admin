import * as React from 'react';
import {Menu,Icon} from 'antd';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';

const { SubMenu } = Menu;

const menus = [
  {
    
    text:'概览',
    children:[
      {
        key:'home',//菜单唯一key值，作为菜单激活样式判断依据
        path:'/home',
        text:'概览'
      }
    ]
  },
  {
    text:'首页',
    children:[
      {
        key:'games',
        path:'/game/lists',
        text:'今日热门'
      },
      {
        key:'games',
        path:'/game/lists',
        text:'评分排行'
      }
    ]
  },
  {
    text:'游戏',
    children:[
      {
        key:'game',
        path:'/game/list',
        text:'游戏列表'
      },
      {
        key:'games',
        path:'/game/lists',
        text:'配置'
      }

    ]
  },
  {
    text:'社区',
    children:[
      {
        key:'games',
        path:'/game/lists',
        text:'账户'
      },
      {
        key:'games',
        path:'/game/lists',
        text:'文章'
      },
      {
        key:'games',
        path:'/game/lists',
        text:'问答'
      },
      {
        key:'games',
        path:'/game/lists',
        text:'动态'
      }
    ]
  },
  {
    text:'广告',
    children:[
      {
        key:'games',
        path:'/game/lists',
        text:'广告列表'
      }
    ]
  },
  {
    text:'运营账户',
    children:[
      {
        key:'games',
        path:'/game/lists',
        text:'列表'
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
    //根据location /aaa/b aaa值作为激活导航栏item
    this.setState({
      selectedKeys:[this.props.location.pathname.match(/\/([^/]*)/)[1]]
    });
    this.props.history.listen((location, action)=>{
      console.log(location);
      // this.setState(location.state);
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
        // openKeys={['0']}
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
                  <Menu.Item key={vSub.key}>
                    <Link 
                      to={{
                        pathname:vSub.path
                      }}>
                      {vSub.text}
                    </Link>
                  </Menu.Item>
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