import * as React from 'react';
import {
  Form, Button,Row,
  Col,DatePicker,Card,Input,
  notification,Radio
} from 'antd';
import {axios,historyPush} from 'utils';
import moment from 'moment';
import {withRouter} from "react-router-dom";

const  FormItem =Form.Item;
const { TextArea } = Input;
const RadioGroup=Radio.Group;

const RadioButton=Radio.Button;
const {Fragment} = React;

export default withRouter(Form.create()(class extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isHangUp:null
    }
  }


  submit = ()=>{    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.applicationId=this.props.data.applicationId;
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

  hangUp=(applicationId)=>{
    axios.put(`v1/allot/application/hang/${this.props.data.applicationId}`)
      .then( (res)=> {
        const {isHangUp} =this.state;
        notification['success']({
          message:'提示',
          description:isHangUp?'解挂成功':'挂起成功'
        });
        this.setState({
          isHangUp:!isHangUp
        })
      })
  }
  // static getDerivedStateFromProps(nextProps, prevState){
  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.data.applicationId&&(prevProps.data.hangUp!==this.props.data.hangUp)){
      this.setState({
        isHangUp:this.props.data.hangUp
      })
    }
  }
  componentDidMount(){
    this.setState({
      isHangUp:this.props.data.hangUp
    })
  }
  render(){
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      data,showButton,authList
    } =this.props;
    const {
      isHangUp
    } =this.state;
    let hangbtn='';
    if(isHangUp===true){
      hangbtn='取消挂起'
    }else{
      hangbtn='挂起'
    }
    return (
      <Card
        title="提报信息"
        extra={showButton&&
          <Fragment>
            {authList.includes('system_beforeloan_applydetail_btnHang')&&<Button onClick={this.hangUp.bind(this,true)}
              size="small"
            >
              {hangbtn}
            </Button>}
            {authList.includes('system_beforeloan_applydetail_btnAddblack')&&<Button 
              onClick={historyPush.bind(this,{pathname:`/blacklist/add/${data.applicationId}`})}
              size="small" type="danger"
              style={{
                marginLeft:'0.5rem'
              }}
            >
              添加黑名单
            </Button>}
          </Fragment>
        }
      >
        <table className="gird-table">
          <tbody>
            <tr>
              <th>提报人</th>
              <td>{data.subInfo.subUser}</td>
            </tr>
            <tr>
              <th>提报理由/系统提报码</th>
              <td>{data.subInfo.subReason}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    )
  }
}
)
)

