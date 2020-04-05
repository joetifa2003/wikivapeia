import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state() {
    return {
      user: null,
      activePage: '',
    }
  },
  mutations: {
    user: (state, p) => {
      state.user = p
    },
    activePage: (state, p) => {
      state.activePage = p
    },
  },
})
