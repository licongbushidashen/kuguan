import request from '@/utils/request'
export function TaskCenter(data) {
  return request({
    url: '/api/zjlab/Order/TaskCenter',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetLogTaskCenter(data) {
  return request({
    url: '/api/zjlab/WarningRule/GetLogTaskCenter',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function OrderPage(data) {
  return request({
    url: '/api/zjlab/Order/OrderPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetOrder(data) {
  return request({
    url: `/api/zjlab/Order/GetOrder?id=${data}`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateOrder(data, id) {
  return request({
    url: `api/zjlab/Order/UpdateOrder?id=${id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DownLoadFile(id) {
  return request({
    url: `api/zjlab/Attachment/DownLoadFile?id=${id}`,
    method: 'get',
    data: id,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 批量通过
export function BatchAgree(data) {
  return request({
    url: '/api/zjlab/Order/BatchAgree',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 批量提交
export function BatchSubmit(data) {
  return request({
    url: '/api/zjlab/Order/BatchSubmit',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 批量入库
export function BatchStorageIn(data) {
  return request({
    url: '/api/zjlab/Order/BatchStorageIn',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 批量出库
export function BatchStorageOut(data) {
  return request({
    url: '/api/zjlab/Order/BatchStorageOut',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 批量提交
export function BatchALL(data, url) {
  return request({
    url: url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
