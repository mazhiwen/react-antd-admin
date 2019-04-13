import * as React from 'react';
import {
  Form, Row,Button,
  Col,Card,notification
} from 'antd';

import {axios,historyPush} from 'utils';
import {
  blacklistTypeValueMap

} from 'configs';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

import DataSet from "@antv/data-set";










const ModalInstance=Form.create()(
class extends React.Component{
  onOk=()=>{
    const {type,params}=this.props.data;
    axios.post(`v1/blacklist/${blacklistTypeValueMap[type].addUrl}/add`, params)
      .then((res)=> {
        this.props.onCancel();
        notification['success']({
          message:'操作成功',
          description:'已添加'
        });
      })
      .finally(()=>{
        
      })
    
  }
  
  render(){
    const {
      isShowModal, onCancel, form,data
    } = this.props;
    const { getFieldDecorator,getFieldValue,validateFields} = form;
    
    return(
      2
    )
  }
}
)
class Summary extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      isShowModal:false,
      addConfirmModalData:{},
      total:null,
      StackDV1:null,
      StackDV2:null,
      StackDV3:null,
      StackDV4:null,
      systemTotal:null,
      reviewTotal:null,
    }
  }
  
  getSummary=()=>{
    axios.get('v1/overview/index',{
      params:{
        
      }
    })
    .then(res=>{
      let result = res.result;
      let {
        total,systemTotal,reviewTotal,undoTotal,
        doingTotal,doneTotal,systemUndoTotal,systemDoingTotal,systemDoneTotal,
        reviewUndoTotal,reviewDoingTotal,reviewDoneTotal
      }=result;
      // 默认添值
      // systemTotal=1;
      // reviewTotal=2;
      // undoTotal=1;
      // doingTotal=2;
      // doneTotal=3;
      // systemUndoTotal=1;
      // systemDoingTotal=2;
      // systemDoneTotal=3;
      // reviewUndoTotal=1;
      // reviewDoingTotal=2;
      // reviewDoneTotal=3;

      const StackDV1=this.generateStackDV([
        {
          item: "系统进件",
          count: systemTotal
        },
        {
          item: "人工提报",
          count: reviewTotal
        }
      ]);
      const StackDV2=this.generateStackDV([
        {
          item: "待处理",
          count: undoTotal
        },
        {
          item: "处理中",
          count: doingTotal
        },
        {
          item: "已处理",
          count: doneTotal
        }
      ]);
      const StackDV3=this.generateStackDV([
        {
          item: "待处理",
          count: systemUndoTotal
        },
        {
          item: "处理中",
          count: systemDoingTotal
        },
        {
          item: "已处理",
          count: systemDoneTotal
        }
      ]);
      const StackDV4=this.generateStackDV([
        {
          item: "待处理",
          count: reviewUndoTotal
        },
        {
          item: "处理中",
          count: reviewDoingTotal
        },
        {
          item: "已处理",
          count: reviewDoneTotal
        }
      ]);
      this.setState({
        total,
        StackDV1,
        StackDV2,
        StackDV3,
        StackDV4,
        systemTotal,
        reviewTotal,
      });
    })
  }

  generateStackDV=(data)=>{
    const { DataView } = DataSet;
    let dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    return dv;
  }
  componentDidMount(){
    this.getSummary();
  }
  render(){
    const {
      isShowModal,addConfirmModalData,total,
      StackDV1,StackDV2,StackDV3,StackDV4,systemTotal,reviewTotal
    }=this.state;


    const scale = {
      percent: {
        // formatter: val => {
        //   val = val * 100 + "%";
        //   return val;
        // },
        alias:'adas'
      },
      item: { alias:'提报类型' }
    };
    
    const scale2 = {
      percent: {
        // formatter: val => {
        //   val = val * 100 + "%";
        //   return val;
        // },
        alias:'adas'
      },
      item: { alias:'处理状态' }
    };
    const scale3 = {
      percent: {
        // formatter: val => {
        //   val = val * 100 + "%";
        //   return val;
        // },
        alias:'adas'
      },
      item: { alias:'系统进件' }
    };
    const scale4 = {
      percent: {
        // formatter: val => {
        //   val = val * 100 + "%";
        //   return val;
        // },
        alias:'adas'
      },
      item: { alias:'人工提报' }
    };

    const StackChart=(props)=>(
      <Chart
        height={400} scale={props.scale} data={props.data}
        width={500} padding="auto"
      >
        <Coord type="theta" radius={0.75} />
        <Axis name="percent" />
        <Legend
          title={{
            fill: '#404040', 
            fontSize: '18', 
            fontWeight: 'bold', 
          }}
          position="left"
        />
        <Tooltip
          showTitle={false}
        />
        <Geom
          type="intervalStack" position="percent"
          color="item"
          tooltip={[
            "item*percent",
            (item, percent) => {
              percent = (percent * 100).toFixed(2) + "%";
              return {
                name: item,
                value: percent
              };
            }
          ]}
          style={{
            lineWidth: 1,
            stroke: "#fff"
          }}
        >
          <Label
            content=" " offset={-45}
            autoRotate={false}
            htmlTemplate={(text, item, index)=>{
              let {count,item:itemv,percent}=item.point;
              percent = (percent * 100).toFixed(2) + "%";
              return `<div class="intervalstack_label"><h4>${itemv}</h4><p>${count}</p><p>${percent}</p></div>`;
            }}
          />
        </Geom>
      </Chart>
    )
    return(
      <div className="page_system_beforeloan_summary">
        
        <Card title="库存总览"
          style={{
            marginBottom:5
          }}
        >
          <p className="count_wrap">
            剩余库存量:<strong>{total}</strong>
          </p>
          <div className="summary_stack_wrap">
            <div>
              <StackChart
                scale={scale} data={StackDV1}
              />
            </div>
            <div>
              <StackChart
                scale={scale2} data={StackDV2}
              />
            </div>
          </div>
        </Card>
        <Row gutter={8}>
          <Col span={12}>
            <Card
              extra={
                <Button
                  onClick={historyPush.bind(this,{
                    pathname:"/system/beforeloan/summarylist/system/code",
                  })}
                >
                  查看
                </Button>
              }
            >
              <p className="count_wrap">
                系统分单量:<strong>{systemTotal}</strong>
              </p>
              <div className="flex_wrap">
                <StackChart
                  scale={scale3} data={StackDV3}
                />   
              </div>
            </Card>
          </Col>            
          <Col span={12}>
            <Card
              extra={
                <Button
                  onClick={historyPush.bind(this,{
                    pathname:"/system/beforeloan/summarylist/review/reason",
                    // search: '?subType=blue&subsubType=2',
                  })}
                >
                  查看
                </Button>
              }
            >
              <p className="count_wrap">
                人工提报量:<strong>{reviewTotal}</strong>
              </p>
              <div className="flex_wrap">
                <StackChart
                  scale={scale4} data={StackDV4}
                />  
              </div>
            </Card>
          </Col>
        </Row>
        
      </div>
    )
  }
}

export default Form.create()(Summary)