<template>
  <div>
    <v-app-bar
      app
      dark
      dense
      flat
      color="primary"
      style="z-index: 7 !important;"
    >
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
      <div v-if="$vuetify.breakpoint.mdAndUp" class="d-flex flex-row ml-3">
        <v-btn
          text
          @click.stop="homeClick"
          style="font-size: 12px;"
          :class="activePage === 'Home' ? 'accent--text' : ''"
        >
          <v-icon class="mr-2">home</v-icon> Home</v-btn
        >
        <v-btn
          v-if="userInfo && userInfo.type === 'store'"
          text
          :disabled="
            $router.currentRoute.path === `/store/${userInfo.username}`
          "
          @click.stop="$router.push(`/store/${userInfo.username}`)"
          style="font-size: 12px;"
        >
          <v-icon class="mr-2">storefront</v-icon>My store</v-btn
        >
        <v-btn
          text
          @click.stop="$router.push(`/stores`)"
          style="font-size: 12px;"
          :class="activePage === 'Stores' ? 'accent--text' : ''"
        >
          <v-icon class="mr-2">public</v-icon>Vape stores</v-btn
        >
        <v-btn
          text
          @click.stop="ranksClick"
          style="font-size: 12px;"
          :class="activePage === 'Ranks' ? 'accent--text' : ''"
        >
          <v-icon class="mr-2">sort</v-icon>Products</v-btn
        >
        <v-btn
          text
          @click.stop="$router.push(`/compare`)"
          style="font-size: 12px;"
          :class="activePage === 'Compare' ? 'accent--text' : ''"
        >
          <v-icon class="mr-2">compare_arrows</v-icon>Compare</v-btn
        >
      </div>
      <v-spacer />
      <div
        v-if="$vuetify.breakpoint.mdAndUp"
        :style="{
          width: $vuetify.breakpoint.lgAndUp ? '300px' : '300px',
        }"
        class="d-flex align-center"
      >
        <v-autocomplete
          v-model="searchSelected"
          :search-input.sync="txtSearch"
          :loading="searchLoading"
          append-icon=""
          height="35px"
          hide-details
          hide-no-data
          rounded
          dense
          prepend-inner-icon="search"
          clearable
          :items="products"
          placeholder="Search"
          item-text="model"
          item-value="model"
          background-color="#616161"
          return-object
          class="mr-2"
        >
          <template v-slot:item="{ parent, item }">
            <v-list-item-avatar tile size="80">
              <v-img
                :src="item.images.filter((v) => v.type === 'product')[0].image"
              />
            </v-list-item-avatar>
            <v-list-item-content style="width: 100px;">
              <v-list-item-title
                style="font-size: 14px;"
                v-html="parent.genFilteredText(item.titleBuilder(false))"
              >
              </v-list-item-title>
              <v-list-item-subtitle
                v-html="item.getCompany"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </div>
      <v-icon size="30" v-else @click.stop="searchExpand = !searchExpand"
        >search</v-icon
      >
      <div v-if="!user && $vuetify.breakpoint.mdAndUp">
        <v-btn
          @click.stop="$router.push('/signUp')"
          :class="activePage === 'SignUp' ? 'accent--text' : ''"
          style="font-size: 12px;"
          text
          ><v-icon class="mr-2">create</v-icon>Sign up</v-btn
        >
        <v-btn
          @click.stop="$router.push('/login')"
          :class="[activePage === 'Login' ? 'accent--text' : '']"
          style="font-size: 12px;"
          text
          ><v-icon class="mr-2">person</v-icon>Login</v-btn
        >
      </div>
      <v-menu
        v-if="user && $vuetify.breakpoint.mdAndUp"
        open-on-hover
        bottom
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            text
            style="font-size: 12px;"
            v-if="userInfo"
            color=""
            v-on="on"
          >
            <v-icon class="mr-2">account_circle</v-icon>
            {{
              userInfo.type === 'store'
                ? userInfo.storeName.split(' ')[0]
                : userInfo.name.split(' ')[0]
            }}
          </v-btn>
          <v-btn v-else color="primary" v-on="on">
            <v-icon class="mr-2">account_circle</v-icon> {{ 'Guest' }}
          </v-btn>
        </template>

        <v-list color="primary">
          <v-list-item>
            <v-btn style="font-size: 12px;" text class="white--text"
              >Settings</v-btn
            >
          </v-list-item>
          <v-list-item>
            <v-btn
              style="font-size: 12px;"
              @click="logout"
              text
              class="white--text"
              >Logout</v-btn
            >
          </v-list-item>
        </v-list>
      </v-menu>
      <v-expand-transition>
        <div v-if="searchExpand" class="primary searchBar ml-n4 px-5">
          <v-autocomplete
            v-model="searchSelected"
            :search-input.sync="txtSearch"
            :loading="searchLoading"
            hide-no-data
            append-icon=""
            prepend-inner-icon="search"
            hide-details
            filled
            rounded
            dense
            clearable
            :items="products"
            placeholder="Search"
            item-text="model"
            item-value="model"
            background-color="#616161"
            return-object
          >
            <template v-slot:item="{ parent, item }">
              <v-list-item-avatar tile size="80">
                <v-img :src="item.productImages[0].image" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  style="font-size: 15px;"
                  v-html="parent.genFilteredText(item.titleBuilder(false))"
                >
                </v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.getCompany"
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
      width="200"
      style="background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px);"
    >
      <v-list dense nav>
        <v-list-item v-if="user">
          <v-menu v-if="user" open-on-hover bottom offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                text
                style="font-size: 12px;"
                v-if="userInfo"
                color=""
                v-on="on"
              >
                <v-icon class="mr-2">account_circle</v-icon>
                {{ userInfo.name.split(' ')[0] }}
              </v-btn>
              <v-btn v-else color="primary" v-on="on">
                <v-icon class="mr-2">account_circle</v-icon> {{ 'Guest' }}
              </v-btn>
            </template>

            <v-list color="primary">
              <v-list-item>
                <v-btn style="font-size: 12px;" text class="white--text"
                  >Settings</v-btn
                >
              </v-list-item>
              <v-list-item>
                <v-btn
                  style="font-size: 12px;"
                  @click="logout"
                  text
                  class="white--text"
                  >Logout</v-btn
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
        <v-list-item>
          <v-btn
            text
            @click.stop="homeClick"
            style="font-size: 12px;"
            :class="activePage === 'Home' ? 'accent--text' : ''"
          >
            <v-icon class="mr-2">home</v-icon> Home</v-btn
          >
        </v-list-item>
        <v-list-item v-if="userInfo && userInfo.type === 'store'">
          <v-btn
            text
            :disabled="
              $router.currentRoute.path === `/store/${userInfo.username}`
            "
            @click.stop="$router.push(`/store/${userInfo.username}`)"
            style="font-size: 12px;"
          >
            <v-icon class="mr-2">storefront</v-icon>My store</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn
            text
            @click.stop="$router.push(`/stores`)"
            style="font-size: 12px;"
            :class="activePage === 'Stores' ? 'accent--text' : ''"
          >
            <v-icon class="mr-2">public</v-icon>Vape stores</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn
            text
            @click.stop="ranksClick"
            style="font-size: 12px;"
            :class="activePage === 'Ranks' ? 'accent--text' : ''"
          >
            <v-icon class="mr-2">sort</v-icon>Products</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn
            text
            @click.stop="$router.push(`/compare`)"
            style="font-size: 12px;"
            :class="activePage === 'Compare' ? 'accent--text' : ''"
          >
            <v-icon class="mr-2">compare_arrows</v-icon>Compare</v-btn
          >
        </v-list-item>
        <v-list-item v-if="!user">
          <v-btn
            @click.stop="$router.push('/signUp')"
            :class="activePage === 'SignUp' ? 'accent--text' : ''"
            style="font-size: 12px;"
            text
            ><v-icon class="mr-2">create</v-icon>Sign up</v-btn
          >
        </v-list-item>
        <v-list-item v-if="!user">
          <v-btn
            @click.stop="$router.push('/login')"
            :class="[activePage === 'Login' ? 'accent--text' : '']"
            style="font-size: 12px;"
            text
            ><v-icon class="mr-2">person</v-icon>Login</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn
            style="font-size: 12px;"
            @click="logout"
            text
            class="white--text"
            ><v-icon class="mr-2">power_settings_new</v-icon>Logout</v-btn
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { debounce } from 'lodash'
const fb = require('../firebaseConfig')
import { mapState } from 'vuex'
import { plainToClass } from 'class-transformer'
import Product from '../classes/Product'

export default {
  name: 'Nav',
  data() {
    return {
      sideBar: false,
      login: false,
      vertifyEmailDialog: false,
      productsQ: null,
      searchSelected: {},
      searchExpand: false,
      products: [],
      txtSearch: '',
      searchLoading: false,
    }
  },
  watch: {
    searchSelected: {
      handler(searchSelected) {
        this.$gtag.event('search', {
          event_label: searchSelected.model,
          event_category: 'product_search',
        })
        this.$router.push(`/product/${searchSelected.id}`)
      },
    },
    txtSearch: {
      handler: debounce(function () {
        if (this.txtSearch) {
          this.searchLoading = true
          fb.db
            .collection('Products')
            .where('modelSRC', 'array-contains', this.txtSearch.toLowerCase())
            .where('approved', '==', true)
            .limit(3)
            .get()
            .then((docSnapshots) => {
              // console.log(docSnapshots.docs.map((doc) => doc.data()))
              this.products.splice(0, this.products.length)
              this.products.push(
                ...plainToClass(
                  Product,
                  docSnapshots.docs.map((doc) =>
                    Object.assign(doc.data(), { id: doc.id }),
                  ),
                ),
              )
              this.searchLoading = false
            })
        }
      }, 500),
    },
    $route: {
      handler() {
        this.$forceUpdate()
      },
    },
  },
  computed: {
    ...mapState(['activePage', 'user', 'userInfo']),
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

<style lang="scss">
.homee {
  cursor: pointer;
}
.searchBar {
  height: 50px;
  width: 100%;
  position: fixed;
  top: 48px;
}
.v-input__prepend-inner {
  height: 100% !important;
  display: flex;
  align-items: center;
  .v-icon {
    margin-top: 0 !important;
  }
}
.v-navigation-drawer {
  z-index: 8 !important;
}
</style>
