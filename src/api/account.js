import request from '@/utils/request'


export function GetSpacePointTree(data) {
  const url = data.parentId ? `/api/zjlab/SpacePoint/GetSpacePointTree?parentId=${data.parentId}` : `/api/zjlab/SpacePoint/GetSpacePointTree`
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
export function GetKeySpacePointTree(data) {
  return request({
    url: `/api/zjlab/SpacePoint/GetKeySpacePointTree?keyWord=${data}`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CreateSpacePoint(data) {
  return request({
    url: '/api/zjlab/SpacePoint/CreateSpacePoint',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateSpacePoint(data) {
  return request({
    url: `/api/zjlab/SpacePoint/UpdateSpacePoint?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function Delete(data) {
  return request({
    url: `/api/zjlab/SpacePoint/DeleteMany`,
    method: 'delete',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 消杀台账
export function DisinfectionPage(data) {
  return request({
    url: '/api/zjlab/Disinfection/DisinfectionPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function CreateDisinfection(data) {
  return request({
    url: '/api/zjlab/Disinfection/CreateDisinfection',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateDisinfection(data) {
  return request({
    url: `/api/zjlab/Disinfection/UpdateDisinfection?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 绿植台账
export function GreenPlantGetPage(data) {
  return request({
    url: '/api/zjlab/GreenPlant/GetPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GreenPlantCreate(data) {
  return request({
    url: '/api/zjlab/GreenPlant/Create',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GreenPlantUpdate(data) {
  return request({
    url: `/api/zjlab/GreenPlant/Update?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DisinfectionDownload(data) {
  return request({
    url: '/api/zjlab/Disinfection/DisinfectionDownload',
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DownloadGreenPlantExcel(data) {
  return request({
    url: '/api/zjlab/GreenPlant/DownloadGreenPlantExcel',
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DownloadWaterDispenserExcel(data) {
  return request({
    url: '/api/zjlab/WaterDispenser/DownloadWaterDispenserExcel',
    method: 'post',
    data: data,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 直饮水台账
export function WaterDispenserGetPage(data) {
  return request({
    url: '/api/zjlab/WaterDispenser/GetPage',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function WaterDispenserCreate(data) {
  return request({
    url: '/api/zjlab/WaterDispenser/Create',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function WaterDispenserUpdate(data) {
  return request({
    url: `/api/zjlab/WaterDispenser/Update?id=${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetBooks(data) {
  return request({
    url: `/api/zjlab/GreenPlant/GetBooks${data}`,
    method: 'get',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function DisinfectionGetBooks(data) {
  return request({
    url: `/api/zjlab/Disinfection/GetBooks${data}`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
