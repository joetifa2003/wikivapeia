<template>
  <div>
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
            @click.stop="$router.push('/login')"
            :class="[
              activePage === 'Login' ? 'accent--text' : '',
              'white black--text',
            ]"
            >Login</v-btn
          >
          <v-btn
            @click.stop="$router.push('/signUp')"
            :class="activePage === 'SignUp' ? 'accent--text' : ''"
            >Sign up</v-btn
          >
        </div>
        <v-menu v-if="user" open-on-hover bottom offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-if="userInfo" color="primary" v-on="on">
              Hi, {{ userInfo.name }}
            </v-btn>
            <v-btn v-else color="primary" v-on="on"> Hi, {{ 'Guest' }} </v-btn>
          </template>

          <v-list color="primary">
            <v-list-item>
              <v-btn text class="white--text">Account settings</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn @click="logout" text class="white--text">Logout</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
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
          <v-menu v-if="userInfo" open-on-hover bottom offset-y>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" v-on="on"> Hi, {{ userInfo.name }} </v-btn>
            </template>

            <v-list color="primary">
              <v-list-item>
                <v-btn text class="white--text">Account settings</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn @click="logout" text class="white--text">Logout</v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
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
        <v-list-item v-if="!user">
          <v-btn
            @click.stop="$router.push('/login')"
            :class="[
              activePage === 'Login' ? 'accent--text' : '',
              'white black--text',
            ]"
            >Login</v-btn
          >
        </v-list-item>
        <v-list-item v-if="!user">
          <v-btn
            @click.stop="$router.push('/signUp')"
            :class="activePage === 'SignUp' ? 'accent--text' : ''"
            >Sign up</v-btn
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
const fb = require('../firebaseConfig')
import { mapState } from 'vuex'

export default {
  name: 'Nav',
  data() {
    return {
      sideBar: false,
      login: false,
      userInfo: null,
      vertifyEmailDialog: false,
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(user) {
        if (user) {
          this.$bind('userInfo', fb.db.collection('Users').doc(user.uid))
        } else {
          this.userInfo = false
        }
      },
    },
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
    async logout() {
      const res = await Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout !',
      })
      if (res.value) {
        await fb.auth.signOut()
        this.$store.commit('user', null)
      }
    },
  },
}
</script>

<style>
/* .onTop {
  z-index: 500;
} */
</style>
