import request from '@/utils/request'
/**
 * 数据库类型
 * @param {*} data
 */
export function GetGoodsCategoryTree(data) {
  const url = data.parentId ? `/api/zjlab/GoodsCategory/GetGoodsCategoryList?parentId=${data.parentId}` : `/api/zjlab/GoodsCategory/GetGoodsCategoryList`
  return request({
    url: url,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 类目树 关键字搜索
export function CreateGoodsCategory1(data) {
  return request({
    url: `/api/zjlab/GoodsCategory/GetGoodsCategoryList?keyWord=${data}`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CreateGoodsCategory(data) {
  return request({
    url: '/api/zjlab/GoodsCategory/CreateGoodsCategory',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateGoodsCategory(data) {
  return request({
    url: `/api/zjlab/GoodsCategory/UpdateGoodsCategory?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function Delete(data) {
  return request({
    url: `/api/zjlab/GoodsCategory/DeleteMany`,
    method: 'delete',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 数据库链接测试
 * @param {*} data
 */
export function conntestAPI(data) {
  return request({
    url: '/api/IdentityMind/dbconfig/conntest',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 数据库创建
 * @param {*} data
 */
export function dbconfigAPI(data) {
  return request({
    url: '/api/IdentityMind/dbconfig',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
