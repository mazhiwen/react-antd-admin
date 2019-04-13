import * as React from 'react';
import {
  Form, 
  Col,Icon,Card,
} from 'antd';

export default class PhoneRecordOrigin extends React.Component{
  // constructor(props){
  //   super(props);
  // }

  componentDidMount(){
  }
  render(){
    const {
      data,approver,proposer,creditLine
    } = this.props.data;
    const customerTips=data.customerTips||[];
    return (
      <Card
        title="客服提示"
      >
        <table className="gird-table ">
          <tbody>
            <tr>
              <th></th>
              <td>{}</td>
            </tr>
            <tr>
              <th></th>
              <td>{}</td>
            </tr>
           
          </tbody>
        </table>
        {
          customerTips.map((value,index)=>
           <div>
             {value.customerName}{value.tipDate}{value.remark}
           </div> 
          )
        }
      </Card>
    )
  }
}


