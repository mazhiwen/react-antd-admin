import * as React from 'react';
import {
  Form, Button,Row,
  Col,DatePicker,Card,Input,
  notification,Divider,Select
} from 'antd';
import {axios} from 'utils';
import moment from 'moment';
import {phoneRecordStatus} from 'configs';

const  FormItem =Form.Item;
const { TextArea } = Input;
const {Fragment} = React;



// 高阶做法
// export default function ({title,isShowInvestigateMark,headType}) {
//   return Form.create()(



export default  Form.create()(class extends React.Component{
    constructor(props){
      super(props);
      this.state={
        recordsKeys:[]
      }
    }

    getData = ()=>{
      axios.get('approvers/approvalInfo?applicationId='+this.props.applicationId)
      .then( (res) =>{
        let data=res.data;
        delete data.applicationId;
        delete data.id;
        data.companyRegisterTime=moment(data.companyRegisterTime);
        data.joinTime=moment(data.joinTime);
        data.telVerOneselfAt=moment(data.telVerOneselfAt);
        data.telVerCompanyAt=moment(data.telVerCompanyAt);
        data.telVerLiaisonAt=moment(data.telVerLiaisonAt);
        this.props.form.setFieldsValue(data);
      })
    }

    addRecord=()=>{
      const {recordsKeys }=this.state;
      const nextRecordsKeys = recordsKeys.concat(recordsKeys.length);
      this.setState({
        recordsKeys:nextRecordsKeys
      })
    }
    // static getDerivedStateFromProps(nextProps, prevState){
    //   let resState={};
    //   if(nextProps.records){
    //     let records=nextProps.records;
    //     let recordsKeys=[];
    //     records.map((value,index)=>{
    //       recordsKeys.push(index);
    //     })
    //     resState.recordsKeys=recordsKeys;
    //   }
    //   return resState;
    // }
    componentDidMount(){
      if(this.props.records){
        this.setRecords(this.props.records);
      }
    }
    setRecords(records){
      let recordsKeys=[];
      records.map((value,index)=>{
        recordsKeys.push(index);
      })
      this.setState({
        recordsKeys
      },()=>{
        this.props.form.setFieldsValue({recordsValues:records})
      })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      let records=this.props.records;
      if(records!==prevProps.records){
        this.setRecords(records);
      }
    }
    render(){
      const {
        telVerOneselfContent,records,disabled
      }=this.props;
      const {
        getFieldDecorator,getFieldValue
      } = this.props.form;
      const {
        recordsKeys,
      } = this.state;
      
      const {
        isShowInvestigateMark,headType,title
      } = this.props;
      let headTypeDom;
      if(headType==='add'){
        headTypeDom=(
          <Fragment>
            <Button type="primary" size="small" onClick={this.addRecord}>添加</Button>
            <Button type="primary" size="small" onClick={this.submit}>移除</Button>
          </Fragment>
        )
      }else if(headType==='selct'){
        headTypeDom=(
          <Fragment>
            <p>调查结果:未调查</p>
          </Fragment>
        )
      }else{
        headTypeDom=''
      }


      return (
        
        <Form 
          className="record_wrap"
        >
          <Card
            type="inner" size="small"
            title={title}
            extra={
              headTypeDom
            }
          >
            {recordsKeys.map((value,index)=><div key={index}>
              {index>0&&<Divider />}
              <Row gutter={8}>
                <Col span={8}>
                  <FormItem style={{width:'100%'}}>
                    {getFieldDecorator(`recordsValues[${index}].bridgeTime`,{
                      // initialValue:value.bridgeTime
                    })(
                      <DatePicker 
                        showTime disabled={disabled}
                        placeholder="拨打时间"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem >
                    {getFieldDecorator(`recordsValues[${index}].status`,{
                      // initialValue:value.status
                    })(
                      <Select disabled={disabled}
                      >
                        {Object.entries(phoneRecordStatus).map(([index,value])=>
                          <Select.Option key={index} value={index}>{value}</Select.Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem >
                    {getFieldDecorator(`recordsValues[${index}].customerNum`,{
                      // initialValue:value.customerNum
                    })(
                      <Input disabled={disabled} placeholder="电话号码"/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem>
                    {getFieldDecorator(`recordsValues[${index}].resultTxt`,{
                      // initialValue:value.resultTxt
                    })(
                      <TextArea disabled={disabled} placeholder="请输入拨打内容"/>
                    )}
                  </FormItem>    
                </Col>
              </Row>
              
            </div>)}  
          </Card>
          {isShowInvestigateMark&&<Fragment>
            <br/>
            <Card
              type="inner" size="small"
              title="备注"
            >
              <FormItem>
                {getFieldDecorator('telVerOneselfContent',{
                  initialValue:telVerOneselfContent
                })(
                  <TextArea disabled={disabled} placeholder="请输入调查备注内容"/>
                )}
              </FormItem>
            </Card>
          </Fragment>}
                      
          
          
        </Form>
      )
    }
  }
)
// }


