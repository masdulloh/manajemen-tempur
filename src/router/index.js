import Vue from 'vue'
import Router from 'vue-router'

import Beranda from '@/components/home/Beranda'

import Products from '@/components/products/Products'
import AddProduct from '@/components/products/AddProduct'
import EditProduct from '@/components/products/EditProduct'

import Orders from '@/components/orders/Orders'
import Mutasi from '@/components/orders/Mutasi'

import Buy from '@/components/home/Buy'
import BuyComplete from '@/components/home/BuyComplete'

import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import Users from '@/components/auth/Users'

import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
    mode: 'history',
  routes: [
    {
        path: '/',
        name: 'Beranda',
        component: Beranda,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/products',
        name: 'Products',
        component: Products,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/addproduct',
        name: 'AddProduct',
        component: AddProduct,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/editproduct/:id',
        name: 'EditProduct',
        component: EditProduct,
        meta: {
          requiresAuth: true
        }
    },
    {
        path: '/buy/:id',
        name: 'Buy',
        component: Buy
    },
    {
        path: '/buycomplete/:id',
        name: 'BuyComplete',
        component: BuyComplete
    },
    {
        path: '/orders',
        name: 'Orders',
        component: Orders,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/mutasi',
        name: 'Mutasi',
        component: Mutasi,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '*',
        name: 'not-found',
        component: Login,
    }
  ]
})

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser
    if(user){
      //user sign in, proses router
      next()
    } else {
      // nop user sign, arahkan ke login
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router
