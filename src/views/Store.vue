<template>
  <v-container
    v-if="store"
    fluid
    fill-height
    class="align-start pa-2 justify-center pt-10 full grey lighten-3"
  >
    <Share :title="store.name" />
    <v-row justify="center" v-if="store">
      <v-col cols="12" md="7" lg="7">
        <v-card>
          <vue-headful :title="`${store.name}`" :image="getFBBanner" />
          <v-carousel
            v-if="$vuetify.breakpoint.mdAndUp"
            :cycle="store.slideshow"
            hide-delimiters
            interval="3000"
            height="420px"
            show-arrows-on-hover
            style="max-height: 420px;"
          >
            <v-overlay
              v-if="user && user.uid === store.id"
              z-index="1"
              absolute
              color=""
            >
              <div
                style="width: 100%; height: 100%;"
                class="d-flex justify-end"
              >
                <v-btn
                  color="red darken-4 ma-2"
                  small
                  @click="editBanners = true"
                  ><v-icon class="mr-1">settings</v-icon>Settings</v-btn
                >
              </div>
            </v-overlay>
            <v-carousel-item
              v-if="!store.banners || store.banners.length === 0"
            >
              <v-img
                height="420px"
                width="100%"
                src="https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/Users%2FbannerBG.svg?alt=media&token=2f493834-b17e-4ee0-a2fd-446367e2e5b3"
              />
            </v-carousel-item>
            <v-carousel-item
              v-for="banner in store.banners.map((v) => v.image)"
              :key="banner"
            >
              <v-img height="420px" width="100%" :src="banner" />
            </v-carousel-item>
          </v-carousel>
          <v-carousel
            v-else-if="$vuetify.breakpoint.sm"
            :cycle="store.slideshow"
            hide-delimiters
            interval="3000"
            height="auto"
            show-arrows-on-hover
            style="max-height: 360px;"
          >
            <v-overlay
              v-if="user && user.uid === store.id"
              z-index="1"
              absolute
              color=""
            >
              <div
                style="width: 100%; height: 100%;"
                class="d-flex justify-end"
              >
                <v-btn
                  color="red darken-4 ma-2"
                  small
                  @click="editBanners = true"
                  ><v-icon class="mr-1">settings</v-icon>Settings</v-btn
                >
              </div>
            </v-overlay>
            <v-carousel-item v-if="store.banners.length === 0">
              <v-img
                height="300px"
                width="100%"
                aspect-ratio="16/9"
                src="https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/Users%2FbannerBG.svg?alt=media&token=2f493834-b17e-4ee0-a2fd-446367e2e5b3"
              />
            </v-carousel-item>
            <v-carousel-item
              v-for="banner in store.banners.map((v) => v.image)"
              :key="banner"
            >
              <v-img
                height="300px"
                width="100%"
                aspect-ratio="16/9"
                :src="banner"
              />
            </v-carousel-item>
          </v-carousel>
          <v-carousel
            v-else
            :cycle="store.slideshow"
            hide-delimiters
            interval="3000"
            height="auto"
            show-arrows-on-hover
            style="max-height: 360px;"
          >
            <v-overlay
              v-if="user && user.uid === store.id"
              z-index="1"
              absolute
              color=""
            >
              <div
                style="width: 100%; height: 100%;"
                class="d-flex justify-end"
              >
                <v-btn
                  color="red darken-4 ma-2"
                  small
                  @click="editBanners = true"
                  ><v-icon class="mr-1">settings</v-icon>Settings</v-btn
                >
              </div>
            </v-overlay>
            <v-carousel-item
              v-if="!store.banners || store.banners.length === 0"
            >
              <v-img
                height="144px"
                width="100%"
                aspect-ratio="16/9"
                src="https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/Users%2FbannerBG.svg?alt=media&token=2f493834-b17e-4ee0-a2fd-446367e2e5b3"
              />
            </v-carousel-item>
            <v-carousel-item
              v-for="banner in store.banners.map((v) => v.image)"
              :key="banner"
            >
              <v-img
                height="144px"
                width="100%"
                aspect-ratio="16/9"
                :src="banner"
              />
            </v-carousel-item>
          </v-carousel>
          <v-row style="width: 100%; margin: 0;" class="px-4 grey darken-4">
            <v-col cols="12" md="7" class="px-0">
              <div class="d-flex flex-row align-center">
                <v-img
                  class="mr-4 rounded-img"
                  :max-width="$vuetify.breakpoint.mdAndUp ? '100px' : '70'"
                  :max-height="$vuetify.breakpoint.mdAndUp ? '100px' : '70'"
                  aspect-ratio="1"
                  :src="store.img"
                />
                <div class="d-flex flex-column">
                  <div>
                    <h2 class="white--text" v-if="$vuetify.breakpoint.mdAndUp">
                      {{ store.name }}
                    </h2>
                    <h3 class="white--text" v-else>{{ store.name }}</h3>
                    <v-rating
                      class="mb-2 mt-n2"
                      color="amber lighten-1"
                      background-color="grey"
                      :value="store.revSum / store.revCount"
                      dense
                      size="18"
                      readonly
                      half-increments
                    />
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
                      v-else-if="
                        !user || (userInfo && userInfo.type !== 'store')
                      "
                      @click="rateClick"
                      class="grey white--text"
                      text
                      x-small
                      style="float: right !important;"
                      >{{ userReview ? 'Remove rating' : 'Rate now' }}</v-btn
                    >
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
                      Contact with {{ store.name }}
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
                        <span>Goto {{ store.name }} facebook page</span>
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
                        <span>Chat with {{ store.name }}</span>
                      </v-tooltip>
                      <v-subheader class="font-weight-bold"
                        >About {{ store.name }}</v-subheader
                      >
                      <v-list-item class="mb-3 black--text">
                        <div class="text-justify">
                          {{ store.about }}
                        </div>
                      </v-list-item>
                      <v-list-item
                        ><div
                          class="black"
                          style="height: 1px; width: 100%;"
                        ></div
                      ></v-list-item>
                      <v-list-item
                        v-for="(branch, i) in store.branches"
                        :key="i"
                      >
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
                                  {{
                                    store.countryCode + parseInt(number.number)
                                  }}
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
                  :label="`Search in ${store.name}`"
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
          <template v-if="!user || userInfo.type === 'personal'">
            <div
              v-if="$vuetify.breakpoint.mdAndUp"
              style="position: fixed; bottom: 15px; left: 15px;"
            >
              <v-btn @click="createStore" class="black white--text"
                ><v-icon class="mr-2">storefront</v-icon>Create your store
                now!</v-btn
              >
            </div>
            <div v-else class="mb-2 d-flex justify-center">
              <v-btn
                @click="createStore"
                style="width: 80%;"
                class="black white--text"
                ><v-icon class="mr-2">storefront</v-icon>Create your store
                now!</v-btn
              >
            </div>
          </template>
          <v-row class="px-5">
            <v-col
              cols="12"
              sm="6"
              lg="4"
              v-for="product in products"
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
              v-if="products.length !== 0 && lastSeller"
              class="black white--text"
              >Load more products</v-btn
            >
          </v-row>
          <CommentSection :productIDD="store.id" />
        </v-card>
      </v-col>
    </v-row>
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
          Please rate {{ store.name }}
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
      products: [],
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
      for (let i = 0; i < query.docs.length; i++) {
        let doc = query.docs[i]
        this.$set(this.sellersQ, doc.id, doc.data())
      }
      this.updateProducts()
      this.searchLoading = false
      this.filterLoading = false
      this.sortProductByLoading = false
    })
  },
  computed: {
    ...mapState(['user', 'userInfo']),
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
      return new Map(Object.values(this.sellersQ).map((v) => [v.productID, v]))
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
        .where('storeID', '==', this.username)
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
    rate() {
      let batch = fb.db.batch()
      batch.set(
        fb.db
          .collection('Users')
          .doc(this.store.id)
          .collection('StoreReviews')
          .doc(this.user.uid),
        {
          review: this.ratingValue,
        },
      )
      batch.update(fb.db.collection('Users').doc(this.store.id), {
        revSum: fb.fb.firestore.FieldValue.increment(this.ratingValue),
        revCount: fb.fb.firestore.FieldValue.increment(1),
      })
      batch.commit().then(() => {
        Swal.fire(
          `Thank you`,
          `Your review for ${this.store.name} done`,
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
        fb.db.runTransaction((transaction) => {
          return transaction
            .get(
              fb.db
                .collection('Users')
                .doc(this.store.id)
                .collection('StoreReviews')
                .doc(this.user.uid),
            )
            .then((userReview) => {
              if (!userReview.exists) {
                throw 'Document does not exist!'
              }
              transaction.update(fb.db.collection('Users').doc(this.store.id), {
                revSum: fb.fb.firestore.FieldValue.increment(
                  -Math.abs(userReview.data().review),
                ),
                revCount: fb.fb.firestore.FieldValue.increment(-Math.abs(1)),
              })
              transaction.delete(
                fb.db
                  .collection('Users')
                  .doc(this.store.id)
                  .collection('StoreReviews')
                  .doc(this.user.uid),
              )
            })
        })
        // fb.db
        //   .collection('Users')
        //   .doc(this.store.id)
        //   .collection('StoreReviews')
        //   .doc(this.user.uid)
        //   .get()
        //   .then((userReview) => {
        //     fb.db
        //       .collection('Users')
        //       .doc(this.store.id)
        //       .update({
        //         revSum: fb.fb.firestore.FieldValue.increment(
        //           -Math.abs(userReview.data().review),
        //         ),
        //         revCount: fb.fb.firestore.FieldValue.increment(-Math.abs(1)),
        //       })
        //       .then(() => {
        //         fb.db
        //           .collection('Users')
        //           .doc(this.store.id)
        //           .collection('StoreReviews')
        //           .doc(this.user.uid)
        //           .delete()
        //       })
        //   })
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
    async updateProducts() {
      if (this.sellers.size !== 0) {
        this.products = plainToClass(
          Product,
          await Helper.getDocumentsByID(
            'Products',
            Object.values(this.sellersQ).map((v) => v.productID),
          ),
        )
      } else {
        this.products = []
      }
    },
    loadMoreProducts() {
      this.searchQuery.startAfter(this.lastSeller).onSnapshot((query) => {
        this.lastSeller = query.docs[query.docs.length - 1]
        for (let i = 0; i < query.docs.length; i++) {
          let doc = query.docs[i]
          this.$set(this.sellersQ, doc.id, doc.data())
        }
        this.updateProducts()
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
        for (let i = 0; i < query.docs.length; i++) {
          let doc = query.docs[i]
          this.$set(this.sellersQ, doc.id, doc.data())
        }
        this.updateProducts()
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
