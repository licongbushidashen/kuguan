import request from '@/utils/request'
/**
 * 数据库类型
 * @param {*} data
 */
export function getdbtypeAPI(data) {
  return request({
    url: '/api/IdentityMind/dbfieldmapconfig/dbtype',
    method: 'get',
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
/**
 * 数据库更改
 * @param {*} data
 */
export function dbconfigupdateAPI(data, id) {
  return request({
    url: `/api/IdentityMind/dbconfig/update?id=${id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 客户系统表
 * @param {*} data
 */
export function systablestructureAPI(data) {
  return request({
    url: `/api/IdentityMind/dbconfig/systablestructure?id=${data.id}&tableName=${data.tableName}`,
    method: 'get',

    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 客户系统表关联
 * @param {*} data
 */
export function ConfigMapAsyncAPI(data) {
  return request({
    url: `/api/IdentityMind/dbfieldmapconfig/MapTableAsync?configId=${data.id}`,
    method: 'get',

    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 客户系统表匹配字段
 * @param {*} data
 */
export function MapFieldAsyncAPI(data) {
  return request({
    url: `/api/IdentityMind/dbfieldmapconfig/MapFieldAsync?configId=${data.configId}&sysTableName=${data.sysTableName}&sysFieldName=${data.sysFieldName}`,
    method: 'get',

    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 客户系统表结构
 * @param {*} data
 */
export function systablesAPI(data) {
  return request({
    url: `/api/IdentityMind/dbconfig/systables?id=${data.id}`,
    method: 'get',

    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 平台系统数据
 * @param {*} data
 */
export function plattablesAPI() {
  return request({
    url: `/api/IdentityMind/dbconfig/plattables`,
    method: 'get',

    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 平台系统数据字段
 * @param {*} data
 */
export function plattablestructureAPI(name) {
  return request({
    url: `/api/IdentityMind/dbconfig/plattablestructure?tableName=${name}`,
    method: 'get',

    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 创建
 * @param {*} data
 */
export function dbfieldmapconfig(data) {
  return request({
    url: `/api/IdentityMind/dbfieldmapconfig`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 更新
 * @param {*} data
 */
export function dbfieldmapconfigupdate(data, id) {
  return request({
    url: `/api/IdentityMind/dbfieldmapconfig/update?id=${id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 列表
 * @param {*} data
 */
export function systemRoleQueryProjectRoleListAPI(data) {
  return request({
    url: '/api/IdentityMind/dbconfig/DBConfigPageAsync',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 角色
 * @param {*} data
 */
export function systemMenuGetWorkMenuListAPI(data) {
  return request({
    url: 'adminMenu/getWorkMenuList',
    method: 'post',
    data: data
  })
}

/**
 * 设置
 * @param {*} data
 */
export function systemRoleSetWorkRoleAPI(data) {
  return request({
    url: 'adminRole/setWorkRole',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 删除项目角色
 */
export function systemRoleDeleteWorkRoleAPI(data) {
  return request({
    url: `/api/IdentityMind/dbconfig?id=${data.id}`,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

