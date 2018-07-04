import * as React from 'react';
import {Menu,Icon} from 'antd';
import { Link } from 'react-router-dom'

const { SubMenu } = Menu;

const menus = [
  {
    
    text:'父级一',
    children:[
      {
        path:'/home',
        text:'默认页面'
      },
      {
        path:'/about',
        text:'about'
      }
    ]
  },
  {
    path:'/aa',
    text:'父级二',
  }
]
class MenuList extends React.Component{
  render(){
    return(
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
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
                  <Menu.Item key={indexSub}><Link to={vSub.path}>{vSub.text}</Link></Menu.Item>
                )
              }
            </SubMenu>
          )
        }
      </Menu>
    )
  }
}

export default MenuList