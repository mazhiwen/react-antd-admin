import * as React from 'react';
import { 
} from 'react-router-dom'
import {
  Form,Modal,Input,notification
} from 'antd';
import {localForage,axios} from 'utils';
import { 
  
} from 'configs';
const FormItem=Form.Item;


export default Form.create()(
  class extends React.Component{
    onOk=()=>{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          let params=[];
          Object.entries(values).forEach(([key,value])=>{
            params.push({
              code:key,
              val:value
            })
          })
          axios.post('v1/config/allotNumLimit', {
            
            list:params
            
          })
          .then((res)=>{
            notification['success']({
              message:'操作成功',
              description:''
            });
          })
        }
      })
      
    }
    componentDidMount(){
      
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      let visible=this.props.visible;
      if(visible!==prevProps.visible){
        if(visible){
          axios.get('v1/config/allotNumLimit')
            .then((res)=>{
              let data=res.result;
              let fieldsValue={};
              data.map((value,index)=>{
                fieldsValue[value.code]=value.val
              })
              this.props.form.setFieldsValue(fieldsValue);
            })
        }
      }
    }
    render(){
      const {
        visible, onCancel, form,
      } = this.props;
      const { getFieldDecorator,getFieldValue,validateFields} = form;
      const newPasswordValidator = (rule, value, callback) =>{
        if (!value) {
          callback(new Error('请输入新密码'));
        } else {
          // if (getFieldValue('newPassword') !== '') {
          //   validateFields(['newPasswordConfirm']);
          // }
          callback();
        }
      }

      return(
        <Modal
          visible={visible} maskClosable={false}
          title="任务取件规则"
          okText="确认"
          onCancel={onCancel}
          onOk={this.onOk}
        >
          <Form layout="vertical">
            <FormItem label="每人最大分单量（每人的反欺诈未出结果单量）">
              {getFieldDecorator('allotNumMax', {
                rules: [{required: true, message: '旧密码不能为空', tragger: 'blur'}],
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label="每人最大可挂起单数">
              {getFieldDecorator('upNumMax', {
                rules: [
                  {required: true, validator: newPasswordValidator, tragger: 'blur'}
                ]
              })(
                <Input/>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)