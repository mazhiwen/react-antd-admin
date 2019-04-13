// import packageJson from '../../package.json';
// console.log(packageJson);
const packageJson=require('../../package.json');
const data= {
  // base: 'companyantifraud',
  base: packageJson.company.contextPath,
  appName: 'mycompany反欺诈系统',
}
module.exports.default = module.exports = data