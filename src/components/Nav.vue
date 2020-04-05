<template>
  <div>
    <SignUp :show="signUp" @closing="signUpDialog()" />
    <Login :show="login" @closing="loginDialog()" />
    <v-app-bar app dark dense flat color="primary">
      <v-app-bar-nav-icon
        @click.stop="sideBar = !sideBar"
        v-if="$vuetify.breakpoint.smAndDown"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>
        <div class="d-flex flex-row align-end">
          <v-img width="35" src="~@/assets/WikivapeiaLogo.svg" />
          <div class="font-weight-medium">Wikivapeia</div>
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div
        v-if="$vuetify.breakpoint.mdAndUp && activePage != ''"
        class="d-flex flex-row"
      >
        <v-btn
          text
          @click.stop="homeClick"
          :class="activePage === 'Home' ? 'accent--text' : ''"
          >Home</v-btn
        >
        <v-btn
          text
          @click.stop="ranksClick"
          :class="activePage === 'Ranks' ? 'accent--text' : ''"
          >Ranks</v-btn
        >
        <div v-if="!user">
          <v-btn
            @click.stop="loginDialog()"
            :class="[
              activePage === 'Login' ? 'accent--text' : '',
              'white black--text',
            ]"
            >Login</v-btn
          >
          <v-btn
            @click.stop="signUpDialog()"
            :class="activePage === 'SignUp' ? 'accent--text' : ''"
            >Sign up</v-btn
          >
        </div>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      class="onTop"
      app
      dark
      v-model="sideBar"
      disable-resize-watcher
    >
      <v-list dense nav>
        <v-list-item>
          <v-btn
            text
            @click.stop="homeClick"
            :class="activePage === 'Home' ? 'accent--text' : ''"
            >Home</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn
            text
            @click.stop="ranksClick"
            :class="activePage === 'Ranks' ? 'accent--text' : ''"
            >Ranks</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn
            @click.stop="loginDialog()"
            :class="[
              activePage === 'Login' ? 'accent--text' : '',
              'white black--text',
            ]"
            >Login</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn
            @click.stop="signUpDialog()"
            :class="activePage === 'SignUp' ? 'accent--text' : ''"
            >Sign up</v-btn
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import SecureLS from 'secure-ls'
var ls = new SecureLS({ encodingType: 'aes' })
import { mapState } from 'vuex'

export default {
  name: 'Nav',
  components: {
    SignUp: () => import('../components/SignUp'),
    Login: () => import('../components/Login'),
  },
  data() {
    return {
      sideBar: false,
      signUp: ls.get('first'),
      login: false,
    }
  },
  computed: {
    ...mapState(['activePage', 'user']),
  },
  methods: {
    homeClick() {
      this.$router.push('/')
    },
    ranksClick() {
      this.$router.push('/ranks')
    },
    signUpDialog() {
      this.signUp = !this.signUp
    },
    loginDialog() {
      this.login = !this.login
    },
  },
}
</script>

<style>
/* .onTop {
  z-index: 500;
} */
</style>
