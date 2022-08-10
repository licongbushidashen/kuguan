import axios from 'axios'
import cache from './cache'
import Lockr from 'lockr'
import store from '@/store'

/** 移除授权信息 */
export function removeAuth() {
  return new Promise((resolve, reject) => {
    cache.rmAxiosCache()
    store.commit('SET_ALLAUTH', null)
    delete axios.defaults.headers['Authorization']
    resolve(true)
  })
}

/** 注入授权信息 */
export function addAuth(adminToken) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers['Authorization'] = `Bearer ${adminToken}`
    // store.dispatch('SystemLogoAndName')
    resolve(true)
  })
}

/** 获取授权信息 */
export function getAuth() {
  /** 全局路由触发这个方法  如果有缓存暂时在这里交与 */
  if (Lockr.get('Authorization') && !axios.defaults.headers['Authorization']) {
    // cache.updateAxiosCache()
  }

  if (axios.defaults.headers['Authorization']) {
    return true
  }
  return false
}
