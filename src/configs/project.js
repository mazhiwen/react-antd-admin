// import packageJson from '../../package.json';
// console.log(packageJson);
const packageJson=require('../../package.json');
const data= {
  // base: 'welabantifraud',
  base: packageJson.welab.contextPath,
  appName: '我来贷反欺诈系统',
}
module.exports.default = module.exports = data