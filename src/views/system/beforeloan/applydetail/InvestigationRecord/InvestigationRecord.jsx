import * as React from 'react';
import {
  Form, Button,Row,
  Col,DatePicker,Card,Input,
  notification
} from 'antd';
import {axios} from 'utils';
import moment from 'moment';
import PhoneRecord from '../PhoneRecord/PhoneRecord';
const  FormItem =Form.Item;
const { TextArea } = Input;


export default Form.create()(class extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isBubmit:false,
      records:[]
    }
    this.recordRef = React.createRef();
  }

  getData = ()=>{
    axios.get(`v1/callNote/${this.props.applicationId}/info`)
      .then( (res) =>{
        let data=res.result;
        let list=data.list;
        list.map((value,index)=>{
          delete value.applicationId;
          delete value.id;
          delete value.voiceUid;
          list[index].bridgeTime=moment(value.bridgeTime);
        })
        this.setState({
          records:list,
          // records:[{
          //   customerNum:123
          // }],
          telVerOneselfContent:data.note
        });

      });
    // axios.get(`v1/riskCheck/${this.props.applicationId}/info`)
    //   .then( (res) =>{
    //     let data=res.result;
    //     let telVerOneselfContentArr = data.filter((value,index)=>{
    //       return value.code=='checkNote';
    //     });
    //     let telVerOneselfContent='';
    //     if(telVerOneselfContentArr.length>0){
    //       telVerOneselfContent=telVerOneselfContentArr[0].note;
    //     }
    //     this.setState({
    //       telVerOneselfContent
    //     });
    //   })
  }
  submit = ()=>{
    this.recordRef.current.validateFields((err, values) => {
      console.log(values);
      if (!err) {
        // values.applicationId=this.props.applicationId;
        let applicationId=this.props.applicationId;
        // values.companyRegisterTime=moment(values.companyRegisterTime).format("YYYY-MM-DD HH:mm:ss");
        
        let list=values.recordsValues;
        list.map((value,index)=>{
          list[index].bridgeTime=moment(value.bridgeTime).format("YYYY-MM-DD HH:mm:ss")
        })
        Promise.all([
          axios.post('v1/callNote/add',{
            applicationId,
            list,
            note:values.telVerOneselfContent
          }),
          // axios.post(`v1/riskCheck/${applicationId}/addone`,{
          //   code:'checkNote',
          //   note:values.telVerOneselfContent
          // })
        ])
        .then((values)=> {
          // 添加applicationid
          // 
          // let areas=values[0];
          notification['success']({
            message:'操作成功',
            description:'保存成功'
          }); 
        }); 
        
        
      }
    });
  }


  componentDidMount(){
    this.getData();
  }
  render(){
    const {
      isBubmit,records,telVerOneselfContent
    }=this.state;
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      disabled
    } = this.props;
    // const PhoneRecordInstance=PhoneRecord({
    //   title:"电话拨打记录",
    //   isShowInvestigateMark:true,
    //   headType:'add'
    // });
    return (
      <Card
        title="调查记录"
        extra={<Button type="primary" size="small" onClick={this.submit}>保存</Button>}
      >
        <PhoneRecord
          disabled={disabled}
          isBubmit={isBubmit} ref={this.recordRef}
          title="电话拨打记录" isShowInvestigateMark={true} headType="add"
          records={records} telVerOneselfContent={telVerOneselfContent}
        />
      </Card>
    )
  }
}
)

