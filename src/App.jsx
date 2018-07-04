import React, { Component } from 'react';
// import logo from './logo.svg';
import {Layout,Menu,Breadcrumb} from 'antd';
import './App.less';
import {Route } from 'react-router-dom'
import Home from './views/Home';
import Login from './views/Login';
import MenuList from './components/MenuList/';
const {Header,Sider,Content}=Layout;
class App extends Component {
  render() {
    return (
      this.props["location"]["pathname"]!=='/login'?
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            {/* <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item> */}
          </Menu>
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
              <Route path="/about" component={Home}/>
            </Content>
          </Layout>
        </Layout>
      </Layout>:
      <Login />
      
      
    );
  }
  
}

export default App;
