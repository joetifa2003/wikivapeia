// @ts-nocheck
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueGtag from 'vue-gtag'
var SocialSharing = require('vue-social-sharing')
import { firestorePlugin } from 'vuefire'
import vueHeadful from 'vue-headful'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'reflect-metadata'
const fb = require('./firebaseConfig')

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true

Vue.use(VueGtag, {
  config: { id: 'UA-164765217-1' },
})
Vue.use(firestorePlugin)
Vue.use(SocialSharing)
Vue.component('vue-headful', vueHeadful)
Vue.use(require('vue-script2'))

let app
let unsubscribe
fb.auth.onAuthStateChanged((user) => {
  if (unsubscribe) {
    unsubscribe()
  }
  store.commit('user', user)
  if (user) {
    unsubscribe = fb.db.collection('Users').doc(user.uid).onSnapshot((doc) => {
      if (doc.data()) {
        store.commit('userInfo', doc.data())
      } else {
        store.commit('userInfo', 'Not found')
      }
    })
  } else {
    store.commit('userInfo', null)
  }
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app')
  }
})
