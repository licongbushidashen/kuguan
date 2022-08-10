import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
// import { Message } from 'element-ui'
// import { getAuth } from '@/utils/auth' // 验权
// import { getAuth } from '@/src/utils/auth' // 验权
let loadAsyncRouter = false
// const whiteList = ['/login', '/welcome'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (to.meta.disabled) {
    next(false)
    return
  }
  NProgress.start()
  /** 请求头包含授权信息 并且 页面必须授权 直接进入 */
  if (!loadAsyncRouter) {
    console.log(store.getters.allAuth)
    loadAsyncRouter = true

    store.dispatch('GenerateRoutes', store.getters.allAuth).then(() => {
      // 根据auths权限生成可访问的路由表
      router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      if (to.path === '/404') {
        next({
          path: to.redirectedFrom || '/',
          replace: true
        })
      } else {
        next({
          ...to,
          replace: true
        })
      }
    })
  }


  if (localStorage.getItem('accessToken')) {
    next()
  } else {
    if (to.fullPath == '/login') {
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
    }

    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
