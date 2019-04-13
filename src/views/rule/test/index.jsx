import * as React from 'react';
import {
  Form
} from 'antd';
import {
  LinkAPI
} from 'configs';

export default Form.create()(class extends React.Component{

  constructor(props){
    super(props);
    this.state={

    };

  }
  
  componentDidMount(){
    


    window.onload=function(){
      window.frames[0].postMessage('getcolor',new URL(LinkAPI[process.env.API_ENV]['/rule/test']).origin);
    }
    
  }
  render(){
    return(
      <div>
        <iframe 
          className="common_ifame"
          src={LinkAPI[process.env.API_ENV]['/rule/test']}
        >
        </iframe>
      </div>
    )
  }
}
)












