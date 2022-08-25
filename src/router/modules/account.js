/** 系统管理路由 */
import Layout from '@/views/layout/account'

const layout = function(meta = {}, path = '/account', requiresAuth = false) {
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
      permissions: ['account', 'system-project']
    }),
    meta: {
      title: 'InventoryManager.Inventorys',
      icon: 'iconfont icon-kucunguanli'
    },
    children: [
      {
        name: 'Point',
        path: 'Account-Point', // 类目
        component: () => import('@/views/Account/Point'),
        meta: {
          title: '空间点位',
          icon: 'iconfont icon-kucunguanli'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['account', 'system-project']
    }),
    meta: {
      title: 'InventoryManager.CheckPlans',
      icon: 's-seas'
    },
    children: [
      {
        name: 'germicidal',
        path: 'Account-germicidal', // 类目
        component: () => import('@/views/Account/germicidal'),
        meta: {
          title: '消杀台账'
        }
      },
      {
        name: 'plant',
        path: 'Account-plant', // 类目
        component: () => import('@/views/Account/plant'),
        meta: {
          title: '绿植台账'
        }
      },
      {
        name: 'Account',
        path: 'Account-water', // 类目
        component: () => import('@/views/Account/water'),
        meta: {
          title: '直饮水台账'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['account', 'system-project']
    }),
    meta: {
      title: '台账报表',
      icon: 'iconfont icon-baobiao',
      title1: 'InventoryManager.CheckPlans'
    },
    children: [
      {
        name: 'germicidalReport',
        path: 'Account-germicidalReport', // 类目
        component: () => import('@/views/Account/germicidalReport'),
        meta: {
          title: '消杀台账'
        }
      },
      {
        meta: {
          title: '绿植台账'
        },
        name: 'plantReport',
        path: 'Account-plantReport', // 类目
        component: () => import('@/views/Account/plantReport')
      },
      {
        meta: {
          title: '货品出入库明细表'
        },
        name: 'warehouse',
        path: 'Inventory-GoodsInOutDetail', // 类目
        component: () => import('@/views/warehouse/GoodsInOutDetail')
      },
      {


        name: 'warehouse',
        path: 'Inventory-InventoryBalance', // 类目
        component: () => import('@/views/warehouse/InventoryBalance'),
        meta: {
          title: '商品收发明细表',
          icon: 'iconfont icon-baobiao'
        }


      }


    ]
  }

//   {
//     ...layout({
//       permissions: ['warehouse', 'system-project']
//     }),
//     meta: {
//       title: '',
//       icon: 's-seas'
//     },
//     children: [
//       {
//         name: 'xtsz',
//         path: 'xtsz-jurisdiction', // 类目
//         component: () => import('@/views/warehouse/rmt'),
//         meta: {
//           title: '库存报表',
//           icon: 'project'
//         }
//       }


//     ]
//   }
]
