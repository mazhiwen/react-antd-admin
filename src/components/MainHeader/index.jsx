import * as React from 'react';
import {Layout,Dropdown,Menu,Avatar,Icon} from 'antd';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import localForage from 'utils/localForage';

const { SubMenu } = Menu;
const {Header,Sider,Content}=Layout;


const menu1=(
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        我的单
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        贷款列表
      </a>
    </Menu.Item>
  </Menu>
);
const menu2=(
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        修改密码
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        退出登录
      </a>
    </Menu.Item>
  </Menu>
);
class ComponentInstance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      account:''
    };
  }
  historyPush=(path)=>{
    this.props.history.push(path);
  }


  componentDidMount(){
    localForage.getItem('account',(err,v)=>{
      this.setState({
        account:v
      });
      
    });
  }
  render(){
    return(
      <Header className="header">
        <div className="header_left">
          <div className="logo">
            我来贷审批系统
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={['1']}
            className="top_menu"
          >
            <Menu.Item key="1">
              <Dropdown  trigger={['click']} overlay={menu1}>
                <div>贷款申请<Icon type="down" /></div>
              </Dropdown>
            </Menu.Item>
          </Menu>
        </div>
        <Dropdown  
          trigger={['click']} overlay={menu2} 
          placement="bottomRight"
          className="header_right"
        >
          <div>
            <Avatar>
              {this.state.account}
            </Avatar>
          </div>
        </Dropdown>
      </Header>
    )
  }
}

export default withRouter(ComponentInstance)