import request from '@/utils/request'

export function CompanyPage(data) {
  return request({
    url: '/api/zjlab/Company/CompanyPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DeleteMany(data) {
  return request({
    url: '/api/zjlab/Company/DeleteMany',
    method: 'delete',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


export function Create(data) {
  return request({
    url: '/api/zjlab/Company/Create',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function Update(data) {
  return request({
    url: `/api/zjlab/Company/Update?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetInfo(id) {
  return request({
    url: `/api/zjlab/Company/Get?id=${id}`,
    method: 'get',
    data: id,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DownloadWarehouseExcel(data) {
  return request({
    url: `/api/zjlab/Company/DownloadWarehouseExcel`,
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 单位类别
export function CompanyCategoryPage(data) {
  return request({
    url: '/api/zjlab/CompanyCategory/CompanyCategoryPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CompanyCreate(data) {
  return request({
    url: '/api/zjlab/CompanyCategory/Create',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CompanyUpdate(data) {
  return request({
    url: `/api/zjlab/CompanyCategory/Update?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CompanyDeleteMany(data) {
  return request({
    url: '/api/zjlab/CompanyCategory/DeleteMany',
    method: 'delete',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 大类名称
export function GoodsCategoryDetailGetList(data) {
  return request({
    url: `/api/zjlab/GoodsCategoryDetail/GetList${data}`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function GoodsCategoryDetailCreate(data) {
  return request({
    url: '/api/zjlab/GoodsCategoryDetail/Create',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GoodsCategoryDetailUpdate(data) {
  return request({
    url: `/api/zjlab/GoodsCategoryDetail/Update?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function GoodsCategoryDetailDelete(data) {
  return request({
    url: `/api/zjlab/GoodsCategoryDetail/Delete?id=${data}`,
    method: 'delete',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
