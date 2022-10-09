/** 系统管理路由 */
import Layout from '@/views/layout/kchk'

const layout = function(meta = {}, path = '/kchk', requiresAuth = true) {
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
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'OrderSetting.GoodsCategorys',
      icon: 's-seas'
    },
    children: [
      {
        name: 'kcgj',
        path: 'kcgj-project', // 类目
        component: () => import('@/views/kchk/goods'),
        meta: {
          title: '类目管理',
          icon: 'iconfont icon-31leimu'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'OrderSetting.GoodsInfos',
      icon: 's-seas'
    },
    children: [
      {
        name: 'kcgj-kc',
        path: 'kcgj-kc', // 库存
        component: () => import('@/views/kchk/category'),
        meta: {
          title: '货品管理',
          icon: 'iconfont icon-huopin-'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'OrderSetting.Warehouses',
      icon: 's-seas'
    },
    children: [
      {
        name: 'kcgj-ck',
        path: 'kcgj-ck', // 库存
        component: () => import('@/views/kchk/ware'),
        meta: {
          title: '仓库管理',
          icon: 'iconfont  icon-cangku'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'OrderSetting.Companys',
      icon: 's-seas'
    },
    children: [
      {
        name: 'kcgj-company',
        path: 'kcgj-company', // 库存
        component: () => import('@/views/kchk/company'),
        meta: {
          title: '往来单位',
          icon: 'iconfont icon-danwei'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'OrderSetting.OrdersIn',
      icon: 's-seas'
    },
    children: [
      {
        name: 'kcgj-put',
        path: 'kcgj-put', // 库存
        component: () => import('@/views/kchk/putstorage'),
        meta: {
          title: '入库管理',
          icon: 'iconfont icon-rukuguanli'
        }
      }
    ]
  },
  {
    ...layout({
      permissions: ['kchk', 'system-project']
    }),
    meta: {
      title: 'OrderSetting.OrdersOut',
      icon: 's-seas'
    },
    children: [
      {
        name: 'kcgj-out',
        path: 'kcgj-out', // 库存
        component: () => import('@/views/kchk/outstorage'),
        meta: {
          title: '出库管理',
          icon: 'iconfont icon-chukuguanli'
        }
      }
    ]
  }
]

