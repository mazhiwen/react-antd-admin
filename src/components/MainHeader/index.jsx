import * as React from 'react';
import {
  Layout,Dropdown,Menu,Icon,
  Form,Modal,Input,notification
} from 'antd';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import {  name,appName} from 'configs';
import {routesMap} from 'routes';
import {logOutOperate,localForage,historyPush} from 'utils';
import { axios } from '../../utils/axios';
import PWDModal from 'components/PWDModal';
import MissionPickRulesModal from 'components/MissionPickRulesModal';
import {  connect } from 'react-redux';

// const {  } = Menu;
const {Header}=Layout;
const FormItem=Form.Item;

const menu1=(
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        我的单
      </a>
    </Menu.Item>
    <Menu.Item>
      <Link to={{pathname:`${routesMap.applylist.base}/all`}}>
        贷款列表
      </Link>
    </Menu.Item>
  </Menu>
);




export default withRouter(connect(
  (state) =>{
    return{
      ViewsList:state.ViewsList.data
    }
  }
)(
class ComponentInstance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      account:'',
      isShowPWDModal:false,
      isMissionPickRulesModal:false
    };
  }
  historyPush=(path)=>{
    this.props.history.push(path);
  }
  logOut=()=>{
    logOutOperate();
  }
  setMissionPickRulesModal=(state)=>{
    this.setState({
      isMissionPickRulesModal:state
    });
  }
  setPWDModal=(state)=>{
    this.setState({
      isShowPWDModal:state
    });
  }
  componentDidMount(){
    localForage.getItem(name,(err,v)=>{
      this.setState({
        account:v
      });
      
    });
  }
  render(){
    const {
      ViewsList
    }=this.props;
    const menu2=(
      <Menu>
        {ViewsList.includes('getpatchrules')&&<Menu.Item>
          <span 
            onClick={this.setMissionPickRulesModal.bind(this,true)}
          >
            任务取件规则
          </span>
        </Menu.Item>}
        {ViewsList.includes('user')&&<Menu.Item>
          <span 
            onClick={historyPush.bind(this,{
              pathname:"/user",
            })}
          >
            用户管理
          </span>
        </Menu.Item>}
        {ViewsList.includes('setpwd')&&<Menu.Item>
          <span 
            onClick={this.setPWDModal.bind(this,true)}
          >
            修改密码
          </span>
        </Menu.Item>}
        <Menu.Item>
          <span onClick={this.logOut}>
            退出登录
          </span>
        </Menu.Item>
      </Menu>
    );
    const {
      isShowPWDModal,isMissionPickRulesModal
    }=this.state;
    return(
      <div>
        <Header className="header">
          <div className="header_left">
            <div className="logo">
              {appName}
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              className="top_menu"
            >
              {/* <Menu.Item key="1">
                <Dropdown  trigger={['click']} overlay={menu1}>
                  <div>贷款申请<Icon type="down" /></div>
                </Dropdown>
              </Menu.Item> */}

            </Menu>
          </div>

          <Dropdown  
            trigger={['click']} overlay={menu2} 
            placement="bottomRight"
            className="header_right"
          >
            <div>
              
              <a>{this.state.account}<Icon type="down" /></a>
              
            </div>
          </Dropdown>
        </Header>
        <PWDModal
          isShowPWDModal={isShowPWDModal}
          onCancel={this.setPWDModal.bind(this,false)}
        />
        <MissionPickRulesModal
          visible={isMissionPickRulesModal}
          onCancel={this.setMissionPickRulesModal.bind(this,false)}
        />
      </div>
    )
  }
}
)
)