import request from '@/utils/request'


export function ParameterDeleteMany(data) {
  return request({
    url: `/api/zjlab/Parameter/DeleteMany${data}`,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CreateParameter(data) {
  return request({
    url: '/api/zjlab/Parameter/CreateParameter',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function OrderPage(data) {
  return request({
    url: `/api/zjlab/Parameter/OrderPage`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function GetMessageType(data) {
  return request({
    url: `/api/zjlab/Parameter/GetMessageType`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function Pageusers(data) {
  return request({
    url: `/api/identity/users${data}`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function Createusers(data) {
  return request({
    url: '/api/identity/users',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function Updateusers(data) {
  return request({
    url: `/api/identity/users/${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function usersInfo(id) {
  return request({
    url: `/api/identity/users/${id}`,
    method: 'get',
    data: id,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DeleteMany(data) {
  return request({
    url: '/api/zjlab/Warehouse/DeleteMany',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


export function Create(data) {
  return request({
    url: '/api/zjlab/Warehouse/Create',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function Update(data) {
  return request({
    url: `/api/zjlab/Warehouse/Update?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetInfo(id) {
  return request({
    url: `/api/zjlab/Warehouse/Get?id=${id}`,
    method: 'get',
    data: id,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DownloadWarehouseExcel(data) {
  return request({
    url: `/api/zjlab/Warehouse/DownloadWarehouseExcel`,
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
