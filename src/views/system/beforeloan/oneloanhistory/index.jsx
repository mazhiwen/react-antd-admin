import * as React from 'react';
import {
  Form, Input, Button, notification,Select,Modal,
  Col,Table,Card,Radio
} from 'antd';
import { Link } from 'react-router-dom'
import mp3 from '../../../../images/the-wires.mp3';

import {
  axios,dataFormat,commonRequest,historyPush
} from 'utils';
import {
  ProcessStatus,ResultStatus,approvalStatusMap,
  subTypeMap,resultDecisionMap,urgentMap,RadioGroupStyle
} from 'configs';

import moment from 'moment';


const FormItem=Form.Item;
const RadioGroup=Radio.Group;

const RadioButton=Radio.Button;

const {Fragment} = React;




const pageSize=15;





const MoalInstance=Form.create()(
  class extends React.Component{
    constructor(props){
      super(props);
      this.state={
        provinceMap:{},
        cityMap:{},
        blockMap:{},
        areasTree:[],
        tableLoading:false,
        data:[
          {
            account:2
          }
          
        ]
      }
      this.columns=[
        {
          title: '还款期数',
          dataIndex: 'index',
        },
        {
          title: '应还款日',
          dataIndex: 'dueDate',
        },
        {
          title: '还款时间',
          dataIndex: 'repaymentDate',
          render:value=><span>
            {moment(value).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        },
        {
          title: '逾期天数',
          dataIndex: 'overdueDays',
        },
        {
          title: '还款金额',
          dataIndex: 'amount',
        }, 
        
        {
          title: '剩余未还本金',
          dataIndex: 'residualPrincipal',
        }
      ];
    }
    onOk=()=>{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          axios.post('admin/admin', {
            // oldPassword: md5(values.oldPassword),
            // password: md5(values.newPassword),
            isUpdate:1
          })
          .then((res)=>{
            notification['success']({
              message:'密码已更新',
              description:''
            });
          })
        }
      })
      
    }
    onChange = (value, label, extra) => {
      console.log(value);
      console.log(label);
      console.log(extra);
      this.setState({ value });
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      let visible=this.props.visible;
      if(visible!==prevProps.visible){
        if(visible){
          axios.get(`v1/loan/${this.props.uuid}/${this.props.applicationId}/repayDetail`)
            .then((res)=>{
              let data=res.result;
              this.setState({
                data
              })
            })
        }
      }
    }
    componentDidMount(){
      
    }
    render(){
      const {
        visible, onCancel, form,uuid,applicationId
      } = this.props;
      const {
        tableLoading,data
      } = this.state;
      const { getFieldDecorator,getFieldValue,validateFields} = form;

      return(
        <Modal
          className="modalinstance"
          visible={visible}
          title="还款明细"
          okText="确认" width={700}
          onCancel={onCancel}
          onOk={this.onOk}
        >
          <Table
            loading={tableLoading}
            columns={this.columns} rowKey="account"
            dataSource={data}
            pagination={false}
            bordered size="small"
          />
        </Modal>
      )
    }
  }
)


class LoanList extends React.Component{

  constructor(props){
    super(props);
    this.state={
      tableLoading:false,
      isMy:false,
      subReasonMap:[],
      subType:'',
      total:0,
      productList:[],
      visible:false,
      data:[]
    };
    this.uuid='';
    this.getListSearchParams={};
    this.baseColumns=[
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '批核时间',
        dataIndex: 'approvedAt',
        render:value=><span>
          {moment(value).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      },
      {
        title: '申请号',
        dataIndex: 'applicationId',
      },
      {
        title: '类型',
        dataIndex: 'stateName',
      }, 
      {
        title: '结果',
        dataIndex: 'result',
      },
      {
        title: '代码',
        dataIndex: 'reasonCode',
      },
      {
        title: '批核/提现金额',
        dataIndex: 'amount',
      },
      {
        title: '借款期数',
        dataIndex: 'tenor',
      },
      {
        title: '未还本金',
        dataIndex: 'loanOverDueSummary.unSettledPrincipal',
      },
      {
        title: '已还期数',
        dataIndex: 'loanOverDueSummary.settledIndexCnt',
      },
      {
        title: '预期次数',
        dataIndex: 'loanOverDueSummary.overdueCnt',
      },
      {
        title: '逾期记录',
        dataIndex: 'loanOverDueSummary.indexDueDayDetail',
      },
      {
        title: '总逾期天数',
        dataIndex: 'loanOverDueSummary.overdueDays',
      },
      {
        title: '最大逾期天数',
        dataIndex: 'oanOverDueSummary.maxOverdueDays',
      },
      {
        title: '当天逾期天数',
        dataIndex: 'loanOverDueSummary.currentOverdueDays',
      },
      {
        title: '操作',
        dataIndex: 'serialNo',
        key:'ifprocessName',
        render:(text,record)=>{
          return (
            <Button 
              size="small" type="primary"
              onClick={this.getDetails.bind(this,record)}
            >
              还款明细
            </Button>
          )
          
        }
      },
      
    ];
  }
  getDetails=(record)=>{

    this.setState({
      visible:true,
      applicationId:record.applicationId
    });
  }
  setMoalInstance=(state)=>{
    this.setState({
      visible:state,
      
    });
  }
  getList=(pageParams)=>{
    let url=`v1/loan/${this.props.match.params.id}/histories`;
    axios.get(url,{})
      .then(res=> {
        let data=res.result;
        data.map((value,index)=>{
          data[index].key=index+1;
        })
        this.setState({
          data
        })
      })
      .finally(()=>{

      })
  }

  
  componentDidMount(){
    this.getList();
    let params = new URLSearchParams(this.props.location.search);
    let uuid=params.get('uuid');
    this.uuid=uuid;
    console.log(uuid);

    Promise.all([
      commonRequest.getApplyProducts(), 
      commonRequest.getSubReasonMap(), 
      commonRequest.getQzCodeMap()
    ])
    .then((values)=> {
      this.setState(
        {
          productList:values[0].productList,
          subReasonMap:values[1]
        },
        ()=>{
        }
      ); 
    });  
    
  }
  render(){
    const {
      data,total,productList,subType,productCode,
      visible,tableLoading,applicationId
    }=this.state;





    return(
      <Card
        title={`贷款历史 李琳琳 18040321401016361091643`}
      >         
        <Table
          loading={tableLoading}
          columns={this.baseColumns} rowKey="key"
          dataSource={data}
          pagination={{
            // current:total,
            total:total,
            pageSize:pageSize,
            onChange:(page, pageSize)=>this.getList({
              page:page
            })
          }}
          bordered size="small"
        />
        <MoalInstance
          visible={visible} uuid={this.uuid} 
          onCancel={this.setMoalInstance.bind(this,false)}
          applicationId={applicationId}
        />          
      </Card>
    )
  }
}

export default Form.create()(LoanList)





