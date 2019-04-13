import * as React from 'react';
import {
  Form,Row,Button,Icon,notification,Modal,
  Col,TreeSelect,Card,Table,Select,Input,Radio
} from 'antd';

import {
  axios,dataFormat,commonRequest,historyPush
} from 'utils';
import {
  relationshipList,approvalStatusMap,
} from 'configs';

import moment from 'moment';
const FormItem=Form.Item;
const ButtonGroup = Button.Group;



const {Fragment} = React;




const MoalInstance=Form.create()(class extends React.Component{
  constructor(props){
    super(props);
    this.state={
      provinceMap:{},
      cityMap:{},
      blockMap:{},
      areasTree:[]
    }
  }
  onOk=()=>{
    this.props.form.validateFields((err, values) => {
      console.log(values);
      console.log(err);
      if (!err) {
        let params={...values};
        if(values.address){
          let address=values.address.value;
          let arr= address.split('_');
          let len=arr.length-1;
          address={};
          
          
          if(len>=1){
            address.province=arr[0];
          }
          if(len>=2){
            address.city=arr[1];
          }
          if(len>=3){
            address.district=arr[2];
          }
          params.address={
            ...address,
            street:params.addressstreet
          }
        }
        
        delete params.addressstreet;
        dataFormat.deleteEmpty(params);
        console.log(params);
        axios.post(`v1/liaisons/add/${this.props.applicationId}`, params)
        .then((res)=>{
          this.props.onAddCall();
          notification['success']({
            message:'提示',
            description:'添加成功'
          });
        })
      }
    })
    
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.isShowModal!==prevProps.isShowModal){
      if(!this.props.isShowModal){
        this.props.form.resetFields()
      }
    }
  }
  componentDidMount(){ 
    Promise.all([
      commonRequest.getAreas(), 
    ])
    .then((values)=> {
      let areas=values[0];
      const {provinceMap,cityMap,blockMap,areasTree} = areas;
      this.setState(
        {
          provinceMap,
          cityMap,
          blockMap,
          areasTree
        },
        ()=>{
        }
      ); 
    }); 
  }
  render(){
    const {
      isShowModal, onCancel, form
    } = this.props;
    const {
      areasTree
    } = this.state;
    const { getFieldDecorator} = form;
    
    return(
      <Modal
        className="modalinstance"
        visible={isShowModal}
        title="联系人信息"
        okText="确认"
        onCancel={onCancel}
        onOk={this.onOk}
      >
        <Form layout="vertical">
          <FormItem label="姓名">
            {getFieldDecorator('name', {
              rules: [{required: true, message: '请输入', tragger: 'blur'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="电话">
            {getFieldDecorator('mobile', {
              rules: [{required: true, message: '请输入', tragger: 'blur'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="职位">
            {getFieldDecorator('position', {
              rules: [
              ]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="单位名称">
            {getFieldDecorator('company', {
              rules: [
              ]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="所属关系">
            {getFieldDecorator('relationship', {
              rules: [{required: true, message: '请输入', tragger: 'blur'}],
            })(
              <Select 
                >
                {Object.entries(relationshipList).map(([indexr,valuer])=>(
                  <Select.Option key={indexr} value={indexr}>{valuer}</Select.Option>
                ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem label="住址">
            {getFieldDecorator('address', {
              rules: [
                // {required: true, validator: newPwdconVal, tragger: 'blur'}
              ]
            })(
              <TreeSelect
                style={{ width: 300 }}
                // value={this.state.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={areasTree}
                placeholder="请选择省市区"
                labelInValue={true} treeNodeLabelProp="showtitle"
                allowClear={true}
                onChange={this.onChange}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('addressstreet', {
              rules: [
                // {required: true, validator: newPwdconVal, tragger: 'blur'}
              ]
            })(
              <Input placeholder="请填写具体街道"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
)




const MoalInstanceHistory=Form.create()(
  class extends React.Component{
    constructor(props){
      super(props);
      this.state={
      }
    }
    componentDidMount(){

    }
    render(){
      const {
        isShowModal, onCancel, form,
      } = this.props;
      const {
        areasTree
      } = this.state;

      return(
        <Modal
          className="modalinstance"
          visible={isShowModal}
          title="联系人信息"
          okText="确认"
          onCancel={onCancel}
          // onOk={this.onOk}
        >
          
        </Modal>
      )
    }
  }
)


export default Form.create()(class LoanList extends React.Component{

  constructor(props){
    super(props);
    this.state={
      isShowContactModal:false,
      isShowContactModalHistory:false,
      tableLoading:false,
      tableLoading1:false,
      isMy:false,
      subType:'',
      liaisons:[],
      total:0,
      provinceList:[],
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
      data:[],
    };
    this.getListSearchParams={};
    this.columns1=[
      {
        title: '通讯录中匹配到的联系人',
        dataIndex: 'matches',
      },
      {
        title: '通讯录中的关键联系人',
        dataIndex: 'keys',
      },
      {
        title: '通讯录人数',
        dataIndex: 'liaisonSize',
      }
    ];
    this.baseColumns=[
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '关系',
        dataIndex: 'relationship',
        render: (text, record, index) =>{
          return relationshipList[text]
        }
      },
      {
        title: '电话',
        dataIndex: 'mobile',
      },
      {
        title: '职位',
        dataIndex: 'position',
      },
      {
        title: '单位',
        dataIndex: 'company',
      },
      {
        title: '住址',
        dataIndex: 'address.description',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record, index) =>{
          return text?'启用':'失效'
        }
      }, 
      {
        title: '操作',
        // dataIndex: 'serialNo',
        render: (text, record, index) =>( 
            <Button
              size="small" 
              onClick={this.setMoalInstanceHistory.bind(this,true)}
            > 
              历史
            </Button>
        )
      },
      
    ];
  }
  audioClick=(e)=>{
    console.log(e);
  }
  addAllot=(params)=>{
    console.log(params);
  }

  getList=(pageParams)=>{
    axios.get('v1/operator/list',{
      params:{
        // size:pageSize,
        // page:1,
        // ...this.getListSearchParams,
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
  setMoalInstance=(state)=>{
    this.setState({
      isShowContactModal:state
    });
  }
  setMoalInstanceHistory=(state)=>{
    this.setState({
      isShowContactModalHistory:state
    });
  }
  getAntiLiasionsList(){
    axios.get(`v1/liaisons/${this.props.applicationId}`)
      .then((res)=>{
        let liaisons=this.props.data.liaisons;

        this.setState({
          liaisons:liaisons.concat(res.result)
        })
      })
  }
  onAddCall=()=>{
    this.setMoalInstance(false);
    this.getAntiLiasionsList();
  }
  componentDidMount(){
    
    this.getAntiLiasionsList();
    
     
    
  }
  render(){
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form;
    const {
      data,total,isShowContactModal,liaisons,
      tableLoading,tableLoading1,isShowContactModalHistory
    }=this.state;
    const {
      liaisonRisk,
    } = this.props.data;
    const {
      applicationId
    }=this.props;


      
    return(
      <Fragment>
        <Card
          title="联系人信息"
          extra={
            <Button onClick={this.setMoalInstance.bind(this,true)}
              size="small" type="primary"
            >
              新增
            </Button>
          }
        >        
          <Table
            loading={tableLoading} rowKey="processTime"
            columns={this.baseColumns} dataSource={liaisons}
            bordered size="small" pagination={false}
          />
          <br/>
          <Table
            loading={tableLoading1} rowKey="keys"
            columns={this.columns1} dataSource={liaisonRisk}
            bordered size="small"
          />           
        </Card>
        <MoalInstance
          onAddCall={this.onAddCall}
          applicationId={applicationId}
          isShowModal={isShowContactModal}
          onCancel={this.setMoalInstance.bind(this,false)}
        />
        <MoalInstanceHistory
          isShowModal={isShowContactModalHistory}
          onCancel={this.setMoalInstanceHistory.bind(this,false)}
        />
      </Fragment>
    )
  }
}
)






