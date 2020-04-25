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
          <div @click="$router.push('/')" class="font-weight-medium homee">
            Wikivapeia
          </div>
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <div
        v-if="$vuetify.breakpoint.mdAndUp"
        :style="{
          height: '1px',
          width: $vuetify.breakpoint.lgAndUp ? '400px' : '300px',
        }"
        class="d-flex align-center"
      >
        <v-autocomplete
          v-model="searchSelected"
          append-outer-icon="search"
          append-icon=""
          hide-details
          filled
          rounded
          dense
          clearable
          :items="title"
          placeholder="Search"
          item-text="model"
          item-value="model"
          background-color="#616161"
          return-object
        >
          <template v-slot:item="{ parent, item }">
            <v-list-item-avatar tile size="80">
              <v-img
                :src="item.images.filter((v) => v.type === 'product')[0].image"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                style="font-size: 15px;"
                v-html="parent.genFilteredText(item.model.toUpperCase())"
              >
              </v-list-item-title>
              <v-list-item-subtitle
                v-html="item.company.toUpperCase()"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </div>
      <v-icon size="30" v-else @click.stop="searchExpand = !searchExpand"
        >search</v-icon
      >
      <div
        v-if="$vuetify.breakpoint.mdAndUp && activePage != ''"
        class="d-flex flex-row"
      >
        <v-btn
          text
          @click.stop="homeClick"
          :class="activePage === 'Home' ? 'accent--text' : ''"
        >
          <v-icon class="mr-2">home</v-icon> Home</v-btn
        >
        <v-btn
          text
          @click.stop="ranksClick"
          :class="activePage === 'Ranks' ? 'accent--text' : ''"
        >
          <v-icon class="mr-2">sort</v-icon>Ranks</v-btn
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
            <v-btn v-if="userInfo" color="" v-on="on">
              <v-icon class="mr-2">account_circle</v-icon> {{ userInfo.name }}
            </v-btn>
            <v-btn v-else color="primary" v-on="on">
              <v-icon class="mr-2">account_circle</v-icon> {{ 'Guest' }}
            </v-btn>
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
      <v-expand-transition>
        <div v-show="searchExpand" class="primary searchBar ml-n4">
          <v-autocomplete
            v-model="searchSelected"
            append-icon=""
            hide-details
            filled
            rounded
            dense
            clearable
            :items="title"
            placeholder="Search"
            item-text="model"
            item-value="model"
            background-color="#616161"
            return-object
          >
            <template v-slot:item="{ parent, item }">
              <v-list-item-avatar tile size="80">
                <v-img
                  :src="
                    item.images.filter((v) => v.type === 'product')[0].image
                  "
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  style="font-size: 15px;"
                  v-html="parent.genFilteredText(item.model.toUpperCase())"
                >
                </v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.company.toUpperCase()"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </div>
      </v-expand-transition>
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
          <v-menu v-if="user" open-on-hover bottom offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-if="userInfo" color="" v-on="on">
                <v-icon class="mr-2">account_circle</v-icon> {{ userInfo.name }}
              </v-btn>
              <v-btn v-else color="primary" v-on="on">
                <v-icon class="mr-2">account_circle</v-icon> {{ 'Guest' }}
              </v-btn>
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
          >
            <v-icon class="mr-2">home</v-icon> Home</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn
            text
            @click.stop="ranksClick"
            :class="activePage === 'Ranks' ? 'accent--text' : ''"
          >
            <v-icon class="mr-2">sort</v-icon>Ranks</v-btn
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
import store from '../store'
const util = require('../utils/utlity')

export default {
  name: 'Nav',
  data() {
    return {
      sideBar: false,
      login: false,
      userInfo: null,
      vertifyEmailDialog: false,
      products: null,
      searchSelected: {},
      searchExpand: false,
    }
  },
  firestore() {
    return {
      products: fb.db.collection('Products'),
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
    userInfo: {
      handler(userInfo) {
        store.commit('userInfo', userInfo)
      },
    },
    searchSelected: {
      handler(searchSelected) {
        this.$router.push(`/product/${searchSelected.id}`)
      },
    },
  },
  computed: {
    ...mapState(['activePage', 'user']),
    title() {
      for (let i = 0; i < this.products.length; i++) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.products[i].model = util.titleBuilder(this.products[i], false)
      }
      return this.products
    },
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

.homee {
  cursor: pointer;
}
.searchBar {
  height: 50px;
  width: 100%;
  position: fixed;
  top: 48px;
  z-index: 3;
}
</style>
