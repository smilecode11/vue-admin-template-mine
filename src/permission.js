import Layout from '@/layout'

import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // #region 正常获取用户信息
          // get user info
          await store.dispatch('user/getInfo')
          // next()
          // #endregion

          // #region 权限路由添加
          // const { roles } = await store.dispatch('user/getInfo')
          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // router.addRoutes(accessRoutes)
          // next({ ...to, replace: true })
          // #endregion

          // #region 接口路由添加
          const routes = [{
            path: '/form2',
            component: Layout,
            redirect: '/form2/index',
            name: 'Form2Container',
            meta: {
              title: 'TEMP-FORM2',
              icon: 'form'
            },
            children: [{
              path: 'index',
              name: 'Form2Index',
              component: () => import('@/views/form2/index'),
              meta: {
                title: '表单2 - 接口路由',
                icon: 'form'
              }
            }, {
              path: 'other',
              name: 'Form2Other',
              component: () => import('@/views/form2/other'),
              meta: {
                title: '表单2 - 接口路由',
                icon: 'form'
              }
            }]
          }, {
            path: '/form3',
            component: Layout,
            redirect: '/form3/index',
            name: 'Form2Container',
            meta: {
              title: 'TEMP-FORM3',
              icon: 'form'
            },
            children: [{
              path: 'index',
              name: 'Form2Index',
              component: () => import('@/views/form2/index'),
              meta: {
                title: '表单3 - 接口路由',
                icon: 'form'
              }
            }, {
              path: 'other',
              name: 'Form2Other',
              component: () => import('@/views/form2/other'),
              meta: {
                title: '表单3 - 接口路由',
                icon: 'form'
              }
            }]
          }]
          const interfaceRoutes = await store.dispatch('permission/interfaceRoutes', routes)
          //  TIP:  API没有失效! 为什么停留在当前路由上，浏览器刷新时找不到该路由？？？
          router.addRoutes(interfaceRoutes)
          next({ ...to, replace: true })
          // #endregion
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
