import * as React from 'react';
import {
  Form,Row,Button,Icon,notification,Modal,
  Col,Anchor,Card,Table,List,Input,Radio
} from 'antd';

import {
  axios,dataFormat,commonRequest,historyPush
} from 'utils';
import {
  ProcessStatus,ResultStatus,approvalStatusMap,
} from 'configs';

import moment from 'moment';
const FormItem=Form.Item;
const ButtonGroup = Button.Group;



const {Fragment} = React;




const AddContactModal=Form.create()(
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
        isShowModal, onCancel, form,
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
          visible={isShowModal}
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
class LoanList extends React.Component{

  constructor(props){
    super(props);
    this.state={
      tableLoading:false,
      data:[],
    };

    this.baseColumns=[
      {
        title: '学校',
        dataIndex: 'name',
      },
      {
        title: '学位',
        dataIndex: 'degree',
      },
      {
        title: '入学日期',
        dataIndex: 'mobile',
      },
      {
        title: '毕业时间',
        dataIndex: 'position',
      },
      {
        title: '学校地址',
        dataIndex: 'company',
      } 
      
    ];
  }

  
  componentDidMount(){
    
  }
  render(){

    const {
      tableLoading,
    }=this.state;
    const {
      educations
    } = this.props.data;




    return(
      <Fragment>
        <Card
          title="教育信息"
        >        
          <Table
            loading={tableLoading} rowKey="degree"
            // rowKey="degree"
            columns={this.baseColumns} dataSource={educations}
            bordered size="small" pagination={false}
          />         
        </Card>
      </Fragment>
    )
  }
}

export default Form.create()(LoanList)





