import {axios} from './axios';
import localForage from './localForage';

// import { configData } from 'configs';

import areas from './areas';
// import companyType from '../statics/companyType';


function getApplyProducts(){
  return new Promise(function(resolve, reject){
    localForage.getItem('applyProducts')
      .then((value)=>{
        if(value){
          resolve(localForage.getItem('applyProducts'));
        }else{
          axios.get('v1/dict/apply-products')
            .then(res=>{
              if(res.result){
                let productList=res.result;
                let productMap={};
                productList.map((value,index)=>{
                  productMap[value.code]=value.name;
                })
                let resData={
                  productList,
                  productMap
                }
                localForage.setItem('applyProducts', resData);
                resolve(resData);
              }
            })
        }
      })
  })
}

function getProvinces(){
  return new Promise(function(resolve, reject){
    localForage.getItem('provinces')
      .then((value)=>{
        if(value){
          resolve(localForage.getItem('provinces'));
        }else{
          axios.get('v1/dict/provinces')
            .then(res=>{
              // res={"code":10030000,"message":"ok","result":{"ap_list":[{"id":57,"code":"CREDIT-STAFF-SCENE-A","name":"场景贷-A"},{"id":41,"code":"APP-JDD-D","name":"APP简单贷-D"},{"id":89,"code":"LOAN-LEASEBACK-H5SJD-A","name":"H5-手机贷-A"},{"id":73,"code":"WLD-Speed-Up","name":"极速放款"},{"id":97,"code":"CREDIT-STAFF-BEIBEI-C","name":"贝贝-C"},{"id":129,"code":"APP-JDD-B","name":"APP简单贷-B"},{"id":145,"code":"SHD-B","name":"商户贷B级"},{"id":70,"code":"CREDIT-STAFF-SCENE-C","name":"场景贷-C"},{"id":86,"code":"WLD-Staff-A+","name":"工薪族A+级"},{"id":118,"code":"WLD-Staff-B","name":"工薪族B级"},{"id":66,"code":"RHZX-STAFF-A","name":"人行征信-工薪-A"},{"id":58,"code":"WLD-Staff-Lefu-A","name":"乐富-工薪族-A"},{"id":82,"code":"YHD-GJJ-D","name":"银行版简单贷D"},{"id":98,"code":"CREDIT-STAFF-BEIBEI-A","name":"贝贝-A"},{"id":114,"code":"Kaniu-Staff-A","name":"卡牛-工薪族-A"},{"id":170,"code":"LOAN-OWNER-HEXINHOUSE-C","name":"小微经营贷C"},{"id":76,"code":"Feidee-Staff-C","name":"随手记-工薪族-C"},{"id":108,"code":"LOAN-LEASEBACK-H5SJD-C","name":"H5-手机贷-C"},{"id":124,"code":"SDD-WLD-Staff-A","name":"mycompany闪电贷-A"},{"id":164,"code":"H5-SDD-A","name":"H5闪电贷-A"},{"id":42,"code":"H5-Staff-B","name":"mycompanyH5-工薪族-B"},{"id":74,"code":"LOAN-OWNER-HEXINHOUSE-D","name":"小微经营贷D"},{"id":90,"code":"H5-Staff-A","name":"mycompanyH5-工薪族-A"},{"id":122,"code":"QIHU360-STAFF-B","name":"奇虎360贷-B"},{"id":146,"code":"WLD","name":"学生族"},{"id":130,"code":"H5-JDDV2-A","name":"H5简单贷V2-A"},{"id":162,"code":"H5-Staff-C","name":"mycompanyH5-工薪族-C"},{"id":52,"code":"WLD-Staff-Easy","name":"简易贷-工薪族"},{"id":68,"code":"WLD-Shortterm-Student","name":"mycompany短期（1M）-学生"},{"id":36,"code":"H5-DSD-A","name":"H5-电商贷-A"},{"id":84,"code":"CoolPad","name":"酷派"},{"id":140,"code":"SDD-WLD-Staff-B","name":"mycompany闪电贷-B"},{"id":156,"code":"WLD-Student-Easy","name":"简易贷-学生族"},{"id":172,"code":"WLD-SDK-D","name":"mycompanySDK-D"},{"id":38,"code":"Kaniu-EasyA-Staff-C","name":"卡牛简易版A-工薪族C"},{"id":54,"code":"GJJ-APP-A","name":"APP公积金专案A"},{"id":110,"code":"Kaniu-Staff-B","name":"卡牛-工薪族-B"},{"id":126,"code":"QIHU360-STAFF-A","name":"奇虎360贷-A"},{"id":142,"code":"Feidee-Staff-A","name":"随手记-工薪族-A"},{"id":158,"code":"H5-DSD-C","name":"H5-电商贷-C"},{"id":166,"code":"ULE-Speed-Up","name":"邮乐贷-极速放款"},{"id":49,"code":"RHZX-STAFF-B","name":"人行征信-工薪-B"},{"id":33,"code":"GJJ-STAFF-A","name":"公积金-工薪-A"},{"id":105,"code":"WLD-Staff-A-Lightning","name":"闪电贷-工薪族A级"},{"id":121,"code":"Kaniu-Staff-C","name":"卡牛-工薪族-C"},{"id":153,"code":"YHD-GJJ-B","name":"银行版简单贷B"},{"id":161,"code":"H5-DSD-B","name":"H5-电商贷-B"},{"id":137,"code":"GJJ-APP-C","name":"APP公积金专案C"},{"id":61,"code":"LOAN-OWNER-HEXINHOUSE-A","name":"小微经营贷A"},{"id":101,"code":"Kaniu-EasyB-Staff-B","name":"卡牛简易版B-工薪族B"},{"id":45,"code":"H5-JDDV3-A","name":"H5简单贷V3-A"},{"id":93,"code":"GJJ-H5-B","name":"H5公积金专案B"},{"id":133,"code":"APP-XYKD-B","name":"APP信用卡贷-B"},{"id":149,"code":"LOAN-BUSINESS-WEIXUAN-B","name":"微选店主贷-B"},{"id":32,"code":"LOAN-STAFF-FANLIWANG-A","name":"返利网-A"},{"id":64,"code":"H5-Staff-D","name":"mycompanyH5-工薪族-D"},{"id":80,"code":"WLD-Staff-D","name":"工薪族D级"},{"id":136,"code":"APP-GJJD-C","name":"APP公积金贷-C"},{"id":112,"code":"H5-JDDV3-C","name":"H5简单贷V3-C"},{"id":168,"code":"LOAN-STAFF-FANLIWANG-B","name":"返利网-B"},{"id":46,"code":"WLD-Shortterm-Staff-A","name":"mycompany短期（1M）-工薪A"},{"id":78,"code":"WLD-Staff-A","name":"工薪族A级"},{"id":94,"code":"PDL","name":"打工贷"},{"id":62,"code":"WLD-Shortterm-Staff-B","name":"mycompany短期（1M）-工薪B"},{"id":102,"code":"XYD-LargeAmount","name":"薪粤贷"},{"id":134,"code":"H5-SDD-D","name":"H5闪电贷-D"},{"id":150,"code":"YHD-GJJ-A","name":"银行版简单贷A"},{"id":34,"code":"SDD-WLD-Staff-C","name":"mycompany闪电贷-C"},{"id":50,"code":"H5-Staff-JDD-D","name":"H5工薪简单贷D"},{"id":106,"code":"WLD-Student-Lightning","name":"闪电贷"},{"id":138,"code":"APP-XYKD-C","name":"APP信用卡贷-C"},{"id":154,"code":"LOAN-INSTALLMENT-CHEXIAN-C","name":"车险分期-C"},{"id":55,"code":"LOAN-BUSINESS-DSD-C","name":"自营电商贷-C"},{"id":87,"code":"QIHU360-STAFF-C","name":"奇虎360贷-C"},{"id":39,"code":"SHD-A","name":"商户贷A级"},{"id":111,"code":"LOAN-INSTALLMENT-CHEXIAN-B","name":"车险分期-B"},{"id":143,"code":"APP-XYKD-A","name":"APP信用卡贷-A"},{"id":159,"code":"H5-SDD-C","name":"H5闪电贷-C"},{"id":53,"code":"H5-JDDV2-D","name":"H5简单贷V2-D"},{"id":77,"code":"H5-SDD-B","name":"H5闪电贷-B"},{"id":109,"code":"ANJIA","name":"安家周转金"},{"id":125,"code":"GJJ-APP-D","name":"APP公积金专案D"},{"id":157,"code":"Kaniu-EasyB-Staff-C","name":"卡牛简易版B-工薪族C"},{"id":165,"code":"APP-JDD-C","name":"APP简单贷-C"},{"id":75,"code":"LOAN-LEASEBACK-H5SJD-B","name":"H5-手机贷-B"},{"id":91,"code":"RRFQ","name":"人人分期"},{"id":107,"code":"H5-Staff-JDD-B","name":"H5工薪简单贷B"},{"id":123,"code":"Null","name":"Null"},{"id":131,"code":"WLD-Fee-Free","name":"7天免息"},{"id":163,"code":"GJJ-STAFF-B","name":"公积金-工薪-B"},{"id":48,"code":"LOAN-RENT-WLD","name":"自营H5商城-租赁模式"},{"id":72,"code":"H5-JDDV3-B","name":"H5简单贷V3-B"},{"id":120,"code":"YHD-GJJ-C","name":"银行版简单贷C"},{"id":104,"code":"H5-JDDV2-B","name":"H5简单贷V2-B"},{"id":152,"code":"WLD-Staff-B+","name":"工薪族B+级"},{"id":160,"code":"LOAN-BUSINESS-WEIXUAN-A","name":"微选店主贷-A"},{"id":44,"code":"APP-GJJD-A","name":"APP公积金贷-A"},{"id":60,"code":"Kaniu-EasyA-Staff-A","name":"卡牛简易版A-工薪族A"},{"id":100,"code":"AX-LargeAmount","name":"安信贷"},{"id":116,"code":"CREDIT-STAFF-SCENE-B","name":"场景贷-B"},{"id":92,"code":"Kaniu-EasyA-Staff-B","name":"卡牛简易版A-工薪族B"},{"id":132,"code":"RHZX-STAFF-C","name":"人行征信-工薪-C"},{"id":148,"code":"H5-JDDV2-C","name":"H5简单贷V2-C"},{"id":51,"code":"GJJ-H5-A","name":"H5公积金专案A"},{"id":35,"code":"LOAN-OWNER-HEXINHOUSE-B","name":"小微经营贷B"},{"id":83,"code":"QIHU360-STAFF-D","name":"奇虎360贷-D"},{"id":139,"code":"WLD-Staff-Lefu-C","name":"乐富-工薪族-C"},{"id":155,"code":"WLD-SDK-B","name":"mycompanySDK-B"},{"id":40,"code":"H5-DSD-D","name":"H5-电商贷-D"},{"id":56,"code":"GJJ-APP-B","name":"APP公积金专案B"},{"id":96,"code":"APP-GJJD-B","name":"APP公积金贷-B"},{"id":88,"code":"WLD-Shortterm-Staff-C","name":"mycompany短期（1M）-工薪C"},{"id":128,"code":"WLD-Staff-C","name":"工薪族C级"},{"id":144,"code":"WLD-Staff-Rong360-A","name":"融360-工薪族-A"},{"id":47,"code":"WLD-SDK-A","name":"mycompanySDK-A"},{"id":79,"code":"ULE-Student","name":"邮乐贷-学生族"},{"id":127,"code":"LOAN-STAFF-FANLIWANG-C","name":"返利网-C"},{"id":135,"code":"WLD-SDK-C","name":"mycompanySDK-C"},{"id":95,"code":"WLD-Staff-Rong360-B","name":"融360-工薪族-B"},{"id":151,"code":"Kaniu-EasyB-Staff-A","name":"卡牛简易版B-工薪族A"},{"id":167,"code":"APP-XYKD-D","name":"APP信用卡贷-D"},{"id":65,"code":"APP-JDD-A","name":"APP简单贷-A"},{"id":81,"code":"LOAN-BUSINESS-WEIXUAN-C","name":"微选店主贷-C"},{"id":113,"code":"Kaniu-Staff-D","name":"卡牛-工薪族-D"},{"id":169,"code":"ULE-Staff","name":"邮乐贷-工薪族"},{"id":37,"code":"Feidee-Staff-B","name":"随手记-工薪族-B"},{"id":69,"code":"WLD-Staff-Rong360-C","name":"融360-工薪族-C"},{"id":85,"code":"CREDIT-STAFF-BEIBEI-B","name":"贝贝-B"},{"id":141,"code":"SHD-C","name":"商户贷C级"},{"id":117,"code":"LOAN-LEASEBACK-H5SJD-D","name":"H5-手机贷-D"},{"id":71,"code":"APP-GJJD-D","name":"APP公积金贷-D"},{"id":103,"code":"GJJ-STAFF-C","name":"公积金-工薪-C"},{"id":63,"code":"GJJ-H5-C","name":"H5公积金专案C"},{"id":119,"code":"WLD-Student-Lefu","name":"乐富-学生族"},{"id":67,"code":"LOAN-INSTALLMENT-CHEXIAN-A","name":"车险分期-A"},{"id":59,"code":"WLD-Staff-Rong360-D","name":"融360-工薪族-D"},{"id":43,"code":"H5-JDDV3-D","name":"H5简单贷V3-D"},{"id":99,"code":"H5-Staff-JDD-C","name":"H5工薪简单贷C"},{"id":115,"code":"SDD-WLD-Staff-D","name":"mycompany闪电贷-D"},{"id":147,"code":"H5-Staff-JDD-A","name":"H5工薪简单贷A"},{"id":171,"code":"WLD-Staff-Lefu-B","name":"乐富-工薪族-B"}]}}
              if(res.result){
                localForage.setItem('provinces', res.result);
                resolve(res.result);
              }
            })
        }
      })
  })
}
function getQzCodeMap(){
  return new Promise(function(resolve, reject){
    localForage.getItem('QzCodeMap')
      .then((value)=>{
        if(value){
          resolve(localForage.getItem('QzCodeMap'));
        }else{
          axios.get('v1/dict/qzCodes')
            .then(res=>{
              if(res.result){
                localForage.setItem('QzCodeMap', res.result);
                resolve(res.result);
              }
            })
        }
      })
  })
}
function getSubReasonMap(){
  return new Promise(function(resolve, reject){
    localForage.getItem('SubReasonMap')
      .then((value)=>{
        if(value){
          resolve(localForage.getItem('SubReasonMap'));
        }else{
          axios.get('v1/dict/sub/reason')
            .then(res=>{
              if(res.result){
                localForage.setItem('SubReasonMap', res.result);
                resolve(res.result);
              }
            })
        }
      })
  })
}
function getResultBackReason(){
  return new Promise(function(resolve, reject){
    localForage.getItem('resultBackReason')
      .then((value)=>{
        if(value){
          resolve(value);
        }else{
          axios.get('v1/dict/back/reason')
            .then(res=>{
              if(res.result){
                localForage.setItem('resultBackReason', res.result);
                resolve(res.result);
              }
            })
        }
      })
  })
}
function getResultRejectReason(){
  return new Promise(function(resolve, reject){
    localForage.getItem('resultRejectReason')
      .then((value)=>{
        if(value){
          resolve(value);
        }else{
          axios.get('v1/dict/reject/reason')
            .then(res=>{
              if(res.result){
                localForage.setItem('resultRejectReason', res.result);
                resolve(res.result);
              }
            })
        }
      })
  })
}
function getQualityCodeList(){
  return new Promise(function(resolve, reject){
    localForage.getItem('QualityCodeList')
      .then((value)=>{
        if(value){
          resolve(value);
        }else{
          axios.get('v1/config/QualityCode')
            .then(res=>{
              if(res.result){
                localForage.setItem('QualityCodeList', res.result);
                resolve(res.result);
              }
            })
        }
      })
  })
}
function getConfig(code){
  return new Promise(function(resolve, reject){
    localForage.getItem(`${code}`)
      .then((value)=>{
        if(value){
          resolve(value);
        }else{
          axios.get(`v1/config/${code}`)
            .then(res=>{
              if(res.result){
                // let data=
                let result=res.result;
                let data={};
                data.list=result;
                let map={};
                result.map((value,index)=>{
                  map[value.code]=value.val;
                })
                data.map=map;
                localForage.setItem(`${code}`, data);
                resolve(data);
              }
            })
        }
      })
  })
}
function getAreas(){
  return new Promise(function(resolve, reject){
    localForage.getItem('areas')
      .then((value)=>{
        if(value){
          resolve(value);
        }else{
          let provinceMap={};
          let cityMap={};
          let blockMap={};
          let areasTree=[];
          areas.data.forEach((value,key)=>{
            provinceMap[value.value]=value.label;
            let provinceUniqKey= `${value.value}_${key}`;
            let provinceTree={
              title: value.label,
              showtitle:`${value.label}`,
              value: provinceUniqKey,
              key: provinceUniqKey,
              children:[]
            };
            
            value.children.forEach((valueCity,keyCity)=>{
              cityMap[valueCity.value]=valueCity.label;
              let cityUniqKey= `${value.value}_${valueCity.value}_${key}${keyCity}`;
              let cityTree={
                title: `${valueCity.label}`,
                showtitle:`${value.label},${valueCity.label}`,
                value: cityUniqKey,
                key: cityUniqKey,
                children:[]
              };
              valueCity.children.forEach((valueBlock,keyBlock)=>{
                let blockUniqKey= `${value.value}_${valueCity.value}_${valueBlock.value}_${key}${keyCity}${keyBlock}`;
                cityTree.children.push({
                  title: `${valueBlock.label}`,
                  showtitle:`${value.label},${valueCity.label},${valueBlock.label}`,
                  value: blockUniqKey,
                  key: blockUniqKey
                });
                blockMap[valueBlock.value]=valueBlock.label;
              });
              provinceTree.children.push(cityTree);
            })
            areasTree.push(provinceTree);
          })
          console.log(areasTree);
          let res={provinceMap,cityMap,blockMap,areasTree};
          localForage.setItem('areas', res);
          resolve(res);
        }
      })    
  })
}



function getApplicationInfo(applicationId){
  return new Promise(function(resolve, reject){
    axios.get(`v1/allot/application/info/${applicationId}`)
      .then(res=>{
        if(res.result){
          resolve(res.result);
        }
      })
  })
}

function getWedefendReportDetails(applicationId){
  return new Promise(function(resolve, reject){
    axios.get(`v1/history/${applicationId}/detail`)
      .then(res=>{
        if(res.result){
          console.log(JSON.parse(res.result));
          resolve(JSON.parse(res.result));
        }  
      })
  })
}
export default  {
  getApplyProducts,
  getProvinces,
  getQzCodeMap,
  getSubReasonMap,
  getAreas,
  getResultBackReason,
  getResultRejectReason,
  getQualityCodeList,
  getApplicationInfo,
  getWedefendReportDetails,
  getConfig
}
