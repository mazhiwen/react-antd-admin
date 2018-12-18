import axios from 'axios';

import {notification } from 'antd';
import { authToken, authMobile,xMerchantId,API,XPARTNERCODE} from 'configs';
import localForage from './localForage';

const axiosInstance=axios.create({
    baseURL:'http://localhost:3000'

});

const { prefix, iamPrefix } = API[process.env.NODE_ENV];
function isHttpUrl(input) {
  return /^https?:\/\//.test(input);
}
function isIamUrl(input) {
  return /^(sso|iam|iam-.*)\//.test(input);
}
async function request(config) {
  // be sure each request use latest authToken && authMobile
  
  config.headers[authToken]=await localForage.getItem(authToken);
  config.headers[authMobile]=await localForage.getItem(authMobile);
  config.headers[xMerchantId]=await localForage.getItem(xMerchantId);
  config.headers[XPARTNERCODE]=await localForage.getItem(XPARTNERCODE);
  
  const input = config.url;
  // absolute remote url
  if (isHttpUrl(input)) config.url = input;

  // iam server
  else if (isIamUrl(input)) config.url = `${iamPrefix}${input}`;

  // current server
  else config.url = `${prefix}${input}`;
  return config;
}
function useOrigin(res) {
  return res.config.useOrigin;
}
function requestError(rejection) {
  return useOrigin(rejection)
    ? Promise.reject(rejection)
    : Promise.reject(rejection.data);
}


axiosInstance.defaults.timeout = 2500;
axiosInstance.interceptors.request.use(request, requestError);

axiosInstance.interceptors.response.use( 
  (res)=> {
    // Do something with response data
    if(res.data.status!==200){
        notification['error']({
            message:'提示',
            description:res.data.message
        });
      return Promise.reject(res);  
    }else{
      return res.data;
    }
    
  },  
  (error)=> {
    // Do something with response error
    return Promise.reject(error);
  }
);

export {axiosInstance as axios };
