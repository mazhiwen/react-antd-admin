
const configs = {
  base: 'tianmianadmin',
  appName: '天冕管理后台',
  authToken: 'x-user-token',
  authMobile: 'x-user-mobile',
  xMerchantId:'x-merchant-id',
  storagePrefix: 'tianmianadmin',
  checkItemInfo:'checkItemInfo',
  userPassword:'userPassword',
  industryInvolved:'industryInvolved',
  wedefendOriginNameList:'wedefendOriginNameList',
  XPARTNERCODE:'X-PARTNER-CODE',
  partnerCode:'partnerCode',
  // 分支和环境名称一致
  API:{
    'master': {
      prefix: 'https://japi-dev.wolaidai.com/judex/api/'
    },
    'integration': {
      prefix: 'https://japi-fat.wolaidai.com/judex/api/'
    },
    'pre-production': {
      prefix: 'https://japi-uat.wolaidai.com/judex/api/'
    },
    'production': {
      prefix: 'https://channels.wolaidai.com/judex/api/',
      // iamPrefix: 'https://management.wolaidai.com/'
    }
  }
}
module.exports.default = module.exports = configs
  