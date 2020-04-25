import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
const fb = require('./firebaseConfig')
import vueHeadful from 'vue-headful'
var SocialSharing = require('vue-social-sharing')

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme

Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true

Vue.use(firestorePlugin)
Vue.use(SocialSharing)
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
