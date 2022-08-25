/** 系统管理路由 */
import Layout from '@/views/layout/warehouse'

const layout = function(meta = {}, path = '/warehouse', requiresAuth = false) {
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
      permissions: ['warehouse', 'system-project']
    }),
    meta: {
      title: 'InventoryManager.Inventorys',
      icon: 'iconfont icon-kucunguanli'
    },
    children: [
      {
        name: 'warehouse',
        path: 'warehouse-kc', // 类目
        component: () => import('@/views/warehouse/stock'),
        meta: {
          title: '库存查询',
          icon: 'iconfont icon-kucunguanli'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['warehouse', 'system-project']
    }),
    meta: {
      title: 'InventoryManager.CheckPlans',
      icon: 's-seas'
    },
    children: [
      {
        name: 'warehouse',
        path: 'warehouse-Inventory', // 类目
        component: () => import('@/views/warehouse/Inventory'),
        meta: {
          title: '库存盘点',
          icon: 'iconfont icon-kucunchaxun1'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['warehouse', 'system-project']
    }),
    meta: {
      title: '库存报表',
      icon: 'iconfont icon-baobiao',
      title1: 'InventoryManager.CheckPlans'
    },
    children: [
      {
        name: 'warehouse',
        path: 'Inventory-report', // 类目
        component: () => import('@/views/warehouse/InventoryReport'),
        meta: {
          title: '总库存报表'
        }
      },
      {
        meta: {
          title: '货品库存表'

        },
        name: 'warehouse',
        path: 'Inventory-Goods', // 类目
        component: () => import('@/views/warehouse/InventoryGoods')
      },
      {
        meta: {
          title: '出入库明细表'
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
          title: '库存余额表'
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
