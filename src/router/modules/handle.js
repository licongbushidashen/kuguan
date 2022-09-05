/** 系统管理路由 */
import Layout from '@/views/layout/handle'

const layout = function(meta = {}, path = '/handle', requiresAuth = true) {
  return {
    path: path,
    component: Layout,
    meta: {
      requiresAuth: requiresAuth,
      ...meta
    }
  }
}



export default [
  {
    ...layout({
      permissions: ['handle', 'system-project']
    }),
    meta: {
      title: 'TaskCenterSetting.TaskCenter',
      icon: 's-seas'

    },
    children: [
      {
        name: 'handle',
        path: 'handle', // 类目
        component: () => import('@/views/kchk/handle'),
        meta: {
          title: '我的待办',
          icon: 'iconfont icon-daibanshixiang',
          num: 0
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'TaskCenterSetting.TaskCenter',
      icon: 's-seas'
    },
    children: [
      {
        name: 'handle-apply1',
        path: 'handle-apply1', // 库存
        component: () => import('@/views/kchk/apply1'),
        meta: {
          title: '我的已办',
          icon: 'wk wk-schedule'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'TaskCenterSetting.TaskCenter',
      icon: 's-seas'
    },
    children: [
      {
        name: 'handle-apply',
        path: 'handle-apply', // 库存
        component: () => import('@/views/kchk/apply'),
        meta: {
          title: '我的申请',
          icon: 'wk wk-o-task'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['handle', 'system-project']
    }),
    meta: {
      title: 'TaskCenterSetting.TaskCenter',
      icon: 's-seas'

    },
    children: [
      {
        name: 'warn',
        path: 'warn', // 类目
        component: () => import('@/views/kchk/warn'),
        meta: {
          title: '预警管理',
          icon: 'wk wk-bell',
          num: 0
        }
      }


    ]
  }
]

