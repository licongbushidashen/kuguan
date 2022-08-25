import request from '@/utils/request'

export function GetDetails(data, id) {
  return request({
    url: `/api/zjlab/CheckPlanDetail/GetDetails?checkplanId=${id}`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetProfitLoss(data, id) {
  return request({
    url: `/api/zjlab/CheckPlanDetail/GetProfitLoss?planId=${id}`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateInventoryNum(id) {
  return request({
    url: `/api/zjlab/CheckPlanDetail/UpdateInventoryNum?planId=${id}`,
    method: 'put',
    data: id,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
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
export function TotalInventory(data) {
  return request({
    url: '/api/zjlab/InventoryReport/TotalInventory',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GoodsInventory(data) {
  return request({
    url: '/api/zjlab/InventoryReport/GoodsInventory',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function InventoryBalance(data) {
  return request({
    url: '/api/zjlab/InventoryReport/InventoryBalance',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GoodsInOutDetail(data) {
  return request({
    url: '/api/zjlab/InventoryReport/GoodsInOutDetail',
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

export function DownloadTotalInventoryExcel(data) {
  return request({
    url: `/api/zjlab/InventoryReport/DownloadTotalInventoryExcel`,
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function DownloadGoodsInventoryExcel(data) {
  return request({
    url: `/api/zjlab/InventoryReport/DownloadGoodsInventoryExcel`,
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function DownloadGoodsInOutDetailExcel(data) {
  return request({
    url: `/api/zjlab/InventoryReport/DownloadGoodsInOutDetailExcel`,
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function DownloadInventoryBalanceExcel(data) {
  return request({
    url: `/api/zjlab/InventoryReport/DownloadInventoryBalanceExcel`,
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 开始盘点
export function UpdateCheckPlanBegin(id) {
  return request({
    url: `/api/zjlab/CheckPlanDetail/UpdateCheckPlanBegin?id=${id}`,
    method: 'get',
    data: id,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 完成盘点export function UpdateCheckPlanBegin(id) {
export function FinishDetail(data, id) {
  return request({
    url: `/api/zjlab/CheckPlanDetail/FinishDetail?id=${id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function StorageDetail(data, id) {
  return request({
    url: `/api/zjlab/CheckPlanDetail/StorageDetail?id=${id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 盘点导出

export function DownloadCheckPlanDetailExcel(data) {
  return request({
    url: `/api/zjlab/CheckPlanDetail/DownloadCheckPlanDetailExcel?id=${data}`,
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
