import React, { Component } from 'react';
// import logo from './logo.svg';
import {Layout,Menu,Breadcrumb,Dropdown,Icon,Avatar} from 'antd';
import './styles/index.less';
import {Route } from 'react-router-dom'
import Home from './views/Home';
import gameList from './views/game/list';
import game from './views/game';
import Login from './views/Login';
import MenuList from './components/MenuList/';
import localForage from './utils/localForage';
import MainHeader from './components/MainHeader';

const {Header,Sider,Content}=Layout;


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      account:''
    };

    
    
  }
  openInNewTab=(url)=> {
    let win = window.open(url, '_blank');
    win.focus();  
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
        <MainHeader></MainHeader>

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
              <Route path="/home" component={Home}/>  
              <Route path="/game" component={game}/>
            </Content>
          </Layout>
        </Layout>
        
      </Layout>:
      <Login />
      
      
    );
  }
  
}

export default App;
