import * as React from 'react';
import { Route,Redirect } from 'react-router-dom'
import {
  Layout,Dropdown,Menu,Icon,
  Form,Modal,Input,notification
} from 'antd';
import {localForage,axios} from 'utils';
import { 
  authToken,
} from 'configs';
const FormItem=Form.Item;


export default Form.create()(
  class extends React.Component{
    setPassword=()=>{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          axios.post('admin/admin', {
            // oldPassword: md5(values.oldPassword),
            // password: md5(values.newPassword),
            isUpdate:1
          })
          .then((res)=>{
            notification['success']({
              message:'密码已更新',
              description:''
            });
          })
        }
      })
      
    }
    
    render(){
      const {
        isShowPWDModal, onCancel, form,
      } = this.props;
      const { getFieldDecorator,getFieldValue,validateFields} = form;
      const newPasswordValidator = (rule, value, callback) =>{
        if (!value) {
          callback(new Error('请输入新密码'));
        } else {
          if (getFieldValue('newPassword') !== '') {
            validateFields(['newPasswordConfirm']);
          }
          callback();
        }
      }
      const newPwdconVal = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入新密码'));
        } else if (value !== getFieldValue('newPassword')) {
          callback(new Error('输入内容与新密码不一致!'));
        } else {
          callback();
        }
      };
      return(
        <Modal
          visible={isShowPWDModal}
          title="修改密码"
          okText="确认"
          onCancel={onCancel}
          onOk={this.setPassword}
        >
          <Form layout="vertical">
            <FormItem label="密码">
              {getFieldDecorator('oldPassword', {
                rules: [{required: true, message: '旧密码不能为空', tragger: 'blur'}],
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label="新密码">
              {getFieldDecorator('newPassword', {
                rules: [
                  {required: true, validator: newPasswordValidator, tragger: 'blur'}
                ]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label="确认新密码">
              {getFieldDecorator('newPasswordConfirm', {
                rules: [
                  {required: true, validator: newPwdconVal, tragger: 'blur'}
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