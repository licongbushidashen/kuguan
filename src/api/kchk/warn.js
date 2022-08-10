import request from '@/utils/request'

export function WarehousePage(data) {
  return request({
    url: '/api/zjlab/Warehouse/WarehousePage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DeleteMany(data) {
  return request({
    url: '/api/zjlab/Warehouse/DeleteMany',
    method: 'delete',
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
