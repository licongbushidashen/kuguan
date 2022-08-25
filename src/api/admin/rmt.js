import request from '@/utils/request'


/**
 *
 * 角色增加用户  /api/identity/users/${id}/roles
 *
 */
export function usersIdroles(params, id) {
  return request({
    url: `/api/identity/users/${id}/roles`,
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function deleteusers(id) {
  return request({
    url: `/api/identity/users/${id}`,
    method: 'delete',
    data: id,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 *
 * 获取所有角色列表  /api/identity/roles/all
 *
 */
export function identityRolesAll(params) {
  return request({
    url: '/api/identity/roles/all',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 角色管理左边栏--/api/identity/roles
export function identityRoles(params) {
  return request({
    url: '/api/identity/roles',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getDetailRoles(params) {
  return request({
    url: '/api/identity/roles',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 添加角色   /api/identity/roles
export function postIdentityRoles(data) {
  return request({
    url: '/api/identity/roles',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 修改角色----/api/identity/roles
export function putIdentityRoles(data) {
  return request({
    url: '/api/identity/roles/' + data.id,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 删除角色----/api/identity/roles
export function deteleIdentityRoles(params) {
  return request({
    url: '/api/identity/roles/' + params.id,
    method: 'delete'
  })
}
// 查询角色下的所有用户
export function getRoleUsers(params) {
  return request({
    url: `/api/identity/roles/${params.id}/users?Filter=${params.Filter || ''}`,
    method: 'get',
    params: params
  })
}
// 查询角色下的部门
export function getRoleOrganization(params) {
  return request({
    url: `/api/identity/roles/${params.id}/organization-units`,
    method: 'get',
    params: params
  })
}
// 修改角色下的部门
export function putOrganizationUnits(data) {
  return request({
    url: `/api/identity/roles/${data.id}/organization-units`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
