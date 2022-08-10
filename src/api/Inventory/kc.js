import request from '@/utils/request'

export function InventoryPage(data) {
  return request({
    url: '/api/zjlab/Inventory/InventoryPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CheckPlanPage(data) {
  return request({
    url: '/api/zjlab/CheckPlan/CheckPlanPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function DownloadInventoryExcel(data) {
  return request({
    url: `/api/zjlab/Inventory/DownloadInventoryExcel`,
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


export function Create(data) {
  return request({
    url: '/api/zjlab/CheckPlan/CreateCheckPlan',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function Update(data) {
  return request({
    url: '/api/zjlab/CheckPlan/UpdateCheckPlan',
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
