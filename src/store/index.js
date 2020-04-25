import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state() {
    return {
      user: null,
      userInfo: null,
      activePage: '',
      facebookUser: false,
      fName: '',
      lName: '',
    }
  },
  mutations: {
    user: (state, p) => {
      state.user = p
    },
    userInfo: (state, p) => {
      state.userInfo = p
    },
    activePage: (state, p) => {
      state.activePage = p
    },
    facebookUser: (state, p) => {
      state.facebookUser = p
    },
    lName: (state, p) => {
      state.fName = p
    },
    fName: (state, p) => {
      state.fName = p
    },
  },
})
