import React, { Component } from 'react';
// import logo from './logo.svg';
import {Layout,
} from 'antd';
import './styles/index.less';
import {Route,Switch } from 'react-router-dom'
import Login from './views/login';
import MenuList from './components/MenuList/';
import MainHeader from './components/MainHeader';
import routes from 'routes';
import {localForage} from 'utils';
import PrivateRoute from './components/PrivateRoute';

const {Sider,Content}=Layout;






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
    
    
  }
  
  render() {
    return (
      this.props["location"]["pathname"]!=='/login'?
      <Layout>
        <MainHeader></MainHeader>

        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <MenuList/>
          </Sider>
          <Layout className="content_layout" >
            <Content style={{  margin: 0, minHeight: 1000 }}>
              <Switch>
                <PrivateRoute auth={false} 
                  path='/' exact
                  component={routes.home.component}
                />        
                <PrivateRoute auth={routes.home.auth} 
                  path={routes.home.path} 
                  component={routes.home.component}
                />  
                <PrivateRoute auth={routes.applylist.auth} 
                  path={routes.applylist.path} 
                  component={routes.applylist.component}
                /> 
                <PrivateRoute auth={routes.applydetail.auth} 
                  path={routes.applydetail.path} 
                  component={routes.applydetail.component}
                />
                <PrivateRoute auth={routes.system.children.query.auth} 
                  path={routes.system.children.query.path} 
                  component={routes.system.children.query.component}
                />
                <PrivateRoute auth={routes.system.children.myorders.auth} 
                  path={routes.system.children.myorders.path} 
                  component={routes.system.children.myorders.component}
                />
                <PrivateRoute auth={routes.system.children.orderdetails.auth} 
                  path={routes.system.children.orderdetails.path} 
                  component={routes.system.children.orderdetails.component}
                />
                <PrivateRoute auth={routes.blacklist.children.list.auth} 
                  path={routes.blacklist.children.list.path} 
                  component={routes.blacklist.children.list.component}
                />
                <PrivateRoute auth={routes.blacklist.children.add.auth} 
                  path={routes.blacklist.children.add.path} 
                  component={routes.blacklist.children.add.component}
                />
              </Switch>  
            </Content>
          </Layout>
        </Layout> 
        
      </Layout>:
      <Login/>
      
      
    );
  }
  
}

export default App;
