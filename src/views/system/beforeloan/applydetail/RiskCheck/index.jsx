import * as React from 'react';
import {
  Form, Button,Row,Checkbox,
  Col,Select,Card,Input,
  notification,Radio
} from 'antd';
import {axios} from 'utils';
import moment from 'moment';
import {
  isAddBlackMap
} from 'configs';
const  FormItem =Form.Item;
const { TextArea } = Input;
const RadioGroup=Radio.Group;
const { Option } = Select;

const RadioButton=Radio.Button;

export default Form.create()(class extends React.Component{
  // constructor(props){
  //   super(props);
  // }

  getData = ()=>{
    axios.get(`v1/riskCheck/${this.props.applicationId}/info`)
    .then( (res) =>{
      let data=res.result;
      data.map((value,index)=>{
        delete value.name;
        delete value.code;
      })
      if(data[3]&&data[3].note){
        data[3].note=data[3].note.split(',');
      }
      console.log(data);
      this.props.form.setFieldsValue({
        list:data
      });
    })
  }
  onSubmit = ()=>{    
    this.props.form.validateFields((err, values) => {
      console.log(err);
      console.log(values);
      if (!err) {

        let applicationId=this.props.applicationId;
        values.applicationId=applicationId;
        if(values.list[0].status==='yes'&&!values.list[0].note){
          notification['error']({
            message:'提示',
            description:'请输入异常原因备注'
          });
          return;
        }
        if(values.list[1].status==='yes'&&!values.list[1].note){
          notification['error']({
            message:'提示',
            description:'请输入异常原因备注'
          });
          return;
        }
        if(values.list[2].status==='yes'&&!values.list[2].note){
          notification['error']({
            message:'提示',
            description:'请输入异常原因备注'
          });
          return;
        }
        if(values.list[3].status==='yes'&&values.list[3].note.length===0){
          notification['error']({
            message:'提示',
            description:'请输入异常原因备注'
          });
          return;
        }
        values.list[0].code="thirdQuery";
        values.list[1].code="pictureCheck";
        values.list[2].code="relationCheck";
        values.list[3].code="blackList";
        if(values.list[3].note){
          values.list[3].note=values.list[3].note.join(',');
        }
        console.log(values);
        axios.post('v1/riskCheck/add',values).then(function (res) {
          notification['success']({
            message:'提示',
            description:'保存成功'
          });
        })
      }
    });
  }
  
  noteValidator2 =(rule, value, callback) => {
    
    const {getFieldValue} =this.props.form;
    console.log(getFieldValue(`list[2].status`));
    if(getFieldValue(`list[2].status`)==='yes'&&!getFieldValue(`list[2].note`)){
      
        callback(new Error('请再次输入新密码'));
     
     
    } else {
      callback();
    }
  };

  componentDidMount(){
    this.getData();
  }
  render(){
    const {
      getFieldDecorator,getFieldValue
    } = this.props.form;
    const {
      disabled
    }=this.props;
    return (
      <Card
        title="风险排查"
        extra={
          <Button type="primary" size="small" onClick={this.onSubmit}
            disabled={disabled}
          >
          提交
          </Button>
        }
      >
        <Form 
        > 
          <FormItem
            style={{marginBottom:0}} 
            label="1.三方查询是否异常（百度、好搜、微信、支付宝）"
          >
            {getFieldDecorator('list[0].status',{
            })(
              <RadioGroup buttonStyle="solid" disabled={disabled}>
                <RadioButton value="yes">是</RadioButton>
                <RadioButton value="no">否</RadioButton>
                <RadioButton value="undo">未排查</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="异常原因备注" 
            style={{display:getFieldValue('list[0].status')==='yes'?'block':'none'}}
          >
            {getFieldDecorator('list[0].note',{
            })(
              <TextArea placeholder="请备注异常的原因" disabled={disabled}/>
            )}
          </FormItem>
          <FormItem
            style={{marginBottom:0}} 
            label="2.图片资料是否明显异常"
          >
            {getFieldDecorator('list[1].status',{
            })(
              <RadioGroup buttonStyle="solid" disabled={disabled}>
                <RadioButton value="yes">是</RadioButton>
                <RadioButton value="no">否</RadioButton>
                <RadioButton value="undo">未排查</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="异常原因备注"
            style={{display:getFieldValue('list[1].status')==='yes'?'block':'none'}}
          >
            {getFieldDecorator('list[1].note',{
            })(
              <TextArea disabled={disabled} placeholder="请备注异常的原因"/>
            )}
          </FormItem> 
          <FormItem
            style={{marginBottom:0}} 
            label="3.关联信息是否异常"
          >
            {getFieldDecorator('list[2].status',{
            })(
              <RadioGroup buttonStyle="solid" disabled={disabled}>
                <RadioButton value="yes">是</RadioButton>
                <RadioButton value="no">否</RadioButton>
                <RadioButton value="undo">未排查</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="异常原因备注"
            style={{display:getFieldValue('list[2].status')==='yes'?'block':'none'}}
          >
            {getFieldDecorator('list[2].note',{
            })(
              <TextArea disabled={disabled} placeholder="请备注异常的原因"/>
            )}
          </FormItem>  
          <FormItem 
            style={{marginBottom:0}} 
            label="4.是否加入黑名单"
          >
            {getFieldDecorator('list[3].status',{
            })(
              <RadioGroup disabled={disabled} buttonStyle="solid">
                <RadioButton value="yes">是</RadioButton>
                <RadioButton value="no">否</RadioButton>
                <RadioButton value="undo">未排查</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="请选择加黑信息的类型（可多选）"
            style={{display:getFieldValue('list[3].status')==='yes'?'block':'none'}}
          >
            {getFieldDecorator('list[3].note',{
              initialValue:[]
            })(
              <Checkbox.Group disabled={disabled} style={{ width: '100%' }}>
                {Object.entries(isAddBlackMap).map(([index,value])=>(
                  <Checkbox value={index} key={index}>{value}</Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </FormItem> 
        </Form>
      </Card>
    )
  }
}
)

