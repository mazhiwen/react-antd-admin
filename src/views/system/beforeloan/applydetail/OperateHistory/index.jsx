import * as React from 'react';
import {
  Form,Row,Button,Icon,notification,Modal,
  Col,Anchor,Card,Badge,List,Input
} from 'antd';
import {axios,utiDate} from 'utils';
import moment from 'moment';


const ListItem = List.Item;


export default Form.create()(class ComponentInstance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      approvalHistories:[]
    }
  }

  getData = ()=>{
    axios.get(`v1/allot/${this.props.applicationId}/history/get`)
    .then( (res) =>{
      // let data=res.data;
      // delete data.applicationId;
      // delete data.id;
      // data.companyRegisterTime=moment(data.companyRegisterTime);
      // data.joinTime=moment(data.joinTime);
      // data.telVerOneselfAt=moment(data.telVerOneselfAt);
      // data.telVerCompanyAt=moment(data.telVerCompanyAt);
      // data.telVerLiaisonAt=moment(data.telVerLiaisonAt);
      // this.props.form.setFieldsValue(data);
    })
  }
  submit = ()=>{    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.applicationId=this.props.applicationId;
        values.companyRegisterTime=moment(values.companyRegisterTime).format("YYYY-MM-DD HH:mm:ss");
        values.joinTime=moment(values.joinTime).format("YYYY-MM-DD HH:mm:ss");
        values.telVerOneselfAt=moment(values.telVerOneselfAt).format("YYYY-MM-DD HH:mm:ss");
        values.telVerCompanyAt=moment(values.telVerCompanyAt).format("YYYY-MM-DD HH:mm:ss");
        values.telVerLiaisonAt=moment(values.telVerLiaisonAt).format("YYYY-MM-DD HH:mm:ss");
        axios.post('approvers/approvalInfo',values).then(function (res) {
          notification['success']({
            message:'操作成功',
            description:'保存成功'
          });
        })
      }
    });
  }

  hangUp=()=>{

  }
  componentDidMount(){
    
    this.getData();
  }
  render(){
    const{
      approvalHistories
    }=this.state;
    const {
      getFieldDecorator
    } = this.props.form;
    return (
      <Card
        title="操作历史"
      >
        <List
          // bordered={true}
          itemLayout="vertical"
          className="history_wrap"
          dataSource={approvalHistories}
          renderItem={value=>(
            <ListItem>
              <p className="history_badge">
                <Badge count={value.approvalStatus} style={{ backgroundColor: '#5E87B0' }} />
                <Badge count={value.subUser} style={{ backgroundColor: '#5E87B0' }} />
                <Badge count={value.processName} style={{ backgroundColor: '#5E87B0' }} />
                
                <Badge count={value.resultDecision} style={{ backgroundColor: '#5cb85c' }} />
                <Badge count={value.resultStatus} style={{ backgroundColor: '#5cb85c' }} />
                
                <Badge count={value.resultBackReason} style={{ backgroundColor: '#5cb85c' }} />
                {/* <span >{parseOperatorName(value.operator)}</span> */}
                <span>{utiDate.toDateTime(value.subDate)}</span>
                <span>{utiDate.toDateTime(value.createAt)}</span>
              </p>
              <div className="history_content">
                <div>
                  <strong>审批金额:</strong>
                  <span>{'￥' + value.amount}</span>
                  <strong>系统提报码:</strong>
                  <span>{'￥' + value.codes}</span>
                  <strong>提报理由:</strong>
                  <span>{'￥' + value.subReason}</span>
                  
                </div>
              </div>
              <p>{value.resultTxt}</p>
            </ListItem>
          )}
        />
      </Card>
    )
  }
}
)


