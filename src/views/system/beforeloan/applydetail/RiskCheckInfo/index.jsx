import * as React from 'react';
import {
  Form, Button,Row,
  Col,Icon,Card,Input,
  notification,Radio
} from 'antd';
import {axios} from 'utils';
import moment from 'moment';
import PhoneRecord from '../PhoneRecord/PhoneRecord';
const {Fragment} = React;

const ALiIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1108658_gknxqggwko.js', // 在 iconfont.cn 上生成
});
const passMap={
  true:'通过',
  false:'未通过'
}
// CA19041113504920638403987
export default Form.create()(class PhoneRecordOrigin extends React.Component{
  // constructor(props){
  //   super(props);
  // }


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
            message:'提示',
            description:'操作成功'
          });
        })
      }
    });
  }

  hangUp=()=>{

  }
  componentDidMount(){
  }
  render(){
    const {
      data,approver,proposer,creditLine
    } = this.props.data;
    const {
      getFieldDecorator
    } = this.props.form;
    const merchantCheck = data.merchantCheck||{} ;
    const proposerCheck = data.riskCheck||{} ;
    const callRecords=data.callRecords||[];
    // 联系人电话记录
    const liaisonRecords=data.liaisonRecords||[];
    // 公司电话记录
    const companyCallRecords=data.companyCallRecords||[];
    const legalPersonRecord=data.legalPersonRecord||{};
    // let liaisonRecords=[];
    liaisonRecords.map((value,index)=>{
      let originRecords=value.records;
      let records=[];
      originRecords.map((valuer,indexr)=>{
        records.push({
          bridgeTime:moment(valuer.logTime),
          customerNum:valuer.telphone,
          resultTxt:valuer.content,
          status:valuer.state
        })
      })
      value.records=records;
    })
    console.log(liaisonRecords);
    return (
      <Card
        title="风险核实信息"
      >
        <Card
          type="inner" 
          title="商户调查"
        >
          <table className="gird-table ">
            <tbody>
              <tr>
                <th>商户月营业额</th>
                <td>{merchantCheck.monthlyTurnover}</td>
                <th>核实套现笔数</th>
                <td>{merchantCheck.checkTradeTimesMonths}</td>
              </tr>
               <tr>
                <th>核实套现金额</th>
                <td>{merchantCheck.checkTradeAmountMonths}</td>
                <th>核实套现期限</th>
                <td>{merchantCheck.checkTradeTenorMonths}</td>
              </tr>
              <tr>
                <th>开始经营时间</th>
                <td>{merchantCheck.openingTime}</td>
                <th>经营年限</th>
                <td>{merchantCheck.duration}</td>
              </tr>
              <tr>
                <th>行业</th>
                <td>{merchantCheck.industry}</td>
                <th>商户类型</th>
                <td>{merchantCheck.type}</td>
              </tr>
              <tr>
                <th>借款期限</th>
                <td>{merchantCheck.tenor}</td>
                <th>借款金额</th>
                <td>{merchantCheck.amount}</td>
              </tr>
              <tr>
                <th>可接受月还款额</th>
                <td>{merchantCheck.monthPay}</td>
                <th>家庭平均收入</th>
                <td>{merchantCheck.familyIncome}</td>
              </tr>
              <tr>
                <th>企业名称(工商信息)</th>
                <td>{merchantCheck.companyName}</td>
                <th>经营者(工商信息)</th>
                <td>{merchantCheck.operateName}</td>
              </tr>
              <tr>
                <th>经营场所(工商信息)</th>
                <td>{merchantCheck.operateAddress}</td>
                <th>成立日期(工商信息)</th>
                <td>{merchantCheck.establishDate}</td>
              </tr>
              <tr>
                <th>营业执照审核</th>
                <td>{passMap[merchantCheck.businessLicenceCheck&&merchantCheck.businessLicenceCheck.check]}</td>
                <th>客户姓名比对</th>
                <td>{passMap[merchantCheck.personNameCheck&&merchantCheck.personNameCheck.check]}</td>
              </tr>
              <tr>
                <th>商户名称比对</th>
                <td>{passMap[merchantCheck.companyNameCheck&&merchantCheck.companyNameCheck.check]}</td>
                <th>商户地址比对</th>
                <td>{passMap[merchantCheck.companyAddressCheck&&merchantCheck.companyAddressCheck.check]}</td>
              </tr>
              <tr>
                <th>近一年有无行政处罚</th>
                <td>{merchantCheck.administrativePenaltyCheck&&merchantCheck.administrativePenaltyCheck.check}</td>
                <th>近一年有无经营异常</th>
                <td>{merchantCheck.operateWarningCheck&&merchantCheck.operateWarningCheck.check}</td>
              </tr>
              <tr>
                <th>商户房产类型</th>
                <td>{merchantCheck.companyHouseType}</td>
                <th>网查风险</th>
                <td>{merchantCheck.netWarningCheck&&merchantCheck.netWarningCheck.check}</td>
              </tr>
              <tr>
                <th>人法风险</th>
                <td>{merchantCheck.renfaCheck&&merchantCheck.renfaCheck.check}</td>
                <th>失信网风险</th>
                <td>{merchantCheck.shixinCheck&&merchantCheck.shixinCheck.check}</td>
              </tr>
              <tr>
                <th>户口是否本区(县)</th>
                <td>{merchantCheck.householdCheck}</td>
                
              </tr> 
              
            </tbody>
          </table>
        </Card>
        <br/>
        <Card
          type="inner" 
          title="申请人调查"
        >
          <table className="gird-table ">
            <tbody>
              <tr>
                <th>是否风险行业</th>
                <td>{proposerCheck.riskIndustry}</td>
                <th>本人手机申请</th>
                <td>{proposerCheck.selfPhone}</td>
              </tr>
              <tr>
                <th>手机型号是否一致</th>
                <td>{proposerCheck.samePhoneModel}
                  <Button  shape="circle" icon="search" />
                  <Button shape="circle"
                    onClick={this.goBaidu}
                  >
                    <ALiIcon  type="icon-icon_baidulogo" />
                  </Button>
                  
                  
                </td>
                <th>借款金额</th>
                <td>{proposerCheck.amount}</td>
              </tr>
              <tr>
                <th>借款期限</th>
                <td>{proposerCheck.tenor}</td>
                <th>借款用途</th>
                <td>{proposerCheck.loanUse}</td>
              </tr>
              <tr>
                <th>住房性质</th>
                <td>{proposerCheck.houseType}</td>
                <th>当前住址居住时长</th>
                <td>{proposerCheck.residenceLength}</td>
              </tr>
              <tr>
                <th>学历</th>
                <td>{proposerCheck.eduLevel}</td>
                <th>子女数量</th>
                <td>{proposerCheck.childrenNumber}</td>
              </tr>
              <tr>
                <th>是否有社保</th>
                <td>{proposerCheck.socialSecurity}</td>
                <th>有效信用卡张数</th>
                <td>{proposerCheck.creditCardNumber}</td>
              </tr>
              <tr>
                <th>有无车产</th>
                <td>{proposerCheck.carFlag}</td>
                <th>每个月平均债务</th>
                <td>{proposerCheck.monthDebt}</td>
              </tr>
              <tr>
                <th>客户在职核实情况</th>
                <td>{proposerCheck.employedStatus}</td>
                <th>工资发放形式</th>
                <td>{proposerCheck.salaryType}</td>
              </tr>
              <tr>
                <th>在本地的工作时长</th>
                <td>{proposerCheck.localWorkMonth}</td>
                <th>客户其他手机号码</th>
                <td>{proposerCheck.customerOtherMobile}</td>
              </tr>
              <tr>
                <th>婚姻状况</th>
                <td>{proposerCheck.marriage}</td>
                <th>可接受月还款额</th>
                <td>{proposerCheck.monthPay}</td>
              </tr>
              <tr>
                <th>单位名称</th>
                <td>{proposerCheck.companyName}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>单位地址</th>
                <td>{proposerCheck.companyAddress}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>单位电话</th>
                <td>{proposerCheck.companyPhone}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th>职位</th>
                <td>{proposerCheck.position}</td>
                <th>入职时间</th>
                <td>{proposerCheck.entryTime}</td>
              </tr>
              <tr>
                <th>月收入</th>
                <td>{proposerCheck.monthIncome}</td>
                <th>发薪日</th>
                <td>{proposerCheck.paySalaryDay}</td>
              </tr>
              <tr>
                <th>行业</th>
                <td>{}</td>
              </tr>
            </tbody>
          </table>
          <br/>
          <PhoneRecord title="电话拨打记录" 
            records={callRecords}
          />
        </Card>
        <br/>
        <Card
          type="inner" 
          title="公司电话记录" 
        >
          <PhoneRecord
            title="网络调查" headType="selct" 
            // records={[{telVerOneself:'2323'}]}
          />
          <br/>
          <PhoneRecord
            title="鹏元调查" headType="selct"
          />
          <br/>
          <PhoneRecord
            title="114调查" headType="selct"
          />
          <br/>
          <PhoneRecord
            title="进件单位调查" headType="selct"
          />
        </Card>
        <br/>
        <Card
          type="inner" 
          title="联系人电话记录"
        >
          {liaisonRecords.map((value,index)=>
            <Fragment key={index}>
              <PhoneRecord 
                title={`${value.relationship}:${value.name}`}
                records={value.records}
              />
              <br/>
            </Fragment>
            
          )}
          
          <br/>
        </Card>
        <br/>
        <Card
          type="inner" 
          title="法人调查"
          
        >
          <table className="gird-table ">
            <tbody>
              <tr>
                <th>申请人与法人关系</th>
                <td>{legalPersonRecord.relation}</td>
                <th>法人是否知晓贷款申请</th>
                <td>{legalPersonRecord.know}</td>
              </tr>
            </tbody>
          </table>
          <br/>
          <PhoneRecord
            title="电话拨打记录" headType="selct"
          />
        </Card>
      </Card>
    )
  }
}
)

