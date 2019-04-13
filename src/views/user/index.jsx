import * as React from 'react';
import {
  Form, Input, Button, notification,Select,Row,
  Col,Table,Card,Radio,Modal,Checkbox
} from 'antd';

import {
  axios,dataFormat,commonRequest,historyPush
} from 'utils';
import {
  belongMap
} from 'configs';
import {  connect } from 'react-redux';

import moment from 'moment';

const ButtonGroup = Button.Group;
const FormItem=Form.Item;

function hasErrors(fieldsError) {  
  return Object.keys(fieldsError).some(value => fieldsError[value]);
}
const pageSize=15;


const MoalInstance=Form.create()(
  class extends React.Component{
    constructor(props){
      super(props);
      this.state={
      }
    }
    onOk=()=>{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const {email,phone} = this.props.data;
          axios.post(`v1/voice/register/TINET/${phone}/${email}/${values.cno}`)
          .then((res)=>{
            let result=res.result;
            if(result.code!='0'){
              notification['error']({
                message:'提示',
                description:result.desc
              });
            }else{
              notification['success']({
                message:'提示',
                description:result.desc
              });
            }
            
          })
        }
      })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      if(this.props.isShowModal!==prevProps.isShowModal){
        if(!this.props.isShowModal){
          console.log(22);
          this.props.form.setFieldsValue({cno:''})
        }
      }
    }
    componentDidMount(){
      console.log(2);
    }
    render(){
      const {
        isShowModal, onCancel, form,data
      } = this.props;
      const {
      } = this.state;
      const { getFieldDecorator,getFieldValue,validateFields} = form;

      return(
        <Modal
          className="modalinstance"
          visible={isShowModal}
          title="坐席管理"
          okText="确认" width={700}
          onCancel={onCancel}
          onOk={this.onOk}
        >
          <Form >
            <FormItem label="分配坐席号">
              {getFieldDecorator('cno', {
                // rules: [{required: true, message: '旧密码不能为空', tragger: 'blur'}],
              })(
                <Input/>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)



const ModalAutomaticAssign=connect(
  (state) =>{
    return{
      // singleModalData:state.singleModalData.data
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
  class extends React.Component{
    onOk=()=>{
      this.props.form.validateFields((err, values) => {
        console.log(values);
        if (!err) {
          let {index,record} = this.props.data;
          const {id} = record;
          let urlTail=values.allotStatus?'addAllot':'closeAllot';
          axios.put(`v1/operator/${id}/${urlTail}`)
          .then((res)=>{
            notification['success']({
              message:'提示',
              description:'修改成功'
            });
            record.allotStatus=values.allotStatus?"yes":"no";
            // 回填列表
            this.props.onFinished({index,record});
            this.props.onCancel();
          })
        }
      })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      
      if(this.props.isShowModal!==prevProps.isShowModal){
        if(this.props.isShowModal){
          this.props.form.setFieldsValue({
            allotStatus: this.props.data.record.allotStatus==="yes"
          })
        }
      }
    }
    componentDidMount(){
      
    }
    render(){
      const {
        isShowModal, onCancel, form
      } = this.props;
      const { getFieldDecorator} = form;
      return(
        <Modal
          className="modalinstance"
          visible={isShowModal}
          okText="确认" width={700}
          onCancel={onCancel}
          onOk={this.onOk}
        >
          <Form >
            <FormItem label="是否自动分单">
              {getFieldDecorator('allotStatus', {
                valuePropName: 'checked',
              })(
                <Checkbox >是否自动分单</Checkbox>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)
)


export default Form.create()(class extends React.Component{

  constructor(props){
    super(props);
    this.state={
      tableLoading:false,
      isMy:false,
      subReasonMap:[],
      subType:'',
      total:0,
      isShowModal:false,
      isShowModalAutomaticAssign:false,
      ModalAutomaticAssignData:{},
      provinceList:[],
      productList:[],
      modalData:{},
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
         
      ]
    };
    this.getListSearchParams={};
    this.baseColumns=[
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '角色',
        dataIndex: 'cno',
      },
      {
        title: '状态',
        dataIndex: 'isStatus',
        render: (text, record, index) =>{
          return text?'启用':'失效'
        }
      }, 
      {
        title: '操作',
        // dataIndex: 'serialNo',
        render: (text, record, index) =>( 
          <ButtonGroup size="small">
            <Button 
              onClick={this.sendOpt.bind(this,record)}
            > 
              获取opt
            </Button>
            <Button 
              onClick={this.openRegiserPhone.bind(this,record)}
            > 
              坐席管理
            </Button>
            <Button 
              onClick={this.openAutomaticAssign.bind(this,{index,record})}
            > 
              自动分单
            </Button>
            <Button 
              onClick={this.resetPWD.bind(this,record)}
            > 
              重置密码
            </Button>
            <Button 
              onClick={this.unLock.bind(this,record)}
            > 
              解锁用户
            </Button>
          </ButtonGroup>
        )
      },
      
    ];
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

        console.log(params);
        this.getListSearchParams=params;
        this.getList(params);
      }
    });
  }
  getList=(pageParams)=>{
    axios.get('v1/operator/list',{
      params:{
        // size:pageSize,
        // page:1,
        ...this.getListSearchParams,
        // ...pageParams
      }
    })
      .then(res=> {
        let data=res.result;
        // data.forEach((value,index)=>{
        //   value.key=index+1;
        // })
        this.setState({
          data:data,
          // total:data.totalElements
        });

      })
      .finally(()=>{
        this.setState({
          tableLoading:false
        });
      })
  }
  openRegiserPhone=(record)=>{

    this.setState({
      modalData:record,
      isShowModal:true
    });
  }
  sendOpt=(record)=>{
    axios.post('company-authority/v1/send-mobile-code', {
      mobile: record.phone,
      type: '01',
    })
      .then((res) => {
        notification['success']({
          message:'提示',
          description:'短信验证码已发送至手机'
        });
      })
  }
  resetPWD=(record)=>{
    axios.patch(`company-authority/v1/user/${record.id}/update-user-password`, {
      isStatus: true,
      password: '123456',
    })
      .then((res) => {
        notification['success']({
          message:'提示',
          description:'已重置成功'
        });
      })
  }
  unLock=(record)=>{
    axios.patch(`company-authority/v1/user/${record.id}/user-unlock`)
      .then((res) => {
        notification['success']({
          message:'提示',
          description:'已解锁成功'
        });
      })
  }
  openAutomaticAssign=(data)=>{

    this.setState({
      ModalAutomaticAssignData:data,
      isShowModalAutomaticAssign:true
    });
  }
  modalAutomaticAssignFinished=({index,record})=>{
    let {data}=   this.state; 
    data.splice(index,1,record);
    this.setState({
      data
    })
  }
  componentDidMount(){
    
    Promise.all([
      
    ])
    .then((values)=> {
      
    });  
    this.handleSubmit();
  }
  render(){
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form;
    const {
      data,total,modalData,
      isShowModal,tableLoading,isShowModalAutomaticAssign,
      ModalAutomaticAssignData
    }=this.state;


    let columns=this.baseColumns;



    return(
      <Card>
        
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16} type="flex" justify="start">
            
            <Col span={4}>
              <Form.Item label="手机号">
                {getFieldDecorator('phone')(
                  <Input allowClear={true}/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="邮箱">
                {getFieldDecorator('email',{
                })(
                  <Input allowClear={true}/>
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
          loading={tableLoading} rowKey="email"
          columns={columns} dataSource={data}
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
          data={modalData}
          isShowModal={isShowModal}
          onCancel={()=>{this.setState({
            isShowModal:false
          })}}
        />    
        <ModalAutomaticAssign
          onFinished={this.modalAutomaticAssignFinished}
          data={ModalAutomaticAssignData}
          isShowModal={isShowModalAutomaticAssign}
          onCancel={()=>{this.setState({
            isShowModalAutomaticAssign:false
          })}}
        />         
      </Card>
    )
  }
}
)






