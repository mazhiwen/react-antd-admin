import * as React from 'react';
import {
  Form, 
  Card,
  notification,
} from 'antd';
import {axios,utiDate} from 'utils';
import moment from 'moment';
import BasicIcon from 'components/BasicIcon';
const {Fragment} = React;
class PhoneRecordOrigin extends React.Component{
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
            message:'操作成功',
            description:'保存成功'
          });
        })
      }
    });
  }

  hangUp=()=>{

  }
  goBaiduMap(key){
    window.open(`http://api.map.baidu.com/geocoder?address=${key}&output=html`);
  }
   // http://api.map.baidu.com/geocoder?address=广东省,深圳市,南山区,科苑南路3331号阿里云大厦&output=html
    // http://api.map.baidu.com/geocoder?address=北京市海淀区上地信息路9号奎科科技大厦&output=html&src=webapp.baidu.openAPIdemo 
  goBaidu(key){
    window.open(`https://www.baidu.com/s?wd=${key}`);
  }
  goSoso(key){
    window.open(`https://www.so.com/s?q=${key}`);
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
    let sex;
    if(proposer.cnid){
      let sexNum =  proposer.cnid.length === 18 ? proposer.cnid.slice(-2,-1) : proposer.cnid.slice(-1);
      sex = sexNum % 2 === 1 ? '男': '女';
    }
    
    return (
      <Card
        title="个人信息" hoverable={true}
      >
        <table className="gird-table ">
          <tbody>
            <tr>
              <th>产品类型</th>
              <td>{data.productName}</td>
              <th>处理人</th>
              <td>{approver.operator}</td>
            </tr>
            <tr>
              <th>手机号码</th>
              <td>{proposer.mobile}
                <BasicIcon
                  type="icon-sousuo" 
                  onClick={this.goSoso.bind(this,proposer.mobile)}
                />
                <BasicIcon
                  type="icon-icon_baidulogo" 
                  onClick={this.goBaidu.bind(this,proposer.mobile)}
                />
                
              </td>
              <th>状态</th>
              <td>{data.stateDesc}</td>
            </tr>
            <tr>
              <th>申请号</th>
              <td>{data.applicationId}</td>
              <th>贷后状态</th>
              <td>{}</td>
            </tr>
            <tr>
              <th>申请时间</th>
              <td>{utiDate.toDateTime(data.appliedAt)}</td>
              <th>申请金额</th>
              <td>{data.amount}</td>
            </tr>
            <tr>
              <th>提报时间</th>
              <td>{}</td>
              <th>申请期限</th>
              <td>{data.applyTenor}</td>
            </tr>
            <tr>
              <th>审批时间</th>
              <td>{}</td>
              <th>渠道来源</th>
              <td>{data.originName}</td>
            </tr>
            <tr>
              <th>放款时间</th>
              <td>{}</td>
              <th>渠道代码</th>
              <td>{data.originCode}</td>
            </tr>
            <tr>
              <th>审批类型</th>
              <td>{data.approvalNote}</td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
        <br/>
        <table className="gird-table ">
          <tbody>
            <tr>
              <th>姓名</th>
              <td>{proposer.name}</td>
              <th>性别</th>
              <td>{sex}</td>
            </tr>
            <tr>
              <th>年龄</th>
              <td>{proposer.age}</td>
              <th>婚姻状况</th>
              <td>{proposer.marriage}</td>
            </tr>
            <tr>
              <th>身份证号码</th>
              <td>{proposer.cnid}</td>
              <th>行业</th>
              <td>{proposer.industryDesc}</td>
            </tr>
            <tr>
              <th>当前信用额度</th>
              <td>{creditLine.amount}</td>
              <th>当前可用额度</th>
              <td>{creditLine.availableCredit}</td>
            </tr>
            <tr>
              <th>当前住址</th>
              <td>
                {proposer.address&&
                  <Fragment>
                    {proposer.address.description}
                    <BasicIcon
                      type="icon-baiduditu" 
                      onClick={this.goBaiduMap.bind(this,proposer.address.description)}
                    />
                  </Fragment>
                }
              </td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </Card>
    )
  }
}
const ComponentInstance =Form.create()(PhoneRecordOrigin);

export default ComponentInstance;

