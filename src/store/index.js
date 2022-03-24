import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      auth: false,
      z1: false,
    }
  },
  mutations: {
    login (state) {
      state.user.auth = true      
    },
    z1login (state) {
      state.user.z1 = true
    }
  },
  actions: {
    login (context,token) {
      localStorage.setItem('tkn', token)
      context.commit('login')
    },
    z1login (context, token) {
      localStorage.setItem('z1_token', token)
      context.commit('z1login')
    }
  },
  modules: {
  }
})
