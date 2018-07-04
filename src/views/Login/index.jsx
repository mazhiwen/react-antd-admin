import * as React from 'react';
import './index.less';
import {Card, Form, Icon, Input, Button, Checkbox,notification } from 'antd';
// import { FormComponentProps } from 'antd/lib/form';
import {  connect } from 'react-redux';
import localForage from '../../utils/localForage';
import {axios} from '../../utils/axios';

class LoginOrigin extends React.Component {
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
        
        axios.post('/users/login',{
          account:values.account,
          password:values.password
        })
          .then(res=> {
            
            localForage.setItem('account',values.account);
            localForage.setItem('password',values.password);
            localForage.setItem('token',res.data.token);
            // this.context.router.history.push("/home");
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
  render(){
    
    
    
    // const {value} = this.props;
    const { getFieldDecorator } = this.props['form'];
    return(
      <div className="login">
        <Card>
          
          <Form onSubmit={this.handleLogin} className="login-form">
            <Form.Item>
              {getFieldDecorator('account', {
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







const Login = connect(mapStateToProps,mapDispatchToProps)(Form.create()(LoginOrigin));
// const Login = Form.create()(LoginOrigin);
export default Login