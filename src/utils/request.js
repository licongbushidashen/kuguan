import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { removeAuth } from '@/utils/auth'
import qs from 'qs'
import { debounce } from 'throttle-debounce'
import router from '../router'
import Lockr from 'lockr'
/**
 * 检查dom是否忽略
 * @param {*} e
 */
const clearCacheEnterLogin = debounce(500, () => {
  removeAuth()
    .then(() => {
      location.reload() // 为了重新实例化vue-router对象 避免bug
    })
    .catch(() => {
      location.reload()
    })
})

const errorMessage = debounce(500, (message, type = 'error') => {
  Message({
    message: message,
    duration: 1500,
    type: type
  })
})

const confirmMessage = debounce(1000, message => {
  MessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    showCancelButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning'
  })
    .then(() => {
      if (
        (window.app.$route && window.app.$route.name !== 'login') ||
        !window.app.$route
      ) {
        clearCacheEnterLogin()
      } else {
        removeAuth()
      }
    })
    .catch(() => {})
})

var https = ''
var httpAuto = ''
if (process.env.NODE_ENV === 'production') {
  https = 'https://wms.demo.wy5u.com'
  httpAuto = 'https://wms-auth.demo.wy5u.com'
} else {
  https = 'https://wms.demo.wy5u.com'
  // https = 'http://identity.zisu.edu.cn'
  httpAuto = ''
  // httpAuto = 'http://192.168.18.88:6080'
}
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'
// 创建axios实例
const service = axios.create({
  baseURL: https, // api 的 base_url
  timeout: 600000 // 请求超时时间
})


// else if (config.url == '/api/abp/application-configuration') {
// config.baseURL = httpAuto
// config.headers['Authorization'] = `Bearer ${Lockr.get('accessToken')}`
// }
// request拦截器
service.interceptors.request.use(
  config => {
    config.headers['accept-language'] = 'zh-Hans'
    if (process.env.NODE_ENV === 'production') {
      if (config.url == '/connect/token') {
        config.baseURL = httpAuto
      } else {
        config.baseURL = https
      }
    } else {
      if (config.url == '/connect/token') {
        config.baseURL = '/file1'
      } else if (config.url.indexOf('/api/identity/') != -1) {
        config.baseURL = '/file2'
      } else if (config.url == '/api/abp/application-configuration') {
        config.baseURL = '/file2'
      } else {
        config.baseURL = '/file2'
      }
    }
    config.headers['Authorization'] = `Bearer ${Lockr.get('accessToken')}`
    const flag =
      config.headers['Content-Type'] &&
      config.headers['Content-Type'].indexOf('application/json') !== -1
    if (!flag) {
      const mult =
        config.headers['Content-Type'] &&
        config.headers['Content-Type'].indexOf('multipart/form-data') !== -1
      console.log(config)
      if (mult) {
        config.data = config.data
      } else {
        // config.data = config.data
        config.data = qs.stringify(config.data)
      }
    } else {
      if (config.data === undefined || config.data === null) {
        // 不传参的情况下 json类型的提交数据，校准为 空对象
        config.data = {}
      }
    }
    return config
  },
  error => {
    // Do something with request error

    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data

    if (response.status === 200 && response.config.responseType === 'blob') {
      // 文件类型特殊处理
      if (
        response.headers['content-disposition'] ||
        (response.headers['content-type'] &&
          response.headers['content-type'].indexOf('application/pdf') != -1)
      ) {
        return response
      } else if (response.data) {
        const resultBlob = new Blob([response.data], {
          type: 'application/json'
        })
        const fr = new FileReader()
        // fr.onload = function () {
        //   const result = JSON.parse(this.result)
        //   // 附件下载反馈的302 忽略
        //   if (result.msg && result.code !== 302) {
        //     errorMessage(result.msg, result.code == 1 ? 'success' : 'error')
        //   }
        // }
        fr.readAsText(resultBlob)
      }
      // eslint-disable-next-line no-constant-condition
    } else if (!res.access_token && false) {
      // 302	登录已失效
      if (res.code === 302) {
        if (res.data && res.data.extra === 1) {
          confirmMessage(
            `您的账号${
              res.data.extraTime
            }在别处登录。如非本人操作，则密码可能已泄漏，建议修改密码`
          )
        } else {
          clearCacheEnterLogin()
        }
      } else if (res.code === 1005) {
        router.push('/welcome')
      } else {
        if (res.msg) {
          errorMessage(res.msg)
        }
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    if (error.response) {
      const response = error.response
      if (response.status == 401) {
        localStorage.removeItem('accessToken')
        router.push('/login')
      } else if (response.status == 500) {
        errorMessage('网络错误，请检查您的网络')
      } else if (response.status == 400) {
        errorMessage(response.data.error.details)
      } else if (response.data && response.data.error.message) {
        errorMessage(response.data.error.message)
      } else if (response.error && response.error.details) {
        errorMessage(response.error.details)
      }
    }
    return Promise.reject(error)
  }
)

export default service
