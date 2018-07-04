import axios from 'axios';

import {notification } from 'antd';

const axiosInstance=axios.create({
    baseURL:'http://localhost:3000'

});
axiosInstance.defaults.timeout = 2500;
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
