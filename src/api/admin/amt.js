import request from '@/utils/request'

// 部门列表
export function organizationUnits(params) {
  return request({
    url: '/api/identity/organization-units',
    method: 'get',
    params: params
  })
}
// 所有部门
export function organizationUnitsAll(params) {
  return request({
    url: '/api/identity/organization-units/all',
    method: 'get',
    params: params
  })
}
// 根节点部门
export function organizationUnitsRootNode(params) {
  return request({
    url: '/api/identity/organization-units/root-node',
    method: 'get',
    params: params
  })
}
// 子部门
export function organizationUnitsFindChildren(params) {
  return request({
    url: '/api/identity/organization-units/find-children',
    method: 'get',
    params: params
  })
}
// 添加部门
export function postOrganizationUnits(data) {
  return request({
    url: '/api/identity/organization-units',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 查询部门下的人员
export function organizationUnitsUsers(params) {
  return request({
    url: `/api/identity/organization-units/${params.id}/users`,
    method: 'get',
    params: params
  })
}
// 人员详情
export function usersDetail(params) {
  return request({
    url: `/api/identity/users/${params.id}`,
    method: 'get'
  })
}
// 查询人员所在部门
export function usersOrganization(params) {
  return request({
    url: `/api/identity/users/${params.id}/organization-units`,
    method: 'get'
  })
}
// 查询人员的角色
export function rolesOrganization(params) {
  return request({
    url: `/api/identity/users/${params.id}/roles`,
    method: 'get'
  })
}
/**
 * 添加用户
 **/
export function identityUsersPost(data) {
  return request({
    url: '/api/identity/users',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 删除人员
export function deleteUsers(params) {
  return request({
    url: `/api/identity/users/${params.id}`,
    method: 'delete'
  })
}
// 编辑人员
export function identityUsersPut(data) {
  return request({
    url: `/api/identity/users/${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 编辑人员部门
export function usersOrganizationUnitsPut(data) {
  return request({
    url: `/api/identity/users/${data.id}/organization-units`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 编辑人员角色
export function usersRolesPut(data) {
  return request({
    url: `/api/identity/users/${data.id}/roles`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
