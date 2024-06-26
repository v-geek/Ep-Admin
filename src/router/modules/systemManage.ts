export default {
  path: '/systemManage',
  name: 'systemManage',
  redirect: '/systemManage/account',
  meta: {
    title: '系统管理',
    icon: 'ep:setting'
  },
  children: [
    {
      path: '/systemManage/account',
      name: 'systemManageAccount',
      component: '/systemManage/account/index',
      meta: {
        title: '账号管理'
      },
      children: [
        {
          path: '/systemManage/account/page1',
          name: 'systemManageAccountPage1',
          component: '/systemManage/account/childs/page1',
          meta: {
            title: '子页面1',
            showInMenu: false
          },
          children: [
            {
              path: '/systemManage/account/pageOuter',
              name: 'systemManageAccountPageOuter',
              component: '/systemManage/account/childs/pageOuter',
              meta: {
                title: '嵌套最外层子页面-Outer',
                showInMenu: false
              }
            }
          ]
        }
      ]
    },
    {
      path: '/systemManage/role',
      name: 'systemManageRole',
      component: '/systemManage/role/index',
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/systemManage/menu',
      name: 'systemManageMenu',
      component: '/systemManage/menu/index',
      meta: {
        title: '菜单管理'
      }
    }
  ]
}
