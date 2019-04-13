import * as React from 'react';
import {
  Button,Icon
} from 'antd';
const ALiIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1108658_01qizur4x5ct.js', // 在 iconfont.cn 上生成
});
// 全局统一样式的formitem组件
//垂直排列，一行水平label input
// 配合外层Form 加 className="inlineblock_formwrap"
const ComponentInstance=(props)=>{
  const {type,onClick}=props;
  return(
  
    <Button shape="circle" type="dashed"
      onClick={onClick} className="basic_icon"
    >
      <ALiIcon  type={type} />
    </Button>
  )
};

export default ComponentInstance;