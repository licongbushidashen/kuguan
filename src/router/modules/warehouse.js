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
      icon: 's-seas'
    },
    children: [
      {
        name: 'warehouse',
        path: 'warehouse-kc', // 类目
        component: () => import('@/views/warehouse/stock'),
        meta: {
          title: '库存查询',
          icon: 'project'
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
          icon: 'project'
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
