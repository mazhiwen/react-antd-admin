import pushBackReason from './pushBackReason'; 
import stateList from './stateList'; 
import project from './project'; 
import * as blackTypeTreeData  from './blackTypeTreeData'; 
import packageJsonObj from '../../package.json';
import extraStyle from './extraStyle';


const configs = {
  ...project,
  ...extraStyle,
  contextPath:packageJsonObj.company.contextPath,
  name:'name',
  ...blackTypeTreeData,
  authToken: 'x-user-token',
  viewsMapName:'viewsMapName',
  authMobile: 'x-user-mobile',
  phone:'phone',
  xMerchantId: 'x-merchant-id',
  checkItemInfo: 'checkItemInfo',
  userPassword: 'userPassword',
  industryInvolved: 'industryInvolved',
  wedefendOriginNameList: 'wedefendOriginNameList',
  XPARTNERCODE: 'X-PARTNER-CODE',
  partnerCode: 'partnerCode',
  expires: 1, // day
  domain: '.company.com',
  userEmail:'userEmail',
  // 分支和环境名称一致
  API: {
    'master': {
      iamPrefix: 'https://saas-dev.company.com/',
      prefix: 'https://japi-dev.company.com/company-anti-fraud/api/'
    },
    'integration': {
      iamPrefix: 'https://saas-fat.company.com/',
      prefix: 'https://japi-fat.company.com/company-anti-fraud/api/',
    },
    'pre-production': {
      iamPrefix: 'https://saas-uat.company.com/',
      prefix: 'https://japi-uat.company.com/judex/api/'
    },
    'production': {
      iamPrefix: 'https://saas.company.com/',
      prefix: 'https://channels.company.com/judex/api/',
    }
  },
  LinkAPI:{
    'integration': {
      '/graph/applicationgraph': 'http://172.20.211.252:9000/graph',
      '/rule/config': 'http://172.20.211.252:9000/customFieldList',
      '/rule/configs': 'https://xrule-fat.company.com/#!/app/ruleFiledAdd?',
      '/rule/test': 'http://172.20.211.252:9000/ruleTestList',
    },
    'production': {
      '/graph/applicationgraph': 'http://172.20.211.252:9000/graph',
      '/rule/config': 'http://172.20.211.252:9000/customFieldList',
      '/rule/configs': 'http://xrule.company.com/#!/app/ruleFiledAdd?',
      '/rule/test': 'http://172.20.211.252:9000/ruleTestList',
    }
  },
  Domains:{
    
  },
  // basename: {
  //   'master': {
  //     prefix: 'https://m-dev.company.com/judex/api/'
  //   },
  //   'integration': {
  //     prefix: 'https://m-fat.company.com/judex/api/'
  //   },
  //   'pre-production': {
  //     prefix: 'https://japi-uat.company.com/judex/api/'
  //   },
  //   'production': {
  //     prefix: 'https://channels.company.com/judex/api/',
  //   }
  // },
  isAddBlackMap:{
    self:'本人',
    contact:'联系人',
    agent:'代办人',
    companytel:'单位固定电话',
    companyname:'单位名称'
  },

  belongMap:{
    approve:'审批',
    anti:'反欺诈'
  },
  stateList,
  approvalStatusWedefendMap:{
    normal:'普通',
    experiment_pbcredit:'人行征信测试一期',
    'semi-auto':'半自动',
    manual:'人工处理',
    'semi-auto-final':'半自动审批完成',
    experiment_gjj:'公积金测试一期',
    experiment_kaniu:'卡牛测试一期',
    experiment_ylzh:'银联智慧一期',
    experiment_shd:'商户贷类型',
    experiment_gjjupgrade:'公积金用户升级',
    antifraud:'反欺诈',
    experiment_syd_pos:'自营生意贷POS',
    experiment_syd_taobao:'自营生意贷电商'
  },
  subTypeMap:{
    system:'系统进件',
    review:'人工提报'
  },
  qualityProcessStatusMap:{
    undo:'待质检',
    doing:'质检中',
    done:'已质检',
  },
  qualityResultStatusMap:{
    wrong:'差错',
    right:'无差错',
  },
  urgentMap:{
    yes:'是',
    no:'否'
  },
  resultDecisionMap:{
    'no-risk':'清白',
    'high-risk':'高风险',
    cheat:'欺诈'
  },
  ProcessStatus:{
    undo:'未调查',
    doing:'进行中',
    done:'处理完成'
  },
  ResultStatus:{
    undo:'未调查',
    'no-risk':'清白',
    'high-risk':'高风险',
    'doubtful':'可疑',
    'cheat':'欺诈'
  },
  phoneRecordStatus:{
    '1': '接通',
    '2': '无人接听',
    '3': '空号',
    '4': '停机'
  },
  relationshipList: {
    parents:"父母",
    spouse:"配偶", 
    sibling:"兄弟姐妹",
    teacher:"老师",
    classmate:"同学",
    friend:"朋友",
    colleague:"同事",
    children:"子女"
  },
  resultDecisionList:{
    'no-risk':'清白',
    'high-risk':'高风险',
    'cheat':'欺诈'
  },
  roleList: {
    "": "全部",
    "APPROVAL_PRE": "预审",
    "APPROVAL_INIT": "初审",
    "APPROVAL_FRAUD": "反欺诈",
    "APPROVAL_FINAL": "终审"
  },
  "wedefendDecisionList": {
    "accept": "通过",
    "reject":"拒绝",
    "return": "退回",
    "review": "转人工",
    "freeze": "冻结",
    "rejected": "拒绝",
    "cancelled": "取消",
    "push_backed": "退回"
    
  },
  "marriageList": [
    {
      "id": 1,
      "type": 0,
      "name": "未婚",
      "createdAt": 1488879518000,
      "updatedAt": 1488879518000
    }, {
      "id": 2,
      "type": 1,
      "name": "已婚已育",
      "createdAt": 1488879518000,
      "updatedAt": 1490095800000
    }, {
      "id": 3,
      "type": 2,
      "name": "已婚未育",
      "createdAt": 1488879518000,
      "updatedAt": 1490095803000
    }, {
      "id": 4,
      "type": 3,
      "name": "离异",
      "createdAt": 1488879520000,
      "updatedAt": 1488879520000
    }
  ],
  blacklistTypeValueMap: {
    'loanId':{
      key:'loanId',
      text:'贷款号',
    },
    'CNID':{
      key:'cnid',
      text:'身份证号',
      addUrl:'cnid'
    },
    'PHONE_NUMBER':{
      key:'phoneNumber',
      text:'手机号',
      addUrl:'personal/mobile'
    },
    'COMPANY_NAME':{
      key:'companyName',
      text:'公司名称',
      addUrl:'companyName'
    },
    'COMPANY_TELEPHONE':{
      key:'companyTelephone',
      text:'公司电话',
      addUrl:'companyTel'
    },
    'LISONS_PHONE':{
      key:'companyTelephone',
      text:'联系人',
      addUrl:'liason/mobile'
    }
  },
  "degreeList": [
    {
      "id": 1,
      "name": "小学"
    }, {
      "id": 2,
      "name": "初中"
    }, {
      "id": 3,
      "name": "高中"
    }, {
      "id": 4,
      "name": "中专"
    }, {
      "id": 5,
      "name": "大专"
    }, {
      "id": 6,
      "name": "本科"
    }, {
      "id": 7,
      "name": "硕士"
    }, {
      "id": 8,
      "name": "博士"
    }, {
      "id": 9,
      "name": "博士后"
    }, {
      "id": 10,
      "name": "高中及以下"
    }, {
      "id": 11,
      "name": "硕士及以上"
    }
  ],
  pushBackReason
  
}
module.exports.default = module.exports = configs


