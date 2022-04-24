/**
 * 基础路由
 * @type { *[] }
 */
import { getShareInfo } from '@/utils/share.js'
import { overdueToken } from '@/utils/wxload.js'
import { setToken, getToken } from '@/utils/loaclStting.js'

export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '天空之橙年卡购买',
      keepAlive: false
    }
  },
  {
    path: '/user',
    component: () => import('@/views/user/user.vue'),
    meta: {
      title: '用户信息',
      keepAlive: false
    }
  },
  {
    path: '/deawcard',
    component: () => import('@/views/user/studentauthuser.vue'),
    meta: {
      title: '学生卡认证领取',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      if (!getToken()) {
        overdueToken()
        return
      }
      let wxConfig = {
        title: '天空之橙，会员卡领取',
        desc: '天空之橙，会员卡领取',
        link: location.origin + location.pathname + location.search,
        imgUrl: 'http://api.skyorange.cn/wxh5/skylogo.jpg',
        success(res) {}
      }
      getShareInfo(wxConfig, res => {
        console.log('分享完成===beforeEnter', res.data)
        next()
      })
    }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/index.vue'),
    meta: {
      title: '管理员页面',
      keepAlive: false
    }
  },

  {
    path: '/codepage',
    component: () => import('@/views/codePage/index.vue'),
    meta: {
      title: '天空之橙双创艺术空间',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // ...
      console.log(to, from, '天空之橙双创艺术空间')
      next()
    }
  },
  {
    path: '/newyears',
    component: () => import('@/views/newyears/newyears.vue'),
    meta: {
      title: '春节特权卡',
      keepAlive: false
    }
  },
  {
    path: '/couponpage',
    component: () => import('@/views/couponpage/index.vue'),
    meta: {
      title: '天空之橙抵扣券',
      keepAlive: false
    }
  },
  {
    path: '/applypage',
    component: () => import('@/views/applypage/index.vue'),
    meta: {
      title: '天空之橙券码核销',
      keepAlive: false
    }
  },
  {
    path: '/giveshop',
    component: () => import('@/views/giveshop/giveshop.vue'),
    meta: {
      title: '天空之橙会员卡',
      keepAlive: false
    }
  },
  {
    path: '/receide',
    component: () => import('@/views/receide/index.vue'),
    meta: {
      title: '天空之橙特权卡',
      keepAlive: false
    }
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '天空之橙',
      keepAlive: false
    }
  },

  {
    path: '*',
    name: 'pageNull',
    redirect: '/404'
  }

  // {
  //   path: '/',
  //   component: () => import('@/layouts/index'),
  //   redirect: '/home',
  //   meta: {
  //     title: '',
  //     keepAlive: false
  //   },
  //   children: [
  //     {
  //       path: 'home',
  //       name: 'Home',
  //       component: () => import('@/views/home/index.vue'),
  //       meta: {
  //         title: '首页',
  //         keepAlive: false
  //       }
  //     },
  //     {
  //       path: 'codepage',
  //       name: 'Codepage',
  //       component: () => import('@/views/codePage/index.vue'),
  //       meta: {
  //         title: '会员',
  //         keepAlive: false
  //       }
  //     },
  //     {
  //       path: 'about',
  //       name: 'About',
  //       component: () => import('@/views/about/about.vue'),
  //       meta: {
  //         title: '关于',
  //         keepAlive: false
  //       }
  //     }
  //   ]
  // }
]
