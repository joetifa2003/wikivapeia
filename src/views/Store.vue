<template>
  <v-container v-if="store" class="align-start justify-center pa-0 pt-11">
    <v-card>
      <div style="position: fixed; bottom: 90px; right: 15px; z-index: 6;">
        <v-card shaped class="pa-3" v-if="messengerMessege">
          <div class="d-flex flex-row justify-end"></div>
          <div
            style="margin-left: 55px; font-size: 12px;"
            class="d-flex flex-row justify-space-around align-center grey--text lighten-3"
          >
            {{ store.storeName }}
            <v-btn
              @click="messengerMessege = false"
              class="ml-2"
              style="background: none !important;"
              fab
              x-small
              color=""
              elevation="0"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </div>
          <div class="d-flex flex-row align-center">
            <v-avatar>
              <v-img width="50" height="50" :src="store.img"></v-img>
            </v-avatar>
            <v-chip class="ml-2 py-7"
              >Hi! we are here to answer <br />
              any questions you may have.</v-chip
            >
          </div>
        </v-card>
        <v-btn
          large
          fab
          fixed
          bottom
          right
          style="background: rgb(0, 132, 255);"
        >
          <font-awesome-icon
            @click="openMessenger"
            class="white--text"
            style="width: 40px; height: 40px;"
            :icon="['fab', 'facebook-messenger']"
          />
        </v-btn>
      </div>
      <vue-headful :title="`${store.storeName}`" :image="getFBBanner" />
      <v-carousel
        :cycle="store.slideshow"
        hide-delimiters
        interval="3000"
        height="auto"
        show-arrows-on-hover
        style="max-height: 420px;"
      >
        <v-overlay
          @click.native="
            () => {
              if (!store.banners || store.banners.length === 0) {
                editBanners = true
              }
            }
          "
          z-index="1"
          absolute
          color=""
          v-if="user && user.uid === store.id"
        >
          <div
            style="width: 100%; height: 100%;"
            class="d-flex justify-end align-content-space-around"
          >
            <v-btn color="red darken-4 ma-2" small @click="editBanners = true"
              ><v-icon class="mr-1">settings</v-icon>Settings</v-btn
            >
          </div>
        </v-overlay>
        <v-carousel-item v-if="!store.banners || store.banners.length === 0">
          <v-img
            :height="bannerSize"
            width="100%"
            src="https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/Users%2FbannerBG.svg?alt=media&token=2f493834-b17e-4ee0-a2fd-446367e2e5b3"
          />
        </v-carousel-item>
        <v-carousel-item
          v-for="banner in store.banners.map((v) => v.image)"
          :key="banner"
        >
          <v-img :height="bannerSize" width="100%" :src="banner"> </v-img>
        </v-carousel-item>
      </v-carousel>
      <div
        style="width: 100%; min-height: 36px;"
        class="grey darken-4 d-flex justify-md-end justify-center"
      >
        <v-btn
          v-if="!user || userInfo.type === 'personal'"
          style="font-size: 12px !important; background: none;"
          @click="createStore"
          class="amber--text lighten-1 blink"
          ><v-icon class="mr-2">storefront</v-icon>Create your free store
          now!</v-btn
        >
        <v-btn
          v-else-if="user && user.uid === store.id"
          style="font-size: 12px !important; background: none;"
          @click="$router.push('/ranks')"
          class="amber--text lighten-1"
          ><div class="blink">
            <v-icon class="mr-2">add</v-icon>Add products
          </div></v-btn
        >
      </div>
      <v-row style="width: 100%; margin: 0;" class="px-4 black">
        <v-col cols="12" class="px-0">
          <div class="d-flex flex-row align-center" style="width: 100%;">
            <v-img
              class="mr-4 rounded-img"
              :max-width="$vuetify.breakpoint.mdAndUp ? '100px' : '80'"
              :max-height="$vuetify.breakpoint.mdAndUp ? '100px' : '80'"
              :width="$vuetify.breakpoint.mdAndUp ? '100px' : '80'"
              :height="$vuetify.breakpoint.mdAndUp ? '100px' : '80'"
              aspect-ratio="1"
              :src="store.img"
            />
            <div class="d-flex flex-column">
              <div>
                <h2 class="white--text" v-if="$vuetify.breakpoint.mdAndUp">
                  {{ store.storeName }}
                </h2>
                <h3 class="white--text" v-else>{{ store.storeName }}</h3>
                <div class="white--text mb-2 ml-1" style="font-size: 14px;">
                  {{ store.busType.join(', ') }}
                </div>
                <div
                  class="d-flex flex-row align-center white--text"
                  style="font-size: 12px;"
                >
                  <v-rating
                    class="mb-2 mt-n2"
                    color="amber lighten-1"
                    background-color="grey"
                    :value="store.lastScore"
                    dense
                    size="18"
                    readonly
                    half-increments
                  />
                  <div class="mt-n4 ml-2">
                    ({{ store.lastScore.toFixed(2) }} / 5)
                  </div>
                </div>
              </div>
              <div style="height: 100%;" class="d-flex align-end mt-n1">
                <v-btn
                  v-if="userInfo && userInfo.type !== 'store'"
                  @click="rateClick"
                  class="grey white--text"
                  text
                  x-small
                  style="float: right !important;"
                  >{{ userReview ? 'Remove rating' : 'Rate now' }}</v-btn
                >
                <v-btn
                  v-else-if="!user || (userInfo && userInfo.type !== 'store')"
                  @click="rateClick"
                  class="grey white--text"
                  text
                  x-small
                  style="float: right !important;"
                  >{{ userReview ? 'Remove rating' : 'Rate now' }}</v-btn
                >
              </div>
            </div>
            <div
              class="d-flex flex-column justify-end align-end align-self-end"
              style="flex: 1; height: 100%;"
            >
              <div class="d-flex flex-column align-start">
                <Share dir="bottom" :title="store.storeName" :bottom="false" />
                <div class="white--text" style="font-size: 12px;">
                  Share store
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row class="px-6">
        <v-col cols="12" class="pb-0">
          <v-expansion-panels
            style="border: 1px solid grey;"
            class="elevation-0"
          >
            <v-expansion-panel
              class="lighten-3"
              style="box-shadow: none !important;"
            >
              <v-expansion-panel-header
                class="py-0"
                style="height: 20px !important;"
              >
                <div
                  class="d-flex flex-row align-center font-weight-bold black--text"
                >
                  <v-icon size="30" class="d-inline mr-3 black--text"
                    >contact_phone</v-icon
                  >
                  Contact with {{ store.storeName }}
                </div></v-expansion-panel-header
              >
              <v-expansion-panel-content class="px-0">
                <v-list>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon large>
                        <v-icon @click="openWebsite" class="black--text"
                          >public</v-icon
                        >
                      </v-btn>
                    </template>
                    <span>Goto {{ store.webUrl }}</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon large>
                        <font-awesome-icon
                          @click="openFacebookPage"
                          style="width: 30px; height: 30px;"
                          class="black--text"
                          :icon="['fab', 'facebook-square']"
                        />
                      </v-btn>
                    </template>
                    <span>Goto {{ store.storeName }} facebook page</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon large>
                        <v-btn v-on="on" icon large class="">
                          <font-awesome-icon
                            @click="openMessenger"
                            class="black--text"
                            style="width: 30px; height: 30px;"
                            :icon="['fab', 'facebook-messenger']"
                          />
                        </v-btn>
                      </v-btn>
                    </template>
                    <span>Chat with {{ store.storeName }}</span>
                  </v-tooltip>
                  <v-subheader class="font-weight-bold"
                    >About {{ store.storeName }}</v-subheader
                  >
                  <v-list-item class="mb-3 black--text">
                    <div class="text-justify">
                      {{ store.about }}
                    </div>
                  </v-list-item>
                  <v-list-item
                    ><div class="black" style="height: 1px; width: 100%;"></div
                  ></v-list-item>
                  <v-list-item v-for="(branch, i) in store.branches" :key="i">
                    <v-card
                      style="width: 100%;"
                      class="pa-5 mb-3"
                      elevation="5"
                    >
                      <h3 class="mb-2">
                        {{ branch.area }} - {{ branch.region }}
                      </h3>
                      <div style="width: 100%; height: 1px;" class="grey" />
                      <v-subheader class="pa-0">Address</v-subheader>
                      <div class="mt-n2">
                        {{ branch.address }}
                      </div>
                      <v-subheader class="pa-0">Phone numbers</v-subheader>
                      <div class="mt-n2">
                        <div v-for="(number, i) in branch.numbers" :key="i">
                          <div class="d-flex flex-row mb-2">
                            <font-awesome-icon
                              v-if="number.isWhatsApp"
                              class="green--text darken-3 mr-2"
                              :icon="['fab', 'whatsapp-square']"
                              style="width: 20px; height: 20px;"
                            />
                            <v-icon v-else size="20px" class="mr-2"
                              >call</v-icon
                            >
                            <div>
                              {{ store.countryCode + parseInt(number.number) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row class="px-6">
        <v-col cols="12" md="4" class="pb-0">
          <div style="height: 100%;" class="d-flex">
            <v-text-field
              prepend-inner-icon="search"
              hide-details
              outlined
              clearable
              :loading="searchLoading"
              :label="`Search in ${store.storeName}`"
              v-model="txtSearch"
              dense
            />
          </div>
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <v-combobox
            v-model="filterProduct"
            dense
            outlined
            hide-details
            :loading="filterLoading"
            label="Product type"
            :items="[
              'All products',
              'Mod',
              'Starter kit',
              'Atomizer',
              'Pod system',
              'E-Liquid',
              'Coils & Cartridges',
              'Batteries & Chargers',
              'Vape accessories',
            ]"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-combobox
            dense
            outlined
            hide-details
            label="Sort by"
            :loading="sortProductByLoading"
            v-model="sortProductBy"
            :items="[
              'None',
              'Model A-Z',
              'Model Z-A',
              'Price High-Low',
              'Price Low-High',
            ]"
          />
        </v-col>
      </v-row>
      <div class="grey mb-4" style="width: 100%; height: 1px;"></div>
      <template v-if="productsValues && productsValues.length !== 0">
        <v-row class="px-5">
          <v-col
            cols="12"
            sm="6"
            lg="4"
            v-for="product in productsValues"
            :key="product.id"
          >
            <ProductItem
              :product="product"
              :storeUsername="store.username"
              :storeCurrency="store.currency"
              page="store"
              :score="false"
              :seller="sellers.get(product.id)"
            />
          </v-col>
        </v-row>
        <v-row class="mt-4" justify="center">
          <v-btn
            @click="loadMoreProducts"
            v-if="productsValues.length !== 0 && lastSeller"
            class="black white--text"
            >Load more products</v-btn
          >
        </v-row>
      </template>
      <template
        v-if="
          user &&
          user.uid === store.id &&
          productArrived === true &&
          productsValues === null &&
          Object.values(sellersQ).length === 0
        "
      >
        <div class="text-center">
          <h1 class="black--text mb-2" style="font-size: 25px;">
            Congratulations {{ store.name.split(' ')[0] }},<br
              v-if="$vuetify.breakpoint.smAndDown"
            />
            Welcome to your store.
          </h1>
          <h2 class="mb-2">Add your products now!</h2>
          <v-btn @click="$router.push('/ranks')" class="black white--text"
            ><div class="blink">Add products</div></v-btn
          >
        </div>
      </template>
      <CommentSection :productIDD="store.id" />
    </v-card>
    <v-dialog
      :width="$vuetify.breakpoint.mdAndUp ? '20%' : '100%'"
      v-model="editBanners"
      persistent
    >
      <v-card class="pa-5">
        <v-btn
          @click="addBanner"
          class="black white--text mb-3"
          style="width: 100%;"
          :disabled="store.banners.length >= 3"
          ><v-icon>add</v-icon>Add banner</v-btn
        >
        <v-switch v-model="slideshow" label="sildeshow" />
        <input
          style="display: none;"
          ref="bannerInput"
          type="file"
          accept="image/jpeg"
          @change="bannerInputChange"
        />
        <v-card v-for="(banner, i) in store.banners" :key="i" class="my-2">
          <v-img contain :src="banner.image" width="auto" height="144px">
            <div
              v-if="banner.type === 'facebook'"
              class="white pa-0"
              style="max-width: 30px; max-height: 30px;"
            >
              <font-awesome-icon
                style="width: 30px; height: 30px;"
                class="indigo--text"
                :icon="['fab', 'facebook-square']"
              />
            </div>
          </v-img>
          <div class="d-flex flex-row justify-space-between align-center">
            <v-btn
              style="text-transform: none !important;"
              text
              :disabled="banner.type === 'facebook'"
              color="indigo"
              @click="makeFBBanner(i)"
              ><v-icon>share</v-icon> Sharing banner</v-btn
            >
            <v-btn text color="grey" @click="deleteBanner(i)" icon
              ><v-icon>delete</v-icon></v-btn
            >
            <div class="d-flex flex-row">
              <v-btn small icon @click.stop="reIndex(i, 'down')">
                <v-icon>arrow_downward</v-icon>
              </v-btn>
              <v-btn small icon @click.stop="reIndex(i, 'up')">
                <v-icon>arrow_upward</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
        <v-btn
          @click="exitBanner"
          class="black white--text mt-3"
          style="width: 100%;"
          ><v-icon>exit_to_app</v-icon>Exit</v-btn
        >
      </v-card>
    </v-dialog>
    <Progress :progressDialog="progressDialog" msg="Adding banner" />
    <v-dialog
      v-model="reviewDialog"
      :width="$vuetify.breakpoint.mdAndUp ? '20%' : '100%'"
    >
      <v-card class="pa-5">
        <div
          class="text-center font-weight-bold mb-12"
          style="font-size: 15px;"
        >
          Please rate {{ store.storeName }}
        </div>
        <div class="d-flex flex-column">
          <div class="d-flex justify-center">
            <v-slider
              v-model="ratingValue"
              thumb-label="always"
              max="5"
              min="1"
              step="0.5"
            />
          </div>
          <div class="d-flex justify-center">
            <v-btn @click="rate" class="black white--text">Rate</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Store from '../classes/Store'
import Helper from '../classes/Helper'
import { plainToClass } from 'class-transformer'
import Product from '../classes/Product'
import imageCompression from 'browser-image-compression'
import { v1 as uuid } from 'uuid'
import Swal from 'sweetalert2'
import { mapState } from 'vuex'
import { debounce } from 'lodash'
const fb = require('../firebaseConfig')

export default {
  name: 'Store',
  props: ['username'],
  components: {
    Progress: () => import('../components/Progress'),
    ProductItem: () => import('../components/Items/ProductItem'),
    CommentSection: () => import('../components/CommentSection'),
    Share: () => import('../components/Share'),
  },
  data() {
    return {
      txtSearch: '',
      searchLoading: false,
      filterProduct: 'All products',
      filterLoading: false,
      storeQ: null,
      products: {},
      sellersQ: {},
      editBanners: false,
      progressDialog: false,
      slideshow: false,
      lastSeller: {},
      sortProductBy: '',
      sortProductByLoading: false,
      fab: false,
      ratingValue: 1,
      reviewDialog: false,
      userReview: null,
      messengerMessege: true,
      productArrived: false,
    }
  },
  firestore() {
    return {
      storeQ: fb.db.collection('Users').where('username', '==', this.username),
    }
  },
  activated() {
    this.$store.commit('activePage', 'Store')
  },
  created() {
    this.searchQuery.onSnapshot((query) => {
      this.lastSeller = query.docs[query.docs.length - 1]
      for (let i = 0; i < query.docChanges().length; i++) {
        let change = query.docChanges()[i]
        if (change.type === 'removed') {
          this.$delete(this.sellersQ, change.doc.id)
        } else {
          this.$set(this.sellersQ, change.doc.id, change.doc.data())
        }
      }
      this.productArrived = true
      this.updateProducts(query.docChanges())
      this.searchLoading = false
      this.filterLoading = false
      this.sortProductByLoading = false
    })
  },
  computed: {
    ...mapState(['user', 'userInfo']),
    productsValues() {
      if (this.getObjectValues(this.products).length > 0) {
        return this.getObjectValues(this.products)
      } else {
        return null
      }
    },
    bannerSize() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return '420px'
      } else if (this.$vuetify.breakpoint.sm) {
        return '300px'
      } else {
        return '300px'
      }
    },
    /** @returns {Store} */
    store() {
      if (this.storeQ) {
        return plainToClass(
          Store,
          this.storeQ.map((v) => ({
            id: v.id,
            ...v,
          }))[0],
        )
      } else {
        return null
      }
    },
    sellers() {
      return new Map(
        this.getObjectValues(this.sellersQ).map((v) => [v.productID, v]),
      )
    },
    getFBBanner() {
      let fb = this.store.banners.find((v) => v.type === 'facebook')
      if (fb) {
        return fb.image
      } else {
        return ''
      }
    },
    searchQuery() {
      let query = fb.db
        .collection('Sellers')
        .where('storeUsername', '==', this.username)
        .limit(9)
      if (this.txtSearch) {
        query = query.where(
          'modelSRC',
          'array-contains',
          this.txtSearch.toLowerCase(),
        )
      }
      if (this.filterProduct && this.filterProduct !== 'All products') {
        query = query.where('type', '==', this.filterProduct)
      }
      if (this.sortProductBy && this.sortProductBy !== 'None') {
        if (this.sortProductBy === 'Model A-Z')
          query = query.orderBy('model', 'asc')
        if (this.sortProductBy === 'Model Z-A')
          query = query.orderBy('model', 'desc')
        if (this.sortProductBy === 'Price High-Low')
          query = query.where('price', '>', 0).orderBy('price', 'desc')
        if (this.sortProductBy === 'Price Low-High')
          query = query.where('price', '>', 0).orderBy('price', 'asc')
      }
      if (
        !(
          this.txtSearch ||
          (this.filterProduct && this.filterProduct !== 'All products') ||
          (this.sortProductBy && this.sortProductBy !== 'None')
        )
      ) {
        query = query.orderBy('type', 'asc')
      }
      return query
    },
  },
  methods: {
    getObjectValues(object) {
      let temp = []
      for (const argumentsKey in object) {
        temp.push(object[argumentsKey])
      }
      return temp
    },
    rate() {
      fb.db
        .runTransaction(async (transaction) => {
          let store = await transaction.get(
            fb.db.collection('Users').doc(this.store.id),
          )
          transaction.update(fb.db.collection('Users').doc(this.store.id), {
            revSum: fb.fb.firestore.FieldValue.increment(this.ratingValue),
            revCount: fb.fb.firestore.FieldValue.increment(1),
            lastScore:
              (store.data().revSum + this.ratingValue) /
              (store.data().revCount + 1),
          })
          transaction.set(
            fb.db
              .collection('Users')
              .doc(this.store.id)
              .collection('StoreReviews')
              .doc(this.user.uid),
            {
              review: this.ratingValue,
            },
          )
        })
        .then(() => {
          Swal.fire(
            `Thank you`,
            `Your review for ${this.store.storeName} done`,
            'success',
          )
          this.reviewDialog = false
        })
    },
    rateClick() {
      if (!this.user) {
        Swal.fire('Sign up', 'You must sign up to rate', 'warning').then(() => {
          this.$router.push('/signUp')
        })
        return
      }
      if (!this.userReview) {
        this.reviewDialog = true
      } else {
        fb.db.runTransaction(async (transaction) => {
          let userReview = await transaction.get(
            fb.db
              .collection('Users')
              .doc(this.store.id)
              .collection('StoreReviews')
              .doc(this.user.uid),
          )
          let store = await transaction.get(
            fb.db.collection('Users').doc(this.store.id),
          )
          if (!userReview.exists || !store.exists) {
            throw 'Document does not exist!'
          }
          let score =
            (store.data().revSum - userReview.data().review) /
            (store.data().revCount - 1)
          transaction.update(fb.db.collection('Users').doc(this.store.id), {
            revSum: fb.fb.firestore.FieldValue.increment(
              -Math.abs(userReview.data().review),
            ),
            revCount: fb.fb.firestore.FieldValue.increment(-Math.abs(1)),
            lastScore: isNaN(score) ? 0 : score,
          })
          transaction.delete(
            fb.db
              .collection('Users')
              .doc(this.store.id)
              .collection('StoreReviews')
              .doc(this.user.uid),
          )
        })
      }
    },
    createStore() {
      if (!this.user) {
        this.$router.push({ path: '/signUp', query: { accType: 1 } })
      }
      if (this.user && this.userInfo.type === 'personal') {
        this.$router.push('/createStoreAccount')
      }
    },
    async updateProducts(changes) {
      plainToClass(
        Product,
        await Helper.getDocumentsByID(
          'Products',
          changes
            .filter((v) => v.type !== 'removed')
            .map((v) => v.doc.data())
            .map((v) => v.productID),
        ),
      ).forEach((product) => {
        this.$set(this.products, product.id, product)
      })
      changes
        .filter((v) => v.type === 'removed')
        .forEach((change) => {
          this.$delete(this.products, change.doc.data().productID)
        })
    },
    loadMoreProducts() {
      this.searchQuery.startAfter(this.lastSeller).onSnapshot((query) => {
        this.lastSeller = query.docs[query.docs.length - 1]
        for (let i = 0; i < query.docChanges().length; i++) {
          let change = query.docChanges()[i]
          if (change.type === 'removed') {
            this.$delete(this.sellersQ, change.doc.id)
          } else {
            this.$set(this.sellersQ, change.doc.id, change.doc.data())
          }
        }
        this.updateProducts(query.docChanges())
      })
    },
    openFacebookPage() {
      let url = this.store.facebookUrl
      if (!url.match(/^https?:\/\//i)) {
        url = 'http://' + url
      }
      window.open(url, '_blank')
    },
    openMessenger() {
      window.open(`https://www.m.me/${this.store.facebookPageID}`, '_blank')
    },
    openWebsite() {
      let url = this.store.webUrl
      if (!url.match(/^https?:\/\//i)) {
        url = 'http://' + url
      }
      window.open(url, '_blank')
    },
    async bannerInputChange(event) {
      this.progressDialog = true
      let files = event.target.files
      let images = this.store.banners
      for (let file of files) {
        try {
          const filename = uuid() + '.' + file.name.split('.').pop()
          let compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            useWebWorker: true,
            onProgress: () => {},
          })
          let snapshot = await fb.st
            .ref('/Store/banners')
            .child(filename)
            .put(compressedFile)
          let downloadUrl = await snapshot.ref.getDownloadURL()
          images.push({
            image: downloadUrl,
            imageName: filename,
            type: 'normal',
          })
          await fb.db.collection('Users').doc(this.store.id).update({
            banners: images,
          })
          this.progressDialog = false
        } catch (e) {
          this.progressDialog = false
          Swal.fire('Error', e.message, 'error')
        }
      }
    },
    async makeFBBanner(index) {
      let banners = this.store.banners
      for (let i = 0; i < banners.length; i++) {
        banners[i].type = 'normal'
      }
      banners[index].type = 'facebook'
      await fb.db.collection('Users').doc(this.store.id).update({
        banners: banners,
      })
    },
    async deleteBanner(index) {
      let banners = this.store.banners
      fb.st.ref('/Store/banners').child(banners[index].imageName).delete()
      banners.splice(index, 1)
      await fb.db.collection('Users').doc(this.store.id).update({
        banners: banners,
      })
    },
    addBanner() {
      this.$refs.bannerInput.click()
    },
    reIndex(index, upDown) {
      if (this.store.banners.length === 0 && upDown === 'up') return
      if (upDown === 'up') {
        let tmp = this.store.banners[index - 1]
        this.store.banners[index - 1] = this.store.banners[index]
        this.store.banners[index] = tmp
      } else {
        let tmp = this.store.banners[index + 1]
        this.store.banners[index + 1] = this.store.banners[index]
        this.store.banners[index] = tmp
      }
      this.$forceUpdate()
    },
    async exitBanner() {
      let banners = this.store.banners
      await fb.db.collection('Users').doc(this.store.id).update({
        banners: banners,
        slideshow: this.slideshow,
      })
      this.editBanners = false
    },
    updateSellerItems: debounce(function () {
      this.searchQuery.get().then((query) => {
        this.lastSeller = query.docs[query.docs.length - 1]
        this.sellersQ = {}
        this.products = {}
        for (let i = 0; i < query.docChanges().length; i++) {
          let change = query.docChanges()[i]
          if (change.type === 'removed') {
            this.$delete(this.sellersQ, change.doc.id)
          } else {
            this.$set(this.sellersQ, change.doc.id, change.doc.data())
          }
        }
        this.updateProducts(query.docChanges())
        this.searchLoading = false
        this.filterLoading = false
        this.sortProductByLoading = false
      })
    }, 500),
  },
  watch: {
    txtSearch: {
      handler() {
        this.searchLoading = true
        this.updateSellerItems()
      },
    },
    filterProduct: {
      handler() {
        this.filterLoading = true
        this.updateSellerItems()
      },
    },
    sortProductBy: {
      handler() {
        this.sortProductByLoading = true
        this.updateSellerItems()
      },
    },
    storeQ: {
      handler() {
        if (this.storeQ[0]) this.slideshow = this.storeQ[0].slideshow
        if (this.storeQ[0]) {
          if (this.user) {
            this.$bind(
              'userReview',
              fb.db
                .collection('Users')
                .doc(this.storeQ[0].id)
                .collection('StoreReviews')
                .doc(this.user.uid),
              { reset: false },
            )
          }
        }
      },
    },
  },
}
</script>

<style lang="scss">
.rounded-img {
  border-radius: 18px;
}
.v-expansion-panel::before {
  box-shadow: none !important;
}
</style>
