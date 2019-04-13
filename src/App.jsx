import React, { Component } from 'react';
// import logo from './logo.svg';
import {
  Layout,LocaleProvider
} from 'antd';
import './styles/index.less';
import 'nprogress/nprogress.css';
import {Route,Switch } from 'react-router-dom'
import Login from './views/login';
import MenuList from './components/MenuList/';
import MainHeader from './components/MainHeader';
import {routesMap,routes,routesUrlMap} from 'routes';
import {localForage,RouteWithSubRoutes} from 'utils';
import PrivateRoute from './components/PrivateRoute';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { 
  authToken,
} from 'configs';

import {renderRoutes,matchRoutes} from 'react-router-config';





const {Sider,Content}=Layout;





// const renderRoute=(routes)=>{
//   routes.map((value,index)=>{
//     return (
//       <PrivateRoute 
//         auth={value.auth} 
//         path={value.path} 
//         component={value.component}
//       /> 
//     );
//   })
// }
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      account:'',
      isLogin:''
    };

    
    
  }
  openInNewTab=(url)=> {
    let win = window.open(url, '_blank');
    win.focus();  
  }

  componentDidMount(){
    this.auth();
    
  }
  componentDidUpdate(prevProps) {
    
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }
  onRouteChanged(route) {
    this.auth();
  }
  auth(){
    const branch = matchRoutes(routes, this.props.location.pathname);
    if(branch.length>0&&branch[branch.length-1].route.auth){
      localForage.getItem(authToken)
        .then((value)=>{
          if(!value){
            this.props.history.replace({pathname: '/login'});
          }
          // this.setState({
          //   isLogin:value
          // });

        })
    }
    
  }
  render() {
    const {isLogin} =this.state;
    return (
      <LocaleProvider locale={zh_CN}>
        {this.props["location"]["pathname"]!=='/login'?
        <Layout>
          <MainHeader></MainHeader>

          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
              <MenuList/>
            </Sider>
            <Layout className="content_layout" >
              <Content style={{  margin: 0, minHeight: 1000 }}>
               <Switch>
                   {/*<PrivateRoute auth={false} 
                    path='/' exact
                    component={routesMap.home.component}
                  />
                  <PrivateRoute auth={routesMap.blacklist.children.list.auth} 
                    path={routesMap.blacklist.children.list.path} 
                    component={routesMap.blacklist.children.list.component}
                  />
                  <PrivateRoute auth={routesMap.blacklist.children.add.auth} 
                    path={routesMap.blacklist.children.add.path} 
                    component={routesMap.blacklist.children.add.component}
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
                  />*/}
                  
                  
                  {/* {routesList.map((route, i) => <PrivateRoute key={i} 
                    auth={route.auth} 
                    path={route.path} 
                    component={route.component}
                  />)} */}
                </Switch>  
                {/* {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)} */}
                {/* {routes.map((route, i) => <PrivateRoute key={i} route={route} isLogin={isLogin} />)} */}
                {renderRoutes(routes,{isLogin:2222})}
              </Content>
            </Layout>
          </Layout> 
          
        </Layout>:
        <Login/>}
      </LocaleProvider>
      
    );
  }
  
}

export default App;
