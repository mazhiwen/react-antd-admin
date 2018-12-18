import * as React from 'react';
import {Card, Form, Icon, Input, Button, Checkbox,notification } from 'antd';
// import { FormComponentProps } from 'antd/lib/form';
import {  connect } from 'react-redux';
import { authToken, authMobile,xMerchantId,API,XPARTNERCODE,partnerCode} from 'configs';

import {axios,localForage} from 'utils';
import {withRouter} from "react-router-dom";
class ComponentInstance extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isLogin:true
    };
  }

  handleLogin = (e) => {
    e.preventDefault();
    this.props["form"].validateFields((err, values) => {
      if (!err) { 
        axios.post('/admin/login',{
          mobile:values.mobile,
          password:values.password
        })
          .then(res=> {
            
            // localForage.setItem('mobile',values.mobile);
            // localForage.setItem('password',values.password);
            // localForage.setItem('token',res.data.token);
            // this.props.history.push('/home');
          })
          .catch((res)=>{
            return false;
          });
      }
    });
  }
  handleRegister = (e) => {    
    this.props["form"].validateFields((err, values) => {
      if (!err) {        
        axios.post('/users/create',values)
          .then( res=> {
            notification['success']({
              message:'提示',
              description:'注册成功'
            });
            this.setState({
              isLogin:true
            });
          })
          .catch((res)=>{
            return false;
          });  
      }
    });
  }
  registHandler=()=>{
    this.setState({
      isLogin:false
    });
  }

  componentDidMount(){
    let params = new URLSearchParams(this.props.location.search);
    localForage.setItem(XPARTNERCODE,params.get(partnerCode));

  }
  render(){
    // const {value} = this.props;
    const { getFieldDecorator } = this.props['form'];
    return(
      <div className="login">
        <Card>
          
          <Form onSubmit={this.handleLogin} className="login-form">
            <Form.Item>
              {getFieldDecorator('mobile', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </Form.Item>
            {this.state['isLogin']?
            (
              <Form.Item>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>Remember me</Checkbox>
                )}
                <a className="login-form-forgot" href="">Forgot password</a>
                <Button type="primary" htmlType="submit" className="login-form-button">登陆</Button>
                <Button type="primary" style={{marginLeft:8}} onClick={this.registHandler}>注册</Button>
              </Form.Item>
            ):
            (
              <Form.Item>
                <Button type="primary" onClick={this.handleRegister} className="login-form-button">确认</Button>
              </Form.Item>
            )}
          </Form>
          

        </Card>
      </div>
      
    )
  }
  
}


function mapStateToProps(state) {
  return {
      value: state.count
  };
}

function mapDispatchToProps(dispatch) {
  return {
      onIncreaseClick: () => dispatch({
        type: 'increase'
      })
  };
}







const Login = withRouter(connect(mapStateToProps,mapDispatchToProps)(Form.create()(ComponentInstance)));
// const Login = Form.create()(ComponentInstance);
export default Login