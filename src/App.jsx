import React, { Component } from 'react';
// import logo from './logo.svg';
import {Layout,Menu,Breadcrumb,Dropdown,Icon,Avatar} from 'antd';
import './App.less';
import {Route } from 'react-router-dom'
import Home from './views/Home';
import GameList from './views/GameList';
import Login from './views/Login';
import MenuList from './components/MenuList/';
import localForage from './utils/localForage';
const {Header,Sider,Content}=Layout;


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      account:''
    };

    
    
  }

  componentDidMount(){
    localForage.getItem('account',(err,v)=>{
      this.setState({
        account:v
      });
      
    });

  }
  render() {
  
    const menu=(
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
        </Menu.Item>
      </Menu>
    );
    return (
      this.props["location"]["pathname"]!=='/login'?
      <Layout>
        <Header className="header">
          <div className="logo">
            Second Life
          </div>
          {/* <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu> */}
          <div className="user">
            <Dropdown  overlay={menu}>
              <Avatar size="large">
                {this.state.account}
              </Avatar>
            </Dropdown>
          </div>
          
          
        </Header>

        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            
            <MenuList/>
            
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item><span>{1}</span></Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 680 }}>
              
              <Route exact={true} path="/home" component={Home}/>
              <Route path="/gamelist" component={GameList}/>
            </Content>
          </Layout>
        </Layout>
      </Layout>:
      <Login />
      
      
    );
  }
  
}

export default App;
