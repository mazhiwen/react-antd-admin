import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card,Radio
} from 'antd';
import { Link } from 'react-router-dom'
import mp3 from '../../../../images/the-wires.mp3';

import {
  axios,dataFormat,commonRequest,historyPush
} from 'utils';
import {
  ProcessStatus,ResultStatus,approvalStatusMap,
  subTypeMap,resultDecisionMap,urgentMap,belongMap
} from 'configs';

import moment from 'moment';



const RadioGroup=Radio.Group;

const RadioButton=Radio.Button;

const {Fragment} = React;
function hasErrors(fieldsError) {  
  return Object.keys(fieldsError).some(value => fieldsError[value]);
}
const pageSize=15;
class LoanList extends React.Component{

  constructor(props){
    super(props);
    this.state={
      tableLoading:false,
      src:'',
      subReasonMap:[],
      subType:'',
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
      
      data:[
        {
          key:2,
          applicationId:3
        }  
      ]
    };
    this.getListSearchParams={};
    this.baseColumns=[
      {
        title: '主叫号码',
        dataIndex: 'numberTrunk',
      },
      {
        title: '被叫号码',
        dataIndex: 'customerNum',
      },
      {
        title: '坐席号',
        dataIndex: 'cno',
      },
      {
        title: '接听状态',
        dataIndex: 'status',
      }, 
//       座席未接听
//  座席接听,未呼叫客户
//  座席接听,客户未接听
//  双方接听;
//  预测外呼,客户未接听
//  预测外呼,客户接听
//  预测外呼,已呼叫
//  预测外呼,双方接听;
//  主叫外呼接听
//  主叫外呼,客户未接听
//  主叫外呼,双方接听。
      {
        title: '呼叫时间',
        dataIndex: 'bridgeTime',
        render:value=><span>
          {moment(value).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      },
      {
        title: '通话时长',
        dataIndex: 'bridgeDuration',
      },
      {
        title: '贷款号',
        dataIndex: 'applicationId',
      },
      {
        title: '操作',
        dataIndex: 'voiceFileUrl',
        render:(text,record)=>{
          return (
            <div 
              // onClick={this.audioClick.bind(this,record.voiceUid)}
            >
              {text&&<audio 
                src={text} 
                controls controlsList="nodownload"
              >
                Your browser does not support the <code>audio</code> element.
              </audio>}
            </div>
          )
          
        }
      },
      
    ];
  }
  audioClick=(text)=>{
    axios.get(`v1/voice/downloadVoiceFile/${text}`,{

      // responseType:'arraybuffer',
      useOrigin:true
    })
      .then(res=> {
      console.log(res);
      let src="data:audio/mp3;base64,"+res.data;
      // let src=URL.createObjectURL(new Blob(res.data,{type:'application/octet-stream'}));
      console.log(src);
      this.setState({src});
      //   let blob = new Blob([res], {type: 'application/octet-stream'});
      //   // window.URL.createObjectURL(event.data)
      //   let URL = window.URL || window.webkitURL
      //       let objectUrl = URL.createObjectURL(blob)
      //       if ('aaa') {
      //         var a = document.createElement('a')
      //         // safari doesn't support this yet
      //         if (typeof a.download === 'undefined') {
      //           window.location = objectUrl
      //         } else {
      //           a.href = objectUrl
      //           a.download = 'aaa.mp3'
      //           document.body.appendChild(a)
      //           a.click()
      //           a.remove()
      //         }
      //       } else {
      //         window.location = objectUrl
      //       }

      //   console.log(blob);
      })
  }
  handleSubmit = (e) => {
    e&&e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          tableLoading:true
        });
        let params={...values};
        dataFormat.deleteEmpty(params);
        if(params.productCode){
          params.productCode=params.productCode.join();
        }
        if(params.rangeTimes){
          let times=params.rangeTimes;
          delete params.rangeTimes;
          params.startDate=moment(times[0]).format("YYYY-MM-DD");
          params.endDate=moment(times[1]).format("YYYY-MM-DD");
        }
        this.getListSearchParams=params;
        this.getList(params);
      }
    });
  }
  getList=(pageParams)=>{
    let url=this.isMy?'v1/voice/mylist':'v1/voice/list';
    axios.get(url,{
      params:{
        size:pageSize,
        page:1,
        ...this.getListSearchParams,
        ...pageParams
      }
    })
      .then(res=> {
        let data=res.result;
        data.forEach((value,index)=>{
          value.key=index+1;
        })
        this.setState({
          data:data,
          total:data.total
        });
      })
      .finally(()=>{
        this.setState({
          tableLoading:false
        });
      })
  }

  
  componentDidMount(){
    
    
    this.isMy = this.props.location.pathname==='/system/record/list'?false:true;
 
    this.handleSubmit();
    

    
  }
  render(){
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form;
    const {
      data,total,productList,subType,productCode,
      subReasonMap,tableLoading,src
    }=this.state;


    let columns=this.baseColumns;



    return(
      
      <Card>
        {/* <audio 
      src={src} 
      controls controlsList="nodownload"
    >
      Your browser does not support the <code>audio</code> element.
    </audio> */}
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16} type="flex" justify="start">
            <Col span={4}>
              <Form.Item label="申请时间" 
              >
                {getFieldDecorator('rangeTimes')(
                  <DatePicker.RangePicker/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="被叫号码">
                {getFieldDecorator('customerNum', {
                })(
                  <Input allowClear={true}/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="坐席号">
                {getFieldDecorator('cno')(
                  <Input allowClear={true}/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="接听状态" 
              >
                {getFieldDecorator('status',{
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
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="贷款单号">
                {getFieldDecorator('applicationId')(
                  <Input allowClear={true}/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="录音来源">
                {getFieldDecorator('belong',{
                  initialValue:'approve',
                  rules: [
                    {required: true, message: '请选择录音来源'}
                  ]
                })(
                  <Select allowClear={true}
                  > 
                    {Object.entries(belongMap).map(([index,value])=>
                      <Select.Option key={index} value={index}>{value}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4} >
              <Form.Item label=" ">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  查询
                </Button>
                <Button
                  style={{
                    marginLeft:10
                  }}
                  type="primary"
                  disabled={hasErrors(getFieldsError())}
                >
                  重置
                </Button>
              </Form.Item>
            </Col> 
          </Row>
        </Form>
        <br/>          
        <Table
          loading={tableLoading}
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
        />          
      </Card>
    )
  }
}

export default Form.create()(LoanList)





