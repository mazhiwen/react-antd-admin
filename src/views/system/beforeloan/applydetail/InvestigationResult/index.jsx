import * as React from 'react';
import {
  Form, Button,Select,
  Card,Input,
  InputNumber,notification
} from 'antd';
import {axios,commonRequest} from 'utils';

import {resultDecisionList} from 'configs';

const  FormItem =Form.Item;
const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;
const {Fragment} = React;



export default Form.create()(
class extends React.Component{
  constructor(props){
    super(props);
    this.state=({
      backReasonList:[],
      rejectReasonList:[],
      operation:'',
      operationList:[
        {code: "back", name: "退回"},
        {code: "reject", name: "拒绝"}
      ],
      tenorsDataList:[
        "1M", "2M", "3M", "4M", "5M", "6M", "9M", "12M", "18M", "24M"
      ],
    })

    
  }
  operationChange=(operation)=>{
    this.setState({
      operation
    })
  }
  submit=()=> {
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if (!err) {
        let {
          resultDecision,
          resultStatus,
          reasonCodeList,
          resultBackReason,
          resultTxt
        } = values;
        let params = {
          resultDecision,
          applicationId:this.props.applicationId,
          resultStatus:resultStatus,
          resultBackReason,
          resultTxt
        };
        
        if(resultStatus==='reject'){
          params.resultBackReason = reasonCodeList.join(',');
        }
        axios.post(`v1/allot/application/submit`,params)
          .then(function(res) {
            notification['success']({
              message:'操作成功',
              description:'申请单已提交，如需了解后续结果，请关注我的单—>我的历史单'
            });
          },function(err) {
          })
      }
    });
  }
  componentDidMount(){
    
    Promise.all([
      commonRequest.getResultBackReason(), 
      commonRequest.getResultRejectReason()
    ])
    .then((values)=> {
      this.setState({
        backReasonList:values[0],
        rejectReasonList:values[1],
      })
    }); 
  }
  render(){
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      operation,operationList,backReasonList,rejectReasonList
    }=this.state;
    const {
      disabled
    }=this.props;

    const RejectReasonSelect=(
      <Select style={{width:100}}
        disabled={disabled}
      >
        {
          rejectReasonList.map((value,index)=>(
            <Option value={value.code} key={value.id}>{value.code}</Option>
          ))
        }
      </Select>
    )
    return (
      <Card
        type="inner"
        title={`调查结果`}
        extra={<Button type="primary"  size="small" onClick={this.submit}>提交</Button>}
      >
        <Form 
          className="antdformitem_flexwrap"
        >
          <FormItem label="操作" 
          >
            {getFieldDecorator('resultStatus')(
              <Select disabled={disabled}
                onChange={this.operationChange}
              >
                {
                  operationList.map((value,index)=>(
                    <Option value={value.code} key={index}>{value.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          {operation==='back'&&<FormItem  label="退回理由"
          >
            {getFieldDecorator('resultBackReason',{
            })(
              <Select
                disabled={disabled}
              >
                {
                  backReasonList.map((value,index)=>(
                    <Option value={value.code} key={value.code}>{`${value.first}-${value.second}`}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>}
          {operation==='back'&&<FormItem  label="决策结论"
          >
            {getFieldDecorator('resultDecision',{
            })(
              <Select
                disabled={disabled}
              >
                {
                  Object.entries(resultDecisionList).map(([index,value])=>(
                    <Option value={index} key={index}>{value}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>}      
          {operation==='reject'&&<Fragment>
            <FormItem className="reasoncode_wrap" label="原因代码">
              <InputGroup compact>
                <FormItem >
                  {getFieldDecorator('reasonCodeList[0]')(
                    RejectReasonSelect
                  )}
                </FormItem>
                <FormItem >
                  {getFieldDecorator('reasonCodeList[1]')(
                    RejectReasonSelect
                  )}
                </FormItem>
                <FormItem >
                  {getFieldDecorator('reasonCodeList[2]')(
                    RejectReasonSelect
                  )}
                </FormItem>
              </InputGroup>
            </FormItem>
          </Fragment>}
          <FormItem label="备注">
            {getFieldDecorator('resultTxt')(
              <TextArea disabled={disabled} placeholder="请输入调查结果备注"/>
            )}
          </FormItem>
        </Form>
      </Card>
    )
  }
}
)

