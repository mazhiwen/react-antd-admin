import {axios} from './axios';

import localForage from './localForage';
import {dataFormat,utiDate,validator as validatorOrigin} from '@company/company-utilities';
import md5 from 'md5';
import commonRequest from './commonRequest';

import {logOutOperate} from './logout';
import history from './history'
import cookie from './cookie';
import * as permission from './permission';
import React from "react";
import {  Route ,Redirect} from "react-router-dom";
import PrivateRoute from '../components/PrivateRoute';

import {contextPath} from 'configs';
// import antdPack from './antdPack';

function parseOperatorName(input) {
  if (input === undefined || input === null) return;
  if(/.*_pool$/.test(input)) return 'un-assigned';
  if(input==='owner') return '客户本人';
  return input.replace(/@.*$/,'')
}

let validator=new validatorOrigin({
  patterns:{
    // 'password':{
    //   'pattern':/^[\d|\w]{6,8}$/,
    //   'errorMessage': '请输入正确的密码'
    // }
  },
  errorHandler:()=>{
    console.log(222222);
  }
});
const RouteWithSubRoutes = propsa => {
  
  const { component: Component,auth,routes,...rest }= propsa.route;
  const {isLogin}=propsa;
  // const { component: Component,auth,routes,...rest }= propsa;
  return (
    <Route
      {...rest}
      render={propsb => (
        
          <Component {...propsb}  routes={routes} isLogin={isLogin} />
        // <Component {...propsb}  routes={routes} />
        
        
      )}
    />
  )
};
const openInNewTab=(url) =>{
  // console.log(window.host,contextPath);
  let resUrl=`.${url}`;
  // console.log(resUrl);
  var win = window.open(resUrl, '_blank');
  win.focus();  
}
function historyPush(params){
  this.props.history.push(params);
}
export {
  axios,
  localForage,
  md5,
  dataFormat,
  utiDate,
  parseOperatorName,
  logOutOperate,
  history,
  cookie,
  validator,
  permission,
  commonRequest,
  RouteWithSubRoutes,
  historyPush,
  openInNewTab
}
