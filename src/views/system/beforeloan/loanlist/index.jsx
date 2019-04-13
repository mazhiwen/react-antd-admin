import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card,Radio,notification
} from 'antd';
import { Link } from 'react-router-dom'

import {
  axios,dataFormat,commonRequest,historyPush,openInNewTab,
  localForage
} from 'utils';
import {
  ProcessStatus,approvalStatusWedefendMap,
  subTypeMap,resultDecisionMap,urgentMap,RadioGroupStyle,
  qualityProcessStatusMap,qualityResultStatusMap,viewsMapName
} from 'configs';
import {  connect } from 'react-redux';

import moment from 'moment';



const RadioGroup=Radio.Group;

const RadioButton=Radio.Button;

const {Fragment} = React;
function hasErrors(fieldsError) {  
  return Object.keys(fieldsError).some(value => fieldsError[value]);
}
const pageSize=15;
export default connect(
  (state) =>{
    return{
      ViewsList:state.ViewsList.data
    }
  },
  (dispatch) =>{
    return {
      // SET_singleModalData: (value) => dispatch({
      //   type: 'SET_singleModalData',
      //   value
      // })
    }; 
  }
)(Form.create()(
class LoanList extends React.Component{

  constructor(props){
    super(props);
    this.state={
      pageParentType:'',
      pageType:'',
      currentSearchTableKeyPage:'',
      isMy:false,
      subReasonMap:[],
      subType:'',
      qzCodeMap:[],
      total:0,
      provinceList:[],
      productList:[],
      receiveList:[
        {
          id: 'yes',
          name: '是'
        },
        {
          id: 'no',
          name: '否'
        },
      ],
      
      data:[]
    };
    this.myListDealStatus='';
    this.productMap={};
    this.getListSearchParams={};
    this.searchTableKeysMap={
      'list':{
        search:[
          'applicationId','mobile','name','cnid','productCode','origin','processName',
          'urgent','companyName','triggerTimes','processStatus','subType','qzCode',
          'subReason','approvalStatus','resultDecision'
        ],
        table:[
          'applicationId','productName','name','appliedAt','createAt',
          'amount','tenor','subUser','processName','processStatus','resultDecision','operate'
        ],
        requestUrl:'v1/application/list'
      },
      'my':{
        requestUrl:'v1/application/mylist'
      },
      'mydone':{
        search:[
          'applicationId','companyName','mobile','name','cnid','productCode','origin',
          'triggerTimes','processTimes','processStatus','subType','resultDecision'
        ],
        table:[
          'appliedAt','createAt','applicationId','productName','name','origin',
          'subType','qzCodes','approvalStatus','resultDecision'
        ]
      },
      'mynodone':{
        search:[
          'applicationId','mobile','name','cnid','productCode','origin'
        ],
        table:[
          'processEndTime_processStartTime','appliedAt','createAt','applicationId','productName','name','origin',
          'subType','qzCodes','approvalStatus'
        ]
      },
      'history':{
        search:[
          'applicationId','companyName','mobile','name','cnid','productCode','origin','processName',
          'triggerTimes','processTimes','processStatus','subType'
        ],
        table:[
          'applicationId','productCode','name','appliedAt','createAt','approvalType',
          'amount','applyTenor','operator','processName','resultDecision'
        ],
        requestUrl:'v1/history/list'
      },
      'qa':{
        search:[
          'applicationId','companyName','mobile','name','cnid','productCode','origin','processName',
          'triggerTimes','processTimes','processStatus','subType','resultDecision','qualityProcessStatus',
          'qualityResultStatus'
        ],
        table:[
          'applicationId','productName','name','cnid','appliedAt','createAt',
          'amount','tenor','subUser','processName','qualityProcessStatus','qualityProcessName',
          'qualityResultStatus',
        ],
        requestUrl:'v1/quality/list'
      },
      'qamy':{
        search:[
          'applicationId','companyName','mobile','name','cnid','productCode','origin','processName',
          'triggerTimes','processTimes','processStatus','subType','resultDecision','qualityProcessStatus',
          'qualityResultStatus'
        ],
        table:[
          'applicationId','productName','name','cnid','appliedAt','createAt',
          'amount','tenor','subUser','processName','qualityProcessStatus','qualityProcessName',
          'qualityResultStatus',
        ],
        requestUrl:'v1/quality/mylist'
      },
    };
    this.tableDataKeyValueMap={
      // {
      //   title: '操作',
      //   dataIndex: 'serialNo',
      //   key:'ifprocessName',
      //   render:(text,record)=>{
      //     console.log(record);
      //     if(record.processName){
      //       return;
      //     } else {
            
      //       return (
      //         <Button 
      //           size="small" type="primary"
      //           onClick={this.getApplication.bind(this,text)}
      //         >
      //           领取
      //         </Button>
      //       )
      //     }
      //   }
      // },
      key:{
        title: '序号',
        dataIndex: 'key',
      },
      applicationId:{
        title: '贷款号',
        dataIndex: 'applicationId',
        render:(text,record)=>{
          return( 
            <a onClick={this.onIdClick.bind(this,record)}>
              {text}
            </a>
          )
        }
      },
      productName:{
        title: '产品',
        dataIndex: 'productName',
      },
      productCode:{
        title: '产品',
        dataIndex: 'productCode',
        render:(text,record)=>
          <span>
            {this.productMap[text]}
          </span>
      },
      name:{
        title: '姓名',
        dataIndex: 'name',
      },
      appliedAt:{
        title: '申请时间',
        dataIndex: 'appliedAt',
        render:value=><span>
          {moment(value).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      },
      createAt:{
        title: '提报时间',
        dataIndex: 'createAt',
        render:value=><span>
          {moment(value).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      },
      origin:{
        title: '渠道号',
        dataIndex: 'origin',
      },
      subType:{
        title: '提报类型',
        dataIndex: 'subType',
        render:(text,record)=>(
          <span>{subTypeMap[text]}</span>
        )
      },
      qzCodes:{
        title: '系统提报码',
        dataIndex: 'qzCodes',
      },
      approvalType:{
        title: '批核流程',
        dataIndex: 'approvalType',
        render:(text,record)=>(
          <span>{this.state.approvalStatusMap[text]}</span>
        )
      },
      approvalStatus:{
        title: '人工提报类型',
        dataIndex: 'approvalStatus',
        render:(text,record)=>(
          <span>{approvalStatusWedefendMap[text]}</span>
        )
      },
      'processEndTime_processStartTime':{
        title: '处理时长',
        dataIndex: 'processEndTime-processStartTime',
        render:(text,record)=>{
          let res='';
          if(record.processEndTime){
            res=record.processEndTime-record.processStartTime;
          }
          return res;
        }
      },
      resultDecision:{
        title: '结论',
        dataIndex: 'resultDecision',
        render:value=><span>{resultDecisionMap[value]}</span>
      },
      cnid:{
        title: '身份证号',
        dataIndex: 'cnid',
      },
      amount:{
        title: '额度',
        dataIndex: 'amount',
      },
      tenor:{
        title: '期限',
        dataIndex: 'tenor',
      }, 
      applyTenor:{
        title: '期限',
        dataIndex: 'applyTenor',
      },
      subUser:{
        title: '提报人',
        dataIndex: 'subUser',
      }, 
      processName:{
        title: '反欺诈处理人',
        dataIndex: 'processName',
      },
      operator:{
        title: '审批处理人',
        dataIndex: 'operator',
      },
      qualityProcessStatus:{
        title: '质检状态',
        dataIndex: 'qualityProcessStatus',
      }, 
      qualityProcessName:{
        title: '质检人',
        dataIndex: 'qualityProcessName',
      }, 
      qualityResultStatus:{
        title: '质检结果',
        dataIndex: 'qualityResultStatus',
      },  
      processStatus:{
        title: '处理状态',
        dataIndex: 'processStatus',
        render:value=><span>{ProcessStatus[value]}</span>
      },
      operate:{
        title:'操作',
        dataIndex:'operate',
        render:(text,record)=>(
          record.processStatus==='done'&&<Button size="small" 
            className={this.props.ViewsList.includes('system_beforeloan_loanlist_btnQa')?'main_show':'main_hide'}
            onClick={this.addQA.bind(this,record)} disabled={record.qualityProcessName}
          >
            质检
          </Button>
        )
      }
    }
  }
  addQA=(record)=>{
    axios.put(`v1/quality/${record.applicationId}/start`)
      .then(()=>{
        notification['success']({
          message:'提示',
          description:'操作成功'
        });
      })
  }
  goDetails=(applicationId)=>{
    openInNewTab(`/system/beforeloan/applydetail/${applicationId}`);
  }
  onIdClick=(record)=>{
    if(!record.processStartTime){
      axios.post(`v1/allot/${record.applicationId}/start`)
        .then(()=>{
          // this.goDetails(record.applicationId);
        })
        .finally(()=>{
          this.goDetails(record.applicationId);
        })
    }else{
      this.goDetails(record.applicationId);
    }
  }
  handleSubmit = (e) => {
    
    e&&e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        
        let params={...values};
        dataFormat.deleteEmpty(params);
        if(params.productCode){
          params.productCode=params.productCode.join();
        }
        if(params.triggerTimes){
          let times=params.triggerTimes;
          delete params.triggerTimes;
          params.triggerStart=moment(times[0]).format("YYYY-MM-DD");
          params.triggerEnd=moment(times[1]).format("YYYY-MM-DD");
        }
        if(params.processTimes){
          let times=params.processTimes;
          delete params.processTimes;
          params.processStart=moment(times[0]).format("YYYY-MM-DD");
          params.processEnd=moment(times[1]).format("YYYY-MM-DD");
        }
        // console.log(params);
        this.getListSearchParams=params;
        this.getList(params);
      }
    });
  }
  getList=(pageParams)=>{
    let url=this.searchTableKeysMap[this.state.pageParentType].requestUrl;
    let params={
      size:pageSize,
      page:1,
      ...this.getListSearchParams,
      ...pageParams
    };
    if(this.myListDealStatus){
      params.processStatus=this.myListDealStatus;
    }
    axios.get(url,{
      params
    })
      .then(res=> {
        if(res.result){
          let data=res.result.content?res.result.content:res.result;
          data.forEach((value,index)=>{
            value.key=index+1;
          })
          this.setState({
            data:data,
            total:data.totalElements
          });
        }
        
      })
      .finally(()=>{

      })
  }
  subTypeChange=(value)=>{
    this.setState({
      subType:value
    });
  }
  dealStatusChoosedHandler=(e)=>{
    let myListDealStatus=e.target.value;
    let pageType;
    if(myListDealStatus==='done'){
      pageType='mydone';
    }else{
      pageType='mynodone';
    }
    this.myListDealStatus=myListDealStatus;
    this.setState({
      pageType,
    },()=>{
      this.getList();
    })
  }
  componentDidMount(){
    
    // localForage.getItem('viewsList')
    //   .then((value)=>{
    //     console.log(value);
    //   })
    const search=new URLSearchParams(this.props.location.search.substring(1));
    
    let isMy;
    let pageParentType;
    let pathname=this.props.location.pathname;
    let pageType='';
    if(pathname==='/system/beforeloan/loanlistmy'){
      isMy=true;
      pageParentType='my';
      pageType='mynodone';
      this.myListDealStatus='undo';
    }else if(pathname==='/system/beforeloan/loanlist'){
      pageParentType=pageType='list';
      
    }else if(pathname==='/system/beforeloan/loanlisthistory'){
      pageParentType=pageType='history';
    }else if(pathname==='/system/beforeloan/loanlistqa'){
      pageParentType=pageType='qa';
    }else if(pathname==='/system/beforeloan/loanlistqamy'){
      pageParentType=pageType='qamy';
    }
    
    Promise.all([
      commonRequest.getApplyProducts(), 
      commonRequest.getSubReasonMap(), 
      commonRequest.getQzCodeMap(),
      commonRequest.getConfig('approvalStatus')
    ])
    .then((values)=> {
      this.productMap=values[0].productMap;
      this.setState(
        {
          approvalStatusMap:values[3].map,
          isMy,
          pageType,
          pageParentType,
          // currentSearchTableKeyPage:this.props.location.pathname.split('/')[3],
          productList:values[0].productList,
          subReasonMap:values[1],
          qzCodeMap:values[2]
        },
        ()=>{
          let subType=search.get('subType');
          let subsubType=search.get('subsubType');
          let subsubTypeValue=search.get(subsubType);
          let  setFormValues={subType};
          if(subsubType==='code'){
            setFormValues.qzCode=subsubTypeValue;
          }
          if(subsubType==='productName'){
            setFormValues.productCode=subsubTypeValue;
          }      
          if(subsubType==='reason'){
            setFormValues.subReason=subsubTypeValue;
          }
          if(subsubType==='approvalStatus'){
            setFormValues.approvalStatus=subsubTypeValue;
          }
          // this.props.form.setFieldsValue(setFormValues);
          this.setState(
            setFormValues,
            ()=>{
              this.handleSubmit();
            }
          )
        }
      ); 
    });  
    
  }
  render(){
    const {
      getFieldDecorator, getFieldsError,getFieldValue
    } = this.props.form;
    const {
      data,total,productList,subType,productCode,subReason,approvalStatus,
      qzCodeMap,subReasonMap,qzCode,isMy,currentSearchTableKeyPage,approvalStatusMap,
      pageType
    }=this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    let searchDom;
    let columns=[];
    if(pageType){

    
      // let currentSearchTableKey=currentSearchTableKeyPage;
      // if(currentSearchTableKey==='loanlistmy'){
      //   if(myListDealStatus==='done'){
      //     currentSearchTableKey='loanlistmydone';
      //   }else{
      //     currentSearchTableKey='loanlistmynodone';
      //   }
      // }
      
      columns=[
        {
          title: '序号',
          dataIndex: 'key',
        }
      ];
      // console.log(pageType);
      // this.searchTableKeysMap[currentSearchTableKey].table.map((value,index)=>{
      this.searchTableKeysMap[pageType].table.map((value,index)=>{
        columns.push(this.tableDataKeyValueMap[value]);
      })
      const searchDataKeyValueMap={
        applicationId:{
          label:'贷款号'
        },
        mobile:{
          label:'手机号'
        },
        name:{
          label:'姓名'
        },
        cnid:{
          label:'身份证号'
        },
        productCode:{
          label:'产品类型',
          dom:getFieldDecorator('productCode',{
            initialValue:productCode
          })(
            <Select
              allowClear={true}
              mode="multiple"
            >
              {productList.map((value,index)=>
                <Select.Option key={index} value={value.code}>{value.name}</Select.Option>
              )}
            </Select>
          )
        },
        origin:{
          label:'渠道号'
        },
        processName:{
          label:'处理人'
        },
        urgent:{
          label:'催单状态',
          dom:getFieldDecorator('urgent')(
            <Select allowClear={true}
            > 
              {Object.entries(urgentMap).map(([index,value])=>
                <Select.Option key={index} value={index}>{value}</Select.Option>
              )}
            </Select>
          )
        },
        companyName:{
          label:'公司名'
        },
        triggerTimes:{
          label:'触发时间',
          dom:getFieldDecorator('triggerTimes')(
            <DatePicker.RangePicker/>
          )
        },
        processTimes:{
          label:'处理时间',
          dom:getFieldDecorator('processTimes')(
            <DatePicker.RangePicker/>
          )
        },
        processStatus:{
          label:'处理状态',
          dom:getFieldDecorator('processStatus')(
            <Select allowClear={true}
            > 
              {Object.entries(ProcessStatus).map(([index,value])=>
                <Select.Option key={index} value={index}>{value}</Select.Option>
              )}
            </Select>
          )
        },
        subType:{
          label:'提报类型',
          dom:getFieldDecorator('subType',{
            initialValue:subType
          })(
            <Select allowClear={true}
              onChange={this.subTypeChange}
            > 
              {Object.entries(subTypeMap).map(([index,value])=>
                <Select.Option key={index} value={index}>{value}</Select.Option>
              )}
            </Select>
          )
        },
        qualityProcessStatus:{
          label:'质检状态',
          dom:getFieldDecorator('qualityProcessStatus',{
          })(
            <Select allowClear={true}
            > 
              {Object.entries(qualityProcessStatusMap).map(([index,value])=>
                <Select.Option key={index} value={index}>{value}</Select.Option>
              )}
            </Select>
          )
        },
        qualityResultStatus:{
          label:'质检结果',
          dom:getFieldDecorator('qualityResultStatus',{
          })(
            <Select allowClear={true}
            > 
              {Object.entries(qualityResultStatusMap).map(([index,value])=>
                <Select.Option key={index} value={index}>{value}</Select.Option>
              )}
            </Select>
          )
        },
        resultDecision:{
          label:'结论',
          dom:getFieldDecorator('resultDecision')(
            <Select allowClear={true}
            > 
              {Object.entries(resultDecisionMap).map(([index,value])=>
                <Select.Option key={index} value={index}>{value}</Select.Option>
              )}
            </Select>
          )
        },
        
        qzCode:{
          noWrap:true,
          label:'原因代码',
          dom:
          <Col span={4} className={getFieldValue('subType')==='system'?'main_show':'main_hide'}>
            <Form.Item label='原因代码'>
              {getFieldDecorator('qzCode',{
                initialValue:qzCode
              })(
                <Select allowClear={true} 
                > 
                  {qzCodeMap.map((value,index)=>
                    <Select.Option key={index} value={value.result}>{value.result}</Select.Option>
                  )}
                </Select>
              )}
            </Form.Item>
          </Col>
          
        },
        subReason:{
          noWrap:true,
          label:'提报理由',
          dom:
          <Col span={4} className={getFieldValue('subType')==='review'?'main_show':'main_hide'}>
            <Form.Item label='提报理由'>
              {getFieldDecorator('subReason',{
                initialValue:subReason
              })(
                <Select allowClear={true}
                > 
                  {subReasonMap.map((value,index)=>
                    <Select.Option key={index} value={value.code}>{`${value.first} ${value.second}`}</Select.Option>
                  )}
                </Select>
              )}
            </Form.Item>
          </Col>
        },
        approvalStatus:{
          noWrap:true,
          label:'审批类型',
          dom:
          <Col span={4} className={getFieldValue('subType')==='review'?'main_show':'main_hide'}>
            <Form.Item label='审批类型'>
              {getFieldDecorator('approvalStatus',{
                initialValue:approvalStatus
              })(
                <Select allowClear={true}
                > 
                  {Object.entries(approvalStatusMap).map(([index,value])=>
                    <Select.Option key={index} value={index}>{value}</Select.Option>
                  )}
                </Select>
              )}
            </Form.Item>
          </Col>
          
          
        }
      }
      const GenerateSearchItemDom=({colProps,keyName,inputProps})=>{
        const resObj=searchDataKeyValueMap[keyName];
        if(resObj.dom){
          if(resObj.noWrap){
            return resObj.dom
          }else{
            return (
              <Col span={4}>
                <Form.Item label={resObj.label}>
                  {resObj.dom}
                </Form.Item>
              </Col>
            )
          }
          
          
        }else{
          return (
            <Col span={4}>
              <Form.Item label={resObj.label}>
                {getFieldDecorator(keyName, {
                })(
                  <Input allowClear={true}/>
                )}
              </Form.Item>
            </Col>
          )
        }
        
      }

      searchDom=this.searchTableKeysMap[pageType].search.map((value,index)=>
        <GenerateSearchItemDom
          key={index} keyName={value}
        />
      )
      
    }
    
    
    return(
      <Card>
        {isMy&&<RadioGroup buttonStyle="solid" defaultValue="undo"
          onChange={this.dealStatusChoosedHandler}
          style={RadioGroupStyle}
        >
          <RadioButton value="undo">待处理</RadioButton>
          <RadioButton value="doing">处理中</RadioButton>
          <RadioButton value="done">已处理</RadioButton>
        </RadioGroup>}
        {pageType==='qamy'&&<RadioGroup buttonStyle="solid" defaultValue="todo"
          onChange={this.dealStatusChoosedHandler}
          style={RadioGroupStyle}
        >
          <RadioButton value="todo">质检中</RadioButton>
          <RadioButton value="doing">已质检</RadioButton>
        </RadioGroup>}
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16} type="flex" justify="start">
            {
              searchDom
            }
            <Col span={4} >
              <Form.Item label=" ">
                <Button block
                  type="primary" 
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  查询
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>  
             
          </Row>
        </Form>
        <br/>          
        <Table
          columns={columns}
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
          rowSelection={rowSelection}
        />          
      </Card>
    )
  }
}
)
)





