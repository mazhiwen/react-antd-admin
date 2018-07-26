import * as React from 'react';
import {Button, Form,Input,DatePicker} from 'antd';
import {axios} from '../../../utils/axios';
import { withRouter } from 'react-router-dom';


const FormItem=Form.Item;
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 },
};
class GameListOrigin extends React.Component{
  constructor(props){
    super(props);
    this.state={
      gameListData:[]
    }
  }
  getGameList=()=>{
    axios.get('/game/list').then(res=>{
      
      this.setState({
        gameListData:res.data
      });
      
    })
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        axios.put('/game/create',values).then((r)=>{

        });
        console.log('Received values of form: ', values);
      }
    });
  }
  handleAdd=()=>{
    this.props.history.push('/game/add');
  }
  componentDidMount(){
    this.getGameList();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return(

      <div>
        <Button onClick={this.handleAdd}>list</Button>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="名称" {...formItemLayout}>
            {
              getFieldDecorator('name',{
                rules:[
                  {required: true, message: 'Please input name!'}
                ]
              })(<Input style={{width:400}}/>)
            }
          </FormItem>  
          <FormItem label="研发商" {...formItemLayout}>
            {
              getFieldDecorator('developer',{
                rules:[
                  {required: true, message: 'Please input your E-mail!'}
                ]
              })(<Input style={{width:400}}/>)
            }
          </FormItem>  
          <FormItem label="发行日期" {...formItemLayout}>
            {
              getFieldDecorator('releaseDate',{
                rules:[]
              })(<DatePicker/>)
            }
          </FormItem>
          <FormItem wrapperCol={{offset:2}}>
            <Button type="primary" htmlType="submit">提交</Button>  
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default withRouter(Form.create()(GameListOrigin))