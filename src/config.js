const getLocationOrigin = () => {
  return (
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '')
  )
}

const companyName = '易耗品管理系统'
const version = 'V11.3.3'
const baiduKey = '百度key'

export default {
  version,
  companyName,
  getLocationOrigin,
  baiduKey
}
