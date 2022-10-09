/** 系统管理路由 */
import Layout from '@/views/layout/kcgl'

const layout = function(meta = {}, path = '/kcgl', requiresAuth = true) {
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
      permissions: ['kcgl', 'system-project']
    }),
    meta: {
      title: 'SystemSetting.ParamTers',
      icon: 's-seas'
    },
    children: [
      {
        name: 'xtsz',
        path: 'xtsz-cssz', // 类目
        component: () => import('@/views/kcgl/notice'),
        meta: {
          title: '通知管理',
          icon: 'iconfont  icon-navicon-zdcs'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'SystemSetting.UserManager',
      icon: 's-seas'
    },
    children: [
      {
        name: 'xtsz',
        path: 'xtsz-user', // 类目
        component: () => import('@/views/kcgl/user'),
        meta: {
          title: '用户管理',
          icon: 'iconfont icon-yonghuguanli'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'SystemSetting.admin',
      icon: 's-seas'
    },
    children: [
      {
        name: 'xtsz',
        path: 'xtsz-jurisdiction', // 类目
        component: () => import('@/views/kcgl/rmt'),
        meta: {
          title: '权限管理',
          icon: 'iconfont icon-quanxianguanli1'
        }
      }


    ]
  }
]
