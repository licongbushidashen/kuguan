import { asyncRouterMap } from '@/router'
import Vue from 'vue'

/**
 *
 * @param {*} router
 * @param {*} authInfo
 */




/**
 *
 * @param {*} routers
 * @param {*} authInfo
 */
const filterAsyncRouter = function(routers, authInfo) {
  const arr = []
  for (let i = 0; i < routers.length; i++) {
    if (authInfo[routers[i].meta.title1]) {
      arr.push(routers[i])
    } else if (authInfo[routers[i].meta.title]) {
      arr.push(routers[i])
    }
  }
  return arr
}

/**
 * 忽略用于菜单展示的传参路由
 * @param {*} routers
 * @param {*} authInfo
 */
const filterIgnoreRouter = function(routers) {
  const res = []
  routers.forEach(router => {
    const tmp = {
      ...router
    }
    if (!tmp.ignore) {
      if (tmp.children) {
        tmp.children = filterIgnoreRouter(tmp.children)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 路由重定向和角色路由完善
 */
const perfectRouter = function(authInfo, result) {
  const routerObj = {}
  let addRouter = []
  let redirect = ''
  let topRedirect = '' // 置顶的第一个路由

  for (let index = 0; index < asyncRouterMap.length; index++) {
    const mainRouter = asyncRouterMap[index]
    const accessedRouters = filterAsyncRouter(mainRouter.router, authInfo)
    console.log(accessedRouters)
    for (
      let childIndex = 0;
      childIndex < accessedRouters.length;
      childIndex++
    ) {
      const element = accessedRouters[childIndex]
      if (element.children && element.children.length > 0) {
        const firstChild = element.children[0]
        const childPath = firstChild.meta
          ? firstChild.meta.redirect || firstChild.path
          : firstChild.path
        element.redirect = element.path + '/' + childPath
      }

      // 获取跳转
      if (element.redirect) {
        if (!redirect) {
          redirect = element.redirect
        }
        const modelName = {
          crm: 'crm',
          taskExamine: 'taskExamine',
          log: 'workLog',
          book: 'addressBook',
          project: 'project',
          bi: 'bi',
          calendar: 'calendar',
          hrm: 'hrm',
          manage: 'manage',
          kchk: 'kchk'
        }
        if (modelName == mainRouter.type) {
          topRedirect = element.redirect
        }

        // 为导航头 获取每个模块的 重定向 url
        accessedRouters.push({
          path: `/${mainRouter.type}`,
          name: mainRouter.type,
          redirect: element.redirect,
          hidden: true
        })

        break
      }
    }
    routerObj[mainRouter.type] = accessedRouters
    addRouter = addRouter.concat(filterIgnoreRouter(accessedRouters))
  }

  if (redirect || topRedirect) {
    addRouter.push({
      path: '/',

      redirect: topRedirect || redirect,
      hidden: true
    })
  }
  if (result) {
    result({ router: routerObj, addRouter })
  }
}


const permission = {
  state: {
    addRouters: [],
    // crmRouters: [],
    // taskExamineRouters: [],
    // workLogRouters: [],
    // addressBookRouters: [],
    // projectRouters: [],
    // biRouters: [],
    // manageRouters: [],
    // hrmRouters: [],
    kchkRouters: [],
    handleRouters: [],
    kcglRouters: [],
    warehouseRouters: [],
    accountRouter: []
  },

  mutations: {
    SET_ROUTERS: (state, data) => {
      state.addRouters = data.addRouter
      state.warehouseRouters = data.router.warehouse || []
      state.kcglRouters = data.router.kcgl || []
      state.kchkRouters = data.router.kchk || []
      state.handleRouters = data.router.handle || []
      state.accountRouter = data.router.account || []
      // state.crmRouters = data.router.crm || []
      // state.workLogRouters = data.router.workLog || []
      // state.taskExamineRouters = data.router.taskExamine || []
      // state.addressBookRouters = data.router.addressBook || []
      // state.projectRouters = data.router.project || []
      // state.biRouters = data.router.bi || []
      // state.manageRouters = data.router.manage || []
      // state.hrmRouters = data.router.hrm || []
    },

    /**
     * 客户管理待办消息数
     */
    SET_CRMROUTERSNUM: (state, num) => {
      const messageItem = state.crmRouters[1]
      messageItem.children[0].meta.num = num
      Vue.set(state.crmRouters, 1, messageItem)
    },
    SET_CRMROUTERSNUM1: (state, num) => {
      const messageItem = state.handleRouters[0]
      messageItem.children[0].meta.num = num
      Vue.set(state.handleRouters, 0, messageItem)
    },
    SET_CRMROUTERSNUM12: (state, num) => {
      const messageItem = state.handleRouters[3]

      messageItem.children[0].meta.num = num
      Vue.set(state.handleRouters, 3, messageItem)
    },
    SET_GROUPSLIST: (state, data) => {
      state.groupsList = data
    }
  },
  actions: {
    GenerateRoutes({ commit, state }, data) {
      return new Promise(resolve => {
        // 路由完善
        perfectRouter(data, routers => {
          commit('SET_ROUTERS', routers, commit)
          resolve()
        })
      })
    }
  }
}

export default permission
