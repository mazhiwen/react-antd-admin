import * as React from 'react';
import {
  Form
} from 'antd';

import {
  axios
} from 'utils';
import{
  LinkAPI
}from 'configs';
export default Form.create()(class extends React.Component{

  constructor(props){
    super(props);
    this.state={

    };

  }
  componentDidMount(){
    axios.post(`v1/operator/getRuleToken`)
      .then((res)=>{
        let result=res.result;
        const {token} =result;
        let user=result.user;
        const {department,email,id,mobile}=user;
        let url=`${LinkAPI[process.env.API_ENV]['/rule/configs']}token=${encodeURI(token)}&department=${department}&email=${email}&id=${id}&mobile=${mobile}&role=${user.role.name}&roleId=${user.role.id}`;
        console.log(url);
        let win=window.open(url, '_blank');
        win.focus();  
      })
       
    
  }
  render(){
    return(
      <div>

      </div>
    )
  }
}
)






