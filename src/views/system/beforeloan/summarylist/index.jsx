import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card,Progress,notification,Radio
} from 'antd';
import { Link } from 'react-router-dom'

import {axios,commonRequest,historyPush,localForage} from 'utils';
import {
  RadioGroupStyle,approvalStatusWedefendMap
} from 'configs';
const ButtonGroup = Button.Group;

const RadioGroup=Radio.Group;

const RadioButton=Radio.Button;


export default Form.create()(
class extends React.Component{
  
  constructor(props){
    super(props);
    
    this.state={
      columns:[ 
        
      ],
      data:[],
      rowKey:'',
      subType:props.match.params.subType||'system',
      subsubType:props.match.params.subsubType||'code',
    };
    this.subsubTypeMap={
      code:'原因代码',
      productName:'产品名',
      reason:'提报理由',
      approvalStatus:'审批类型'
    };
    this.productMap={};
    this.baseColumns=[
      // {
      //   title: '原因代码',
      //   dataIndex: 'code',
      // },
      {
        title: '案件量',
        dataIndex: 'total',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: '处理中',
        dataIndex: 'doingTotal',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.doingTotal - b.doingTotal,
      }, 
      {
        title: '待处理',
        dataIndex: 'undoTotal',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.undoTotal - b.undoTotal,
      },
      {
        title: '已处理',
        dataIndex: 'doneTotal',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.doneTotal - b.doneTotal,
      },
      {
        title: '处理中比例',
        key: 'a',
        render:(text,record)=>{
          const {doingTotal,total} = record;
          let percent=parseFloat(((doingTotal/total)*100).toFixed(0));
          return ( 
            <Progress percent={percent} />
          )
        }
      }, 
      {
        title: '操作',
        key:'b',
        render:(text,record)=>{
          
          return (
            <Button 
              size="small" type="primary"
              onClick={()=>{
                const {subType,subsubType} = this.state;
                let search=new URLSearchParams();
                search.set('subType',subType);
                search.set('subsubType',subsubType);
                search.set(subsubType,record[subsubType]);
                
                historyPush.call(this,{
                  pathname:"/system/beforeloan/loanlist",
                  search: `?${search.toString()}`,
                })
              }}
            >
              查看详情
            </Button>
          )
        }
      }, 
    ];
  }
  getList=()=>{
    // const subsubType=this.subsubType;
    const {subType,subsubType} = this.state;
    axios.get(`v1/overview/${subType}/${subsubType}`,{
    })
      .then(res=>{
        let result = res.result;
        let data=[];
        // result&&result.map((value,index)=>{
        //   data.push({
        //     doingTotal:value.doingTotal,
        //     total:value.total,
        //     code:value.code,
        //     key:index
        //   })
        // })
        result&&result.map((value,index)=>{
          result[index].key=index;
        })
        let firstColumns={
          title:this.subsubTypeMap[subsubType],
          
          dataIndex: subsubType,
        }
        if(subsubType==='approvalStatus'){
          firstColumns.render=(text,record)=>{
            return approvalStatusWedefendMap[text];
          }
        }
        this.setState({
          columns:Array.concat(
            firstColumns,
            this.baseColumns
          ),
          data:result,
          rowKey:subsubType
        });
      })
  }
  subsubtypeActiveHandler=(e)=>{
    this.setState({
      subsubType:e.target.value
    },()=>{
      this.getList();
    })
    
  }
  subtypeActiveHandler=(e)=>{
    const subType=e.target.value;
    this.setState({
      subType,
      subsubType:subType==='system'?'code':'reason'
    },()=>{
      this.getList();
    })
  }
  componentDidMount(){
    this.getList();
    Promise.all([
      commonRequest.getApplyProducts(), 
      commonRequest.getSubReasonMap(), 
      commonRequest.getQzCodeMap()
    ])
    .then((values)=> {
      console.log(values);
      this.productMap=values[0].productMap;
      this.setState(
        {
          
          // subReasonMap:values[1],
          // qzCodeMap:values[2]
        },
        ()=>{
        }
      ); 
    });  
  }

  render (){
    const {
      columns,data,rowKey,subType,subsubType
    }=this.state;
    
    return(
      <div>
        <Card 
          extra={
            <Button 
              onClick={historyPush.bind(this,{pathname:"/system/beforeloan/summary"})}
            >
              返回总览
            </Button>
          }
        >
          <RadioGroup value={subType} buttonStyle="solid"
            onChange={this.subtypeActiveHandler}
            style={RadioGroupStyle}
          >
            <RadioButton value="system">系统进件</RadioButton>
            <RadioButton value="review">人工提报</RadioButton>
          </RadioGroup>
          {subType==='system'&&<RadioGroup value={subsubType} 
            buttonStyle="solid"
            onChange={this.subsubtypeActiveHandler} style={RadioGroupStyle}
          >
            <RadioButton value="code">原因代码</RadioButton>
            <RadioButton value="productName">产品类型</RadioButton>
          </RadioGroup>}
          {subType==='review'&&<RadioGroup value={subsubType}
            buttonStyle="solid" 
            onChange={this.subsubtypeActiveHandler} style={RadioGroupStyle}
          >
            <RadioButton value="reason">提报理由</RadioButton>
            <RadioButton value="approvalStatus">审批类型</RadioButton>
            <RadioButton value="productName">产品类型</RadioButton>
          </RadioGroup>}

          <br/>          
          <Table
            columns={columns} dataSource={data}
            bordered 
            // rowKey={rowKey}
            size="small" pagination={false}
          /> 

        </Card>
        

      </div>
    )
  }
}
)

