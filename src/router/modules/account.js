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
      title: 'PropertyBillManager.SpacePoint',
      icon: 'iconfont icon-kucunguanli'
    },
    children: [
      {
        name: 'Point',
        path: 'Account-Point', // 类目
        component: () => import('@/views/Account/Point'),
        meta: {
          title: '空间点位',
          title1: 'PropertyBillManager.SpacePoint',
          icon: 'iconfont icon-kucunguanli'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['account', 'system-project']
    }
      , '/views/Account/germicidal'),
    meta: {
      title: '台账管理',
      title1: 'PropertyBillManager.Disinfection',
      icon: 'iconfont icon-huaban39'
    },
    children: [
      {
        name: 'germicidal',
        path: 'Account-germicidal', // 类目
        component: () => import('@/views/Account/germicidal'),
        meta: {
          title: '消杀台账',
          title1: 'PropertyBillManager.Disinfection'
        }
      },
      {
        name: 'plant',
        path: 'Account-plant', // 类目
        component: () => import('@/views/Account/plant'),
        meta: {
          title: '绿植台账',
          title1: 'PropertyBillManager.GreenPlant'
        }
      },
      {
        name: 'Account',
        path: 'Account-water', // 类目
        component: () => import('@/views/Account/water'),
        meta: {
          title: '饮水机台账',
          title1: 'PropertyBillManager.WaterDispenser'
        }
      }


    ]
  },
  {
    ...layout({
      permissions: ['account1', 'system-project1']
    }),
    meta: {
      title: '台账报表',
      icon: 'iconfont icon-baobiao',
      title1: 'PropertyBillManager.Disinfection'
    },
    children: [
      {
        name: 'germicidalReport',
        path: 'Account-germicidalReport', // 类目
        component: () => import('@/views/Account/germicidalReport'),
        meta: {
          title: '消杀台账',
          title1: 'PropertyBillManager.Disinfection.Report'
        }
      },
      {
        meta: {
          title: '绿植台账',
          title1: 'PropertyBillManager.GreenPlant.Report'
        },
        name: 'plantReport',
        path: 'Account-plantReport', // 类目
        component: () => import('@/views/Account/plantReport')
      },
      {
        meta: {
          title: '饮水机台账',
          title1: 'PropertyBillManager.WaterDispenser.Report'
        },
        name: 'waterReport',
        path: 'Account-waterReport', // 类目
        component: () => import('@/views/Account/waterReport')
      }
      // {
      //   meta: {
      //     title: '货品出入库明细表'
      //   },
      //   name: 'warehouse',
      //   path: 'Inventory-GoodsInOutDetail', // 类目
      //   component: () => import('@/views/warehouse/GoodsInOutDetail')
      // },


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
