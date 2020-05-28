// @ts-nocheck
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
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
    path: '/admin/companies',
    name: 'Companies',
    component: () =>
      import(
        /* webpackChunkName: "Admin_product_add" */ '../views/Admin/Admin_companies.vue'
      ),
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
    path: '/admin/specs',
    name: 'Admin specs',
    component: () =>
      import(
        /* webpackChunkName: "Admin_banner_manage" */ '../views/Admin/Admin_specs.vue'
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
    path: '/stores',
    name: 'Ranks',
    component: () =>
      import(/* webpackChunkName: "Stores" */ '../views/Stores.vue'),
  },
  {
    path: '/compare',
    name: 'Compare',
    component: () =>
      import(/* webpackChunkName: "Stores" */ '../views/Compare.vue'),
  },
  {
    path: '/product/:id',
    props: true,
    name: 'Product',
    component: () =>
      import(/* webpackChunkName: "Product" */ '../views/Product.vue'),
  },
  {
    path: '/store/:username',
    props: true,
    name: 'Store',
    component: () =>
      import(/* webpackChunkName: "Product" */ '../views/Store.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () =>
      import(/* webpackChunkName: "Privacy" */ '../views/Privacy.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "Login" */ '../views/auth/Login.vue'),
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: () =>
      import(/* webpackChunkName: "SignUp" */ '../views/auth/SignUp.vue'),
  },
  {
    path: '/createStoreAccount',
    name: 'CreatStoreAccount',
    component: () =>
      import(/* webpackChunkName: "StoreInfo" */ '../views/auth/StoreInfo'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

function checkAdmin(next) {
  if (
    store.state.user !== null &&
    store.state.user.uid === process.env.VUE_APP_ADMIN
  ) {
    next()
  } else {
    next('/')
  }
}

router.beforeEach((to, from, next) => {
  const requireAdmin = to.matched.some((x) => x.meta.requireAdmin)

  if (requireAdmin) {
    checkAdmin(next)
  } else if (to.path === '/login' || to.path === '/signUp') {
    if (store.state.user) {
      next('/')
    } else {
      next()
    }
  } else if (to.path === '/createStoreAccount') {
    if (store.state.user && store.state.userInfo.type === 'personal') {
      next()
    } else {
      next(from.path)
    }
  } else {
    next()
  }
})

export default router
