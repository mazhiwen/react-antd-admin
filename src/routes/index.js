
import Home from 'views/home'; 
import Login from 'views/login'; 
import User from 'views/user'; 

import graph from 'views/graph'; 
import graph_applicationgraph from 'views/graph/applicationgraph'; 

import rule from 'views/rule'; 
import rule_config from 'views/rule/config'; 
import rule_configs from 'views/rule/configs'; 

import rule_test from 'views/rule/test';

import system from 'views/system'; 
import system_beforeloan from 'views/system/beforeloan'; 
import system_beforeloan_summary from 'views/system/beforeloan/summary'; 
import system_beforeloan_summarylist from 'views/system/beforeloan/summarylist'; 
import system_beforeloan_loanlist from 'views/system/beforeloan/loanlist'; 
import system_beforeloan_applydetail from 'views/system/beforeloan/applydetail'; 
import system_beforeloan_oneloanhistory from 'views/system/beforeloan/oneloanhistory'; 

import system_records from 'views/system/records'; 
import system_records_list from 'views/system/records/list'; 


import OrderDetails from 'views/system/orderdetails';
import Blacklist from 'views/blacklist';
import BlacklistList from 'views/blacklist/list';
import BlacklistAdd from 'views/blacklist/add';
// import App from '../App';


const routes = [
  {
    path: '/',
    exact:true,
    component: Home,
    auth:false
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/user',
    component: User,
  },
  {
    path: '/blacklist',
    component: Blacklist,
    auth:false,
    routes: [
      {
        path: '/blacklist/list',
        auth:true,
        exact:true,
        component:BlacklistList
      },
      {
        path: '/blacklist/add/:id',
        // auth:true,
        exact:true,
        component:BlacklistAdd
      },
      {
        path: '/blacklist/add',
        // auth:true,
        exact:true,
        component:BlacklistAdd
      }
    ]
  },
  {
    path: '/graph',
    component: graph,
    routes: [
      {
        path: '/graph/applicationgraph',
        component:graph_applicationgraph,
      }
    ]
  },
  {
    path: '/rule',
    component: rule,
    routes: [
      {
        path: '/rule/config',
        component:rule_config,
      },
      {
        path: '/rule/configs',
        component:rule_configs,
      },
      {
        path: '/rule/test',
        component:rule_test,
      }
    ]
  },
  {
    path: '/system',
    component: system,
    routes: [
      {
        path: '/system/beforeloan',
        component:system_beforeloan,
        routes: [
          {
            path: '/system/beforeloan/summary',
            component:system_beforeloan_summary
          },
          {
            path: '/system/beforeloan/summarylist/:subType/:subsubType',
            component:system_beforeloan_summarylist
          },
          {
            path: '/system/beforeloan/summarylist',
            component:system_beforeloan_summarylist
          },
          {
            path: '/system/beforeloan/loanlist',
            component:system_beforeloan_loanlist
          },
          {
            path: '/system/beforeloan/loanlistmy',
            component:system_beforeloan_loanlist
          },
          {
            path: '/system/beforeloan/loanlisthistory',
            component:system_beforeloan_loanlist
          },
          {
            path: '/system/beforeloan/loanlistqa',
            component:system_beforeloan_loanlist
          },
          {
            path: '/system/beforeloan/loanlistqamy',
            component:system_beforeloan_loanlist
          },
          {
            path: '/system/beforeloan/applydetail/:id',
            component:system_beforeloan_applydetail
          },
          {
            path: '/system/beforeloan/oneloanhistory/:id',
            component:system_beforeloan_oneloanhistory
          },
        ]
      },
      {
        path: '/system/record',
        component:system_records,
        routes: [
          {
            path: '/system/record/list',
            component:system_records_list
          },
          {
            path: '/system/record/listmy',
            component:system_records_list
          }
          
        ]
      }
    ],
    
  },
    
  
]
const routesMap={
  login:{
    auth:false,
    base:'/login',
    path:'/login',
    component:Login,
  },
  home:{
    auth:true,
    base:'/home',
    path:'/home',
    component:Home,
  },
  applylist:{
    auth:true,
    base:'/applylist',
    path:'/applylist/:organization',
    // component:ApplyList,
  },
  applydetail:{
    auth:true,
    base:'/applydetail',
    path:'/applydetail/:id',
    // component:ApplyDetail,
  },
  system:{
    auth:true,
    base:'/system',
    path:'/system',
    // component:community,
    children:{
      query:{
        path:'/system/query',
        // component:Query,
        
      },
      beforeloan:{
        path:'/system/query',
        // component:Query,
        children:{
          summary:{
            path:'/system/summary',
            // component:Query
          },
          myorders:{
            path:'/system/myorders',
            // component:myorders
          }    
        }
      },
      myorders:{
        path:'/system/myorders',
        //component:myorders
      },
      orderdetails:{
        path:'/system/orderdetails/:id',
        component:OrderDetails
      }
    }
  },
  blacklist:{
    auth:true,
    base:'/blacklist',
    path:'/blacklist',
    // component:community,
    children:{
      list:{
        auth:true,
        path:'/blacklist/list',
        component:BlacklistList
      },
      add:{
        auth:true,
        path:'/blacklist/add',
        component:BlacklistAdd
      }
    }
  },

};

let routesUrlMap={};
function getRoutesUrlMap(routes){
  
  routes.map((value,index)=>{
    // 
    if(value.routes){
      getRoutesUrlMap(value.routes)
    }else{
      routesUrlMap[value.path]=value;
    }
  })
}
getRoutesUrlMap(routes);



export {
  routes,
  routesMap,
  routesUrlMap
}



