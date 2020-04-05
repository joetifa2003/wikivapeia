import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
const fb = require('./firebaseConfig')
import vueHeadful from 'vue-headful'

Vue.config.productionTip = false

Vue.use(firestorePlugin)
Vue.component('vue-headful', vueHeadful)

let app
fb.auth.onAuthStateChanged((user) => {
  store.commit('user', user)
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app')
  }
})
