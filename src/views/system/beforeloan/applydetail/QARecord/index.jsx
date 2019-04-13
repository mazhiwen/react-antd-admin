import * as React from 'react';
import {
  Form, Button,Select,
  Card,Input,
  InputNumber,notification
} from 'antd';
import {axios,commonRequest} from 'utils';


const  FormItem =Form.Item;
const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;
const {Fragment} = React;


export default Form.create()(class extends React.Component{
  constructor(props){
    super(props);
    this.state=({
      operation:'',
      operationList:[
        {code: "wrong", name: "差错"},
        {code: "right", name: "无差错"}
      ],
      QualityCodeList:[],
    })
  }
  operationChange=(operation)=>{
    this.setState({
      operation
    })
  }
  submit=()=> {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          ResultStatus,
          resultCodes,
          resultTxt
        } = values;
        let params = {
          applicationId:this.props.applicationId,
          ResultStatus,
          resultCodes,
          resultTxt
        };
        // if(ResultStatus==='reject'){
        //   params.resultBackReason = reasonCodeList.join(',');
        // }
        axios.post(`v1/quality/add`,params)
          .then(function(res) {
            notification['success']({
              message:'提示',
              description:'操作成功'
            });
          },function(err) {
          })
      }
    });
  }
  componentDidMount(){
    Promise.all([
      commonRequest.getQualityCodeList(), 
    ])
    .then((values)=> {
      this.setState({
        QualityCodeList:values[0],
      })
    }); 
  }
  render(){
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      applyData
    } = this.props;
    const {
      operation,operationList,QualityCodeList
    }=this.state;
    return (
      <Card
        title={`质检记录`}
        // title={`初审${applyData.approver}`}
        extra={<Button type="primary"  size="small" onClick={this.submit}>提交</Button>}
      >
        <Form 
          className="antdformitem_flexwrap"
        >
          <FormItem label="操作" 
          >
            {getFieldDecorator('resultStatus')(
              <Select
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
          {operation==='wrong'&&<FormItem 
          >
            {getFieldDecorator('resultCodes',{
            })(
              <Select>
                {
                  QualityCodeList.map((value,index)=>(
                    <Option value={value.code} key={value.code}>{value.info}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>}
          <FormItem label="备注">
            {getFieldDecorator('resultTxt')(
              <TextArea placeholder="请输入质检备注"/>
            )}
          </FormItem>
        </Form>
      </Card>
    )
  }
}
)

