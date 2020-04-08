import Vue from 'vue'
import VueRouter from 'vue-router'
import SecureLS from 'secure-ls'
import store from '../store'

Vue.use(VueRouter)

var ls = new SecureLS({ encodingType: 'aes' })

const routes = [
  {
    path: '/splash',
    name: 'Splash',
    component: () =>
      import(/* webpackChunkName: "Splash" */ '../views/Splash.vue'),
    meta: {},
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    meta: {},
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () =>
      import(/* webpackChunkName: "Admin" */ '../views/Admin/Admin.vue'),
    meta: {
      requireAdmin: true,
    },
  },
  {
    path: '/admin/product/add',
    name: 'Admin product add',
    component: () =>
      import(
        /* webpackChunkName: "Admin_product_add" */ '../views/Admin/Admin_product_add.vue'
      ),
    meta: {
      requireAdmin: true,
    },
  },
  {
    path: '/admin/product/manage',
    name: 'Admin product mange',
    component: () =>
      import(
        /* webpackChunkName: "Admin_product_manage" */ '../views/Admin/Admin_product_manage.vue'
      ),
    meta: {
      requireAdmin: true,
    },
  },
  {
    path: '/admin/banner/add',
    name: 'Admin banner add',
    component: () =>
      import(
        /* webpackChunkName: "Admin_banner_add" */ '../views/Admin/Admin_banner_add.vue'
      ),
    meta: {
      requireAdmin: true,
    },
  },
  {
    path: '/admin/banner/manage',
    name: 'Admin banner manage',
    component: () =>
      import(
        /* webpackChunkName: "Admin_banner_manage" */ '../views/Admin/Admin_banner_manage.vue'
      ),
    meta: {
      requireAdmin: true,
    },
  },
  {
    path: '/ranks',
    name: 'Ranks',
    component: () =>
      import(/* webpackChunkName: "Ranks" */ '../views/Ranks.vue'),
  },
  {
    path: '/product/:id',
    props: true,
    name: 'Product',
    component: () =>
      import(/* webpackChunkName: "Product" */ '../views/Product.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () =>
      import(/* webpackChunkName: "Product" */ '../views/Privacy.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

function checkAdmin(next) {
  if (
    store.state.user !== null &&
    store.state.user.uid === '07XroEldEudD3dQM0efDi0n2MEn1'
  ) {
    next()
  } else {
    next('/')
  }
}

router.beforeEach((to, from, next) => {
  const requireAdmin = to.matched.some((x) => x.meta.requireAdmin)

  if (ls.get('times') === '') {
    ls.set('times', 0)
  }
  ls.set('times', ls.get('times') + 1)
  ls.set('first', ls.get('times') === 1)

  console.log(ls.get('times'))

  if (requireAdmin) {
    checkAdmin(next)
  } else {
    next()
  }
})

export default router
