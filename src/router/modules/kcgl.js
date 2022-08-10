/** 系统管理路由 */
import Layout from '@/views/layout/kcgl'

const layout = function(meta = {}, path = '/kcgl', requiresAuth = true) {
  return {
    path: path,
    component: Layout,
    meta: {
      // requiresAuth: requiresAuth,
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
      title: '',
      icon: 's-seas'
    },
    children: [
      {
        name: 'xtsz',
        path: 'xtsz-cssz', // 类目
        component: () => import('@/views/kchk/goods'),
        meta: {
          title: '参数设置',
          icon: 'project'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: '',
      icon: 's-seas'
    },
    children: [
      {
        name: 'xtsz',
        path: 'xtsz-user', // 类目
        component: () => import('@/views/kcgl/user'),
        meta: {
          title: '用户设置',
          icon: 'project'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: '',
      icon: 's-seas'
    },
    children: [
      {
        name: 'xtsz',
        path: 'xtsz-jurisdiction', // 类目
        component: () => import('@/views/kcgl/rmt'),
        meta: {
          title: '权限设置',
          icon: 'project'
        }
      }


    ]
  }
]
