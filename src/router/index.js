import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [
    {
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }
  ]
}, {
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},

{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},

{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '控制台',
      icon: 'dashboard',
      noCache: false,
      affix: true
    }
  }]
},

{
  path: '/form',
  component: Layout,
  redirect: '/form/index',
  name: 'FormContainer',
  meta: {
    title: 'TEMP-FORM',
    icon: 'form'
  },
  children: [{
    path: 'index',
    name: 'FormIndex',
    component: () => import('@/views/form/index'),
    meta: {
      title: '表单',
      icon: 'form',
      noCache: true
    }
  },
  {
    path: 'other',
    name: 'FormOther',
    component: () => import('@/views/form/other'),
    meta: {
      title: '表单 - 其他',
      icon: 'form',
      templateId: 'temp_2'
    }
  }
  ]
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

/** 动态添加路由*/
export function asyncRoutes() {
  return []
}

export default router
