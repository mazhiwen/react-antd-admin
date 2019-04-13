import * as React from 'react';
import {Menu,Icon} from 'antd';
import { Link ,withRouter,NavLink} from 'react-router-dom'
import {routesMap} from 'routes';
import {axios,localForage,permission,history} from 'utils';
import {
  viewsMapName
} from 'configs';
import {  connect } from 'react-redux';

const { SubMenu } = Menu;

 
export default withRouter(connect()(
class ComponentInstance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedKeys:['0','1'],
      menuMap:{},
      openKeys:[],
      nestedMenus : [
        {
          label:'全部',
          url:routesMap.home.path,
          id:'home'
          
        },
        {
          label:'富士康',
          children:[
            {
              id:'games',
              url:`${routesMap.applylist.base}/all`,
              label:'富士康'
            }
          ],
          id:'homee'
        }
      ]

    };
    
  }
  onOpenChange=(openKeys)=>{
    this.setState({openKeys});
  }
  
  componentDidMount(){
    
    
    permission.getPermission('anti-fraud','view,menu,route')
      .then((value)=>{
        const {nestedMenus,menuMap,viewsList} =value;
        this.setState({
          nestedMenus,
          menuMap
        })
        console.log(viewsList);
        this.props.dispatch({
          type: 'SET_ViewsList',
          value:viewsList
        })
        // localForage.setItem('viewsList',viewsList);
        const getSelectMenu=(url)=>{

          let selectMenuData=menuMap[url];
          let match = url.match(/(\/[^\/]*){1}/g);
          let matchLength=match.length;
          if(selectMenuData){
            if(matchLength>=2){
              selectMenuData.parent=[];
              while(matchLength>1){

                selectMenuData.parent.push(menuMap[match.slice(0,matchLength-1).join('')]['id']);
                matchLength--;
              }
            }
          } 
          
          return selectMenuData;
        }

        if(getSelectMenu(this.props.location.pathname)){
          let selectMenuData=getSelectMenu(this.props.location.pathname);
          this.setState({
            selectedKeys:[selectMenuData['id']],
            openKeys:selectMenuData['parent']
          });
        }
        
        //下段 会引起react 报错 state 在 componentWillUnmount中重置state
        this.props.history.listen((location, action)=>{
          if(getSelectMenu(location.pathname)){
            let selectMenuData=getSelectMenu(location.pathname);
            this.setState({
              selectedKeys:[selectMenuData['id']]
            });
          }
          
        });
      })
      .catch(()=>{

      });
   

  }
  generateNavLinkTo(url){
    const arr=url.split('?');
    let res={
      pathname:arr[0]
    };
    if(arr.length>1){
      res.search=`?${arr[1]}`;
    }
    // 此处会发现渲染两次
    return res;
  }
  componentWillUnmount(){
    this.setState = (state,callback)=>{
      return;
    };
  }
  render(){
    const {nestedMenus,selectedKeys,openKeys} = this.state;
    return(
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={this.onOpenChange}
        style={{ height: '100%' }}
        
      >
        {
          nestedMenus.map((v,index)=>
            v.children?(
              <SubMenu 
                key={v.id} 
                title={
                  <span>
                    <Icon type="bars" />
                    {/* {v.url?(<Link to={v.url}>{v.label}</Link>):(v.label)} */}
                    {v.label}
                  </span>
                }
              >
                {
                  v.children.map((vSub2,indexSub2)=>
                    vSub2.children?(
                      <SubMenu 
                        key={vSub2.id} 
                        title={
                          <span>
                            <Icon type="setting" />
                            {/* {v.url?(<Link to={v.url}>{v.label}</Link>):(v.label)} */}
                            {vSub2.label}
                          </span>
                        }
                      >
                        {
                          vSub2.children.map((vSub3,indexSub3)=>
                              
                              <Menu.Item key={vSub3.id}>
                                <NavLink 
                                  to={this.generateNavLinkTo(vSub3.url)}
                                >
                                  {vSub3.label}
                                </NavLink>
                              </Menu.Item>
                          )
                        }
                      </SubMenu>
                    ):(
                      <Menu.Item key={vSub2.id}>
                        
                        <NavLink 
                          to={{
                            pathname:vSub2.url
                          }}
                        > 
                          <Icon type="setting" />
                          {vSub2.label}
                        </NavLink>
                        
                      </Menu.Item>
                    )
                  )
                }
              </SubMenu>
            ):(
              <Menu.Item key={v.id}>
                
                <NavLink 
                  to={{
                    pathname:v.url
                  }}
                > 
                  {/* <Icon type="bars" /> */}
                  {v.label}
                </NavLink>
                
              </Menu.Item>
            )
          )
        }
      </Menu>
    )
  }
}

)
)