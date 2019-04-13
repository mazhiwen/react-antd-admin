import * as React from 'react';
import {
  Form, Badge,Select,
  Card,Input,
  List,notification
} from 'antd';
import {axios,utiDate,parseOperatorName} from 'utils';


const  FormItem =Form.Item;
const { TextArea } = Input;
const ListItem = List.Item;
const { Option } = Select;
const {Fragment} = React;


export default Form.create()(class VerifyRecords extends React.Component{
  constructor(props){
    super(props);
    this.state=({
      operation:'',
      operationList:[
        {code: "accept", name: "退回"},
        {code: "reject", name: "拒绝"}
      ],
    })
  }


  render(){
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      approvalHistories
    } = this.props;
    const {
    }=this.state;
    return (
      <Card
        type="inner"
        title="审批记录"
      >
        <List
          // bordered={true}
          itemLayout="vertical"
          className="history_wrap"
          dataSource={approvalHistories}
          renderItem={value=>(
            <ListItem>
              <p className="history_badge">
                <Badge count={value.action} style={{ backgroundColor: '#5E87B0' }} />
                <Badge count={value.operation} style={{ backgroundColor: '#5cb85c' }} />
                <span >{parseOperatorName(value.operator)}</span>
                <span>{utiDate.toDateTime(value.createdAt)}</span>
              </p>
              <div className="history_content">
                {value.amount>0&&<div>
                  <strong>审批金额:</strong>
                  <span>{'￥' + value.amount}</span>
                </div>}
                {value.operation === '通过'&&<div>
                  <strong>审批期限:</strong>
                  <span>{value.tenor}</span>
                </div>}
                {value.reasonCode&&value.reasonCode.indexOf('D') !== 0&&<div>
                  <strong>原因代码:</strong>
                  <span>{value.reasonCode}</span>
                </div>}
              </div>
              {value.comment&&<p>{value.comment}</p>}
            </ListItem>
          )}
        />
        
      </Card>
    )
  }
}
)

