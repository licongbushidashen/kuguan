import request from '@/utils/request'
/**
 * 数据库类型
 * @param {*} data
 */
export function CreateOrder(data) {
  return request({
    url: `/api/zjlab/Order/CreateOrder`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function updataRole(data) {
  return request({
    url: `/api/zjlab/WarningRule/BtachUpdate`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function Getrole(id) {
  return request({
    url: `/api/zjlab/WarningRule/GetWarningRuleByGoodsId?GoodsId=${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CreateRole(data) {
  return request({
    url: '/api/zjlab/WarningRule/CreateManyAysnc',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GoodsInfoPage(data) {
  return request({
    url: '/api/zjlab/GoodsInfo/GoodsInfoPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetInfo(id) {
  return request({
    url: `/api/zjlab/GoodsInfo/GetGoodsInfoDetail?id=${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CreateGoodsInfo(data) {
  return request({
    url: '/api/zjlab/GoodsInfo/CreateGoodsInfo',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateGoodsInfo(data) {
  return request({
    url: `/api/zjlab/GoodsInfo/UpdateGoodsInfo?id=${data.goodsInfo.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetTree(data) {
  return request({
    url: '/api/zjlab/GoodsCategory/GetTree',
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetGoodsCategoryIds(data) {
  return request({
    url: `/api/zjlab/DataPermission/GetGoodsCategoryIds?RoleName=${data}`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function EditDataPerMission(data) {
  return request({
    url: '/api/zjlab/DataPermission/EditDataPerMission',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DeleteMany(data) {
  return request({
    url: '/api/zjlab/GoodsInfo/DeleteMany',
    method: 'delete',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DownloadGoodsInfoExcel(data) {
  return request({
    url: '/api/zjlab/GoodsInfo/DownloadGoodsInfoExcel',
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

