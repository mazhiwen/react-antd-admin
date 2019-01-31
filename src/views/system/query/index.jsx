import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card
} from 'antd';
import { Link } from 'react-router-dom'

import {axios,utiDate,commonRequest} from 'utils';
import routes from 'routes';
import {stateList} from 'configs';

import moment from 'moment';

function hasErrors(fieldsError) {  
  return Object.keys(fieldsError).some(value => fieldsError[value]);
}
const pageSize=15;
class Query extends React.Component{

  constructor(props){
    super(props);
    this.state={
      total:0,
      provinceList:[],
      productList:[],
      processStatusList:[
        {id: 4,name: '全部'},
        {id: 0,name: ' 待处理'},
        {id: 1,name: ' 处理中'},
        {id: 2,name: '已处理'}
      ],
      receiveList:[
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '是'
        },
        {
          id: 2,
          name: '否'
        },
      ],
      columns:[
        {
          title: '贷款号',
          dataIndex: 'apply_id',
        },
        {
          title: '产品',
          dataIndex: 'apply_product',
        },
        {
          title: '姓名',
          dataIndex: 'apply_name',
        }, 
        {
          title: '身份证号',
          dataIndex: 'apply_cnid',
        },
        {
          title: '触发时间',
          dataIndex: 'time'
        },
        {
          title: '处理人',
          dataIndex: 'process_name',
        }, 
        {
          title: '处理状态',
          dataIndex: 'processStatusName',
        },
        {
          title: '调查结果',
          dataIndex: 'resultStatusName'
        },  
        // {
        //   title: '状态',
        //   dataIndex: 'state',
        //   render:value=><span>{stateList[value]}</span>
        // }, 
        {
          title: '操作',
          dataIndex: 'action',
          render:value=>{
            if(value.receiveStatus){
              return (
                <Button onClick={this.receive(value.index)}>领取</Button>
              )
            } else {
              return;
            }
          }
        }, 
      ],
      data:[]
    };
    this.getListSearchParams={};
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params={...values};
        if(params.times){
          let times=params.times;
          params.startDate=moment(times[0]).format("YYYY-MM-DD");
          params.startDate=moment(times[1]).format("YYYY-MM-DD");
        }
        this.getListSearchParams=values;
        this.getList(params);
      }
    });
  }
  getList=(pageParams)=>{
    axios.get('applications',{
      params:{
        approvalType:'all',
        size:pageSize,
        start:1,
        ...this.getListSearchParams,
        ...pageParams
      }
    })
      .then(res=> {
        let data=res.data;
        let dataContent=data.content;
        dataContent.forEach((value,index)=>{
          value.key=index+1;
        })
        this.setState({
          data:dataContent,
          total:data.totalElements
        });
      })
      .finally(()=>{

      })
  }
  componentDidMount(){
    // this.getList();
    commonRequest.getApplyProducts()
      .then((productList)=>{
        this.setState({
          productList:Array.concat(
            {
              code: 'all',
              name: '全部'
            },
            productList
          )
        });
      });
    commonRequest.getProvinces()
      .then((res)=>{
        this.setState({
          provinceList:Array.concat(
            {
              provinceCode: 'all',
              provinceName: '全部'
            },
            res
          )
        });
      });
      
  }
  render(){
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form;
    const {columns,data,total,productList,processStatusList,
      receiveList,provinceList
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
    return(
      <Card>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col span={4}>
              <Form.Item label="贷款号">
                {getFieldDecorator('applicationId', {
                })(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            
            <Col span={4}>
              <Form.Item label="手机号">
                {getFieldDecorator('mobile')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="姓名">
                {getFieldDecorator('name')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="联系人手机号">
                {getFieldDecorator('liaisonMobile')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="反欺诈规则编码">
                {getFieldDecorator('ruleCode')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>  
              <Form.Item label="渠道号">
                {getFieldDecorator('applyChannel')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="产品" 
              >
                {getFieldDecorator('applyProduct')(
                  <Select
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
              <Form.Item label="处理状态" 
              >
                {getFieldDecorator('processStatus')(
                  <Select
                  > 
                    {processStatusList.map((value,index)=>
                      <Select.Option key={index} value={value.id}>{value.name}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="是否已领取" 
              >
                {getFieldDecorator('isGet')(
                  <Select
                  > 
                    {receiveList.map((value,index)=>
                      <Select.Option key={index} value={value.id}>{value.name}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="省份" 
              >
                {getFieldDecorator('applyProvinceCode')(
                  <Select
                  > 
                    {provinceList.map((value,index)=>
                      <Select.Option key={index} value={value.provinceCode}>{value.provinceName}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="触发时间" 
              >
                {getFieldDecorator('times')(
                  <DatePicker.RangePicker/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  查询
                </Button>
              </Form.Item>
            </Col> 
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
              start:page
            })
          }}
          bordered size="small"
          rowSelection={rowSelection}
        />          
      </Card>
    )
  }
}

export default Form.create()(Query)