// import packageJson from '../../package.json';
// console.log(packageJson);
const packageJson=require('../../package.json');
const data= {
  // base: 'companyXXXantifraud',
  base: packageJson.companyXXX.contextPath,
  appName: 'XXX贷反欺诈系统',
}
module.exports.default = module.exports = data