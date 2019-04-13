import * as React from 'react';
import {
  Form,Row,Button,Affix,Input,Modal,
  Col,Anchor,Card,Badge,Tabs, Icon
} from 'antd';
import { Link } from 'react-router-dom'

import {
  axios,utiDate,commonRequest,localForage,openInNewTab
} from 'utils';

import InvestigationResult from './InvestigationResult';
import InvestigationRecord from './InvestigationRecord/InvestigationRecord';
import Documents from './Documents';
import RiskCheck from './RiskCheck';
import HangupInfo from './HangupInfo';
import OperateHistory from './OperateHistory';
import Liaisons from './Liaisons';
import Educations from './Educations';
import QARecord from './QARecord';
import PersonalInfo from './PersonalInfo';
import RiskCheckInfo from './RiskCheckInfo';
import ServiceTips from './ServiceTips';
import {  connect } from 'react-redux';

import VerifyRecords from './VerifyRecords';
import {
  wedefendDecisionList,phone

} from 'configs';
// import { ReactComponent as BaiduSvg} from 'images/baidu.svg'; 
// import BaiduSvg from 'images/baidu.svg';
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;





export default connect(
  (state) =>{
    return{
      ViewsList:state.ViewsList.data
    }
  }
)(Form.create()(
class applydetail extends React.Component{
  constructor(props){
    super(props);
    this.state={
      data:{
        approvalTips:[],
        approvalHistories:[]
      },
      applicationInfo:{

        subInfo:{}
      },
      creditLine:{},
      proposer:{
        
      },
      approver:{},
      id:props.match.params.id,
      basicInfo:'',
      liaisons:[],
      educations:[],
      cardInfo:{},
      riskInfo:'',
      externalPlatformLoans:{},
      loanDetail:{},
      applyInfo:{},
      houseFundReport:{},
      socialReport:{},
      contactsData:{
      },
      operatorInfo:{},
      smsInfo:[],
      reasons:[],
      applyData:{},
      flag:{},
      submited:'',
      wraprightFixedStyle:{},
      wraprightStyle:{},
      documents:[],
      isShowContactModal:false,
      wedefendApproval:{},
      liaisonRisk:[],
      company:{
        address:{}
      }
    };
    this.wraprightDOM=React.createRef();
    
  }
  documentFileChange=(fileList)=>{
    this.setState({
      documents:fileList
    });
  }

  getWedefend=()=> {
    // 19032715430631438249493
    axios.get(`v1/history/${this.state.id}/detail`)
      .then( (res)=> {
        if(res.result){

        
          let data=JSON.parse(res.result);
          console.log(data);
          
          this.uuid=data.proposer.uuid;
          this.setState({
            data,
            approver:data.approver,
            proposer:data.proposer,
            creditLine:data.creditLine||{},
            wedefendApproval:data.wedefendApproval,
            liaisons:data.liaisons,
            // // liaisonRisk:[data.liaisonRisk],
            company:data.company,
            educations:data.educations,
            documents:data.documents
          })
          
          
  
        }
      })
  }
  getPrefixText=(applyData)=>{
    var origin = applyData.origin;
    var source_id = applyData.sourceId
    if(origin&&origin.length>0){
      return '('+origin+')'
    }else
      return this.getSourceName(source_id)
  }
  getSourceName=(source_id)=>{
    if(source_id===1||source_id===3){
      return '(APP)'
    }else if(source_id ===2){
      return '(H5)'
    }else{
      return ''
    }
  }
  getFlag=(data)=> {
    var state = data.state;
    var operation = data.operation;
    return {
      isEditable: data.edit,
      isEnableRepeal: data.repeal,
      isSuspended: data.suspended,
      isOnPreApprove: operation && operation.step==='pre',
      isOnInitApprove: operation && operation.step==='init',
      isOnFinalApprove: operation && operation.step==='final',
      isOnFraudApprove: operation && operation.step==='fraud',
      isOnWedefendApprove: data.step==='wedefend' && state==='applied',
      isIndividualBusiness: this.isIndividualBusiness(data)
    }
  }
  isIndividualBusiness= (data)=> {
    var origin = data.origin;
    var code = data.productCode;
    return (this.isIndividualBusinessCode(code) && origin === 'sc_prm_dlb_00000001') ||
      (this.isIndividualBusinessCode(code) && origin === 'sc_prm_sbs_00000001')
  }
  isIndividualBusinessCode= (code) =>{
    return /^H5-SDD/i.test(code)
  }
  getApply=()=>{
    axios.get('applications/'+this.state.id).then( (res)=> {
      let applyData = res.data;
      applyData.productName=this.getPrefixText(applyData)+applyData.productName ;
      let flag = this.getFlag(applyData);
      flag.isEditable = true;
      flag.isSuspended = false;
      let submited = false;
      let {documents}=applyData;
      this.setState({
        applyData,
        flag,
        submited,
        documents
      }); 
    })
  }
  scrollEventHandler=(event)=>{
    const scrollTop = (event.srcElement ? 
      event.srcElement.documentElement.scrollTop 
      : false) 
      || window.pageYOffset 
      || (event.srcElement ? event.srcElement.body.scrollTop : 0);
    if(scrollTop>=290){
      this.setState({
        wraprightStyle:this.state.wraprightFixedStyle
      })
    }else{
      this.setState({
        wraprightStyle:{}
      })
    }
  }
  phoneCall=(toPhone)=>{
    console.log(toPhone);
    localForage.getItem(phone)
      .then((value)=>{
        axios.post(`v1/voice/getcno/${value}`)
          .then((res)=>{
            axios.post(`v1/voice/login`,{},{
              params:{
                userMobile:value
              }
            })
              .then((resa)=>{
                axios.post(`v1/voice/callout/${toPhone}`,{},{
                  params:{
                    userMobile:value,
                    applicationId:this.state.id
                  } 
                })
                  .then((resb)=>{
                    
                  })
              })
          })
      })
    
  }
  goOneHistory=()=>{
    
    console.log(this.state.proposer.cnid);
    openInNewTab(`/system/beforeloan/oneloanhistory/${this.state.proposer.cnid}?uuid=${this.uuid}`);      
  }
  componentDidMount(){
    this.getWedefend();
    Promise.all([
      commonRequest.getApplicationInfo(`${this.state.id}`)
    ])
    .then((values)=> {
      console.log(values[0]);
      this.setState({
        applicationInfo:values[0]
      })
    })
    // this.getApply();
    window.addEventListener('scroll', this.scrollEventHandler);
    //数值是精确计算屏幕宽度- 各种边框的 宽度
    let lefta=(document.body.clientWidth-200-20)*0.505;
    let width=(document.body.clientWidth-200-20)*0.495;
    let left=200+10+lefta;
    this.setState({
      wraprightFixedStyle:{
        position: 'fixed',
        left: left,
        width: width,
        top: 46,
        height:window.innerHeight-80
      }
    })
    
  }
  
  componentDidUpdate(){
  }
  
  render(){
    const {
      basicInfo,liaisons,educations,data,riskInfo,
      applicationInfo,liaisonRisk,
      wedefendApproval,creditLine,proposer,approver,
      applyData,id,wraprightStyle,documents,company
    }=this.state;
    const {
      ViewsList
    }=this.props
    const ReportTitleItem=(props)=>(
      <div className="report_titleitem">
        <span>{props.title}</span>
        <span>{props.value}</span>
      </div>
    )
    const isAntiDone=applicationInfo.processStatus==='done';
    console.log(isAntiDone);
    const isAntiAssigned=applicationInfo.processName;
    return(
      <div className="page_applydetail">
        <Card style={{
          marginBottom:4
        }}>
          <div className="detailhead_wrap">
            <div>
              <h2>{data.productName}</h2>
              <h2>{data.applicationId}</h2>
              <Badge style={{ backgroundColor: '#5E87B0' }} count={data.stateDesc}/>
            </div>
            <div>
              <Button type="primary">反欺诈图谱</Button>
              <Button type="primary"
                onClick={this.goOneHistory}
              >
                
                贷款历史
          
              </Button>
              <Button type="primary">关联重查</Button>
              <Button type="primary">Wefront</Button>
            </div>
          </div>
        </Card>
        <Anchor 
          className="repot_btn"
          bounds={100}
          >
          <Anchor.Link href={`.${this.props.location.pathname}#card1`} title="风险提示"/>
          <Anchor.Link href={`.${this.props.location.pathname}#card2`} title="个人信息"/>
          <Anchor.Link href={`.${this.props.location.pathname}#card3`} title="联系人信息" />
          <Anchor.Link href={`.${this.props.location.pathname}#card4`} title="工作信息"/>
          <Anchor.Link href={`.${this.props.location.pathname}#card5`} title="教育信息"/>
          <Anchor.Link href={`.${this.props.location.pathname}#card6`} title="授信信息"/>
          <Anchor.Link href={`.${this.props.location.pathname}#card7`} title="图片资料" />            
        </Anchor>
        <div className="details_wrap">

          <div className="details_wrapleft">
            <div className="offsetcard" id="card1">
              <Card
                title="风险提示" hoverable={true}
              >
                {data.approvalTips.map((value,index)=>
                  <Badge style={{ backgroundColor: 'orange' }} 
                    count={value} key={index}
                  />
                )}
              </Card>
            </div>

            <div className="offsetcard tablecard" id="card2">
              <PersonalInfo data={{
                  data,approver,proposer,creditLine
                }}
              />
            </div>
            <div className="offsetcard" >
              <Card
                title="授信情况"
              >
                <table className="gird-table ">
                  <tbody>
                    <tr>
                      <th>本次机审额度</th>
                      <td>{wedefendApproval.amount}</td>
                      <th>本次机审结论</th>
                      <td>{wedefendDecisionList[wedefendApproval.operation]}</td>
                    </tr>
                    <tr>
                      <th>当前信用额度</th>
                      <td>{creditLine.amount}</td>
                      <th>当前已用额度</th>
                      <td>{creditLine.usedCredit}</td>
                    </tr>
                    <tr>
                      <th>当前可用额度</th>
                      <td>{creditLine.name}</td>
                      <th>在途月还款额</th>
                      <td>{creditLine.gender}</td>
                    </tr>
                    <tr>
                      <th>在途贷款笔数</th>
                      <td>{creditLine.onRoadLoansCnt}</td>
                      <th></th>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
            <div className="offsetcard" id="card3">
              <Liaisons data={{liaisonRisk,liaisons}}
                applicationId={id}
              />    
            </div>
            <div className="offsetcard" id="card4">
              <Card
                title="工作信息"
              >
                <table className="gird-table ">
                  <tbody>
                    <tr>
                      <th>名称</th>
                      <td>{company.name}</td>
                      <th>入职时间</th>
                      <td>{utiDate.toDateTime(company.entryTime)}</td>
                    </tr>
                    <tr>
                      <th>地址</th>
                      <td>{company.address&&company.address.description}</td>
                      <th>入职部门</th>
                      <td>{company.department}</td>
                    </tr>
                    <tr>
                      <th>电话</th>
                      <td>{company.telphone}</td>
                      <th>职位</th>
                      <td>{company.position}</td>
                    </tr>
                    <tr>
                      <th>分机号</th>
                      <td>{company.extNum}</td>
                      <th>数据库电话</th>
                      <td>{company.telephoneInfo}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
            <div className="offsetcard" id="card3">
              <Educations data={{educations}}/>
            </div>
            <div className="offsetcard" id="card5">   
              <Documents
                fileChange={this.documentFileChange}
                documents={documents}
                applicationId={id}
              />
            </div>
          </div>

          <div className="details_wrapright"
            ref={this.wraprightDOM}
            style={
              wraprightStyle
            }
          > 

            <Tabs defaultActiveKey="1" type="card"
              style={{
                marginTop:4
              }}
            >
              <TabPane tab="操作记录" key="1">
                <div className="offsetcard" id="card4">
                  <HangupInfo 
                    data={applicationInfo} showButton={isAntiAssigned}
                    authList={ViewsList}
                  />
                </div>
                <div className="offsetcard" id="card4">
                  <RiskCheck applicationId={id} disabled={!ViewsList.includes('system_beforeloan_applydetail_btnSaveriskcheck')}/>
                </div>
                <div className="offsetcard">
                  <InvestigationRecord
                    applicationId={id} disabled={isAntiDone}
                  />
                </div>
                <div className="offsetcard">    
                  <InvestigationResult 
                    applicationId={id} disabled={isAntiDone||!ViewsList.includes('system_beforeloan_applydetail_saveInvestigationRecord')}
                  />
                </div>  
                <div className="offsetcard">
                  <OperateHistory approvalHistories={data.approvalHistories}
                    applicationId={id}
                  />
                </div>
                
                <div className="offsetcard">
                  <QARecord
                    applicationId={id}
                  />
                </div>
                
              </TabPane>
              <TabPane tab="贷前操作痕迹" key="2">
                <div className="offsetcard" id="card4">
                  <RiskCheckInfo data={{
                        data,approver,proposer,creditLine
                      }}
                    />
                </div>
                <div className="offsetcard tablecard" id="card2">
                  <ServiceTips data={{
                      data,approver,proposer,creditLine
                    }}
                  />
                </div>
                <div className="offsetcard">
                  <VerifyRecords approvalHistories={data.approvalHistories}
                  />
                </div>
              </TabPane>
            </Tabs>
            
            
          </div>
          
        </div>          
        <Affix style={{ position: 'fixed', bottom: 50, right: 50 }}>
          <Input.Search
            placeholder="输入电话号码以拨打"
            enterButton={
              <Icon type="phone" />
            }
            size="large"
            onSearch={this.phoneCall}
          />
        </Affix>        
      </div>
       
    )
  }
}
)
)