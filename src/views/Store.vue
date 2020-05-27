<template>
  <v-container
    v-if="store"
    fluid
    fill-height
    class="align-start pa-2 justify-center pt-10 full grey lighten-3"
  >
    <v-row justify="center" v-if="store">
      <v-col cols="12" md="7" lg="7">
        <v-card>
          <vue-headful
            :title="`WIKIVAPEIA - ${store.name}`"
            :image="getFBBanner"
          />
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
                <v-btn color="red darken-4" small @click="editBanners = true"
                  >Settings</v-btn
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
                <v-btn color="red darken-4" small @click="editBanners = true"
                  >Settings</v-btn
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
                      :value="3"
                      dense
                      size="18"
                      readonly
                    />
                  </div>
                  <div style="height: 100%;" class="d-flex align-end mt-n1">
                    <v-btn
                      class="grey white--text"
                      text
                      x-small
                      style="float: right !important;"
                      >Rate now</v-btn
                    >
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row class="px-4">
            <v-col cols="12" md="6">
              <v-expansion-panels
                style="border: 1px solid black;"
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
            <v-col>
              <div style="height: 100%;" class="d-flex">
                <v-text-field
                  prepend-inner-icon="search"
                  hide-details
                  outlined
                  clearable
                  :label="`Search in ${store.name}`"
                  v-model="txtSearch"
                  dense
                />
              </div>
            </v-col>
          </v-row>
          <v-row class="px-4">
            <v-col cols="12" md="4">
              <v-combobox
                v-model="filterProduct"
                dense
                outlined
                hide-details
                label="Product type"
                :items="[
                  'All products',
                  'Atomizer',
                  'Mod',
                  'Pod system',
                  'E-Liquid',
                ]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-combobox
                dense
                outlined
                hide-details
                label="Sort by"
                :items="['Model A-Z', 'Company A-Z', 'Newest', 'Oldest']"
              />
            </v-col>
            <v-col cols="12" md="">
              <div class="d-flex justify-end">
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
              </div>
            </v-col>
          </v-row>
          <div class="d-flex justify-center">
            <div
              style="height: 2px; width: 95%;"
              class="grey lighten-2 mb-2"
            ></div>
          </div>
          <v-row class="px-5">
            <v-col
              cols="12"
              sm="6"
              lg="4"
              v-for="product in visiblePages"
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
          <v-pagination
            v-model="page"
            total-visible="10"
            :length="totalPages"
          ></v-pagination>
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
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Store from '../classes/Store'
import Helper from '../classes/Helper'
import { plainToClass } from 'class-transformer'
import Product from '../classes/Product'
import CommentSection from '../components/CommentSection'
import Fuse from 'fuse.js'
import imageCompression from 'browser-image-compression'
import { v1 as uuid } from 'uuid'
import Swal from 'sweetalert2'
import { mapState } from 'vuex'
const fb = require('../firebaseConfig')

export default {
  name: 'Store',
  props: ['username'],
  components: {
    Progress: () => import('../components/Progress'),
    ProductItem: () => import('../components/Items/ProductItem'),
    CommentSection,
  },
  data() {
    return {
      txtSearch: '',
      filterProduct: 'All products',
      storeQ: null,
      productsQ: [],
      /**
       * @type {number}
       */
      page: 1,
      /**
       * @type {number}
       */
      perPage: 6,
      searchIndex: {},
      sellersQ: [],
      editBanners: false,
      progressDialog: false,
      slideshow: false,
    }
  },
  firestore() {
    return {
      storeQ: fb.db.collection('Users').where('username', '==', this.username),
    }
  },
  computed: {
    ...mapState(['user']),
    /** @returns */
    visiblePages() {
      return this.searchedFull.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage,
      )
    },
    searchedList() {
      if (this.txtSearch === '') {
        return plainToClass(Product, this.products)
      } else {
        return this.searchIndex.search(this.txtSearch).map((v) => v.item)
      }
    },
    searchedFull() {
      let search = []

      search = this.searchedList
      search = this.searchFilter(search, this.filterProduct)
      return search
    },
    /** @returns {number} */
    totalPages() {
      return Math.ceil(this.searchedFull.length / this.perPage)
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
    /** @returns {Product[]} */
    products() {
      return plainToClass(
        Product,
        this.productsQ.map((v) => ({
          id: v.id,
          ...v,
        })),
      )
    },
    sellers() {
      return new Map(this.sellersQ.map((v) => [v.productID, v]))
    },
    getFBBanner() {
      let fb = this.store.banners.find((v) => v.type === 'facebook')
      if (fb) {
        return fb.image
      } else {
        return ''
      }
    },
  },
  methods: {
    search() {
      this.productList = this.searchedList
      this.searchFilter(this.filterProduct)
    },
    searchFilter(list, filterProduct) {
      switch (filterProduct) {
        case 'Atomizer':
          return this.searchedList.filter((v) => v.type === 'Atomizer')
        case 'Mod':
          return this.searchedList.filter((v) => v.type === 'Mod')
        case 'Pod system':
          return this.searchedList.filter((v) => v.type === 'Pod system')
        case 'E-Liquid':
          return this.searchedList.filter((v) => v.type === 'E-Liquid')
        default:
          return this.searchedList
      }
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
    buildIndex(docs) {
      this.searchIndex = new Fuse(docs, {
        caseSensitive: false,
        includeScore: true,
        keys: ['model', 'company'],
        shouldSort: false,
        threshold: 0.3,
      })
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
  },
  watch: {
    storeQ: {
      handler() {
        if (this.storeQ[0]) this.slideshow = this.storeQ[0].slideshow
      },
    },
    products: {
      handler() {
        this.buildIndex(this.products)
      },
    },
    username: {
      immediate: true,
      handler() {
        this.$bind(
          'sellersQ',
          fb.db.collection('Sellers').where('storeID', '==', this.username),
        )
      },
    },
    sellersQ: {
      async handler() {
        if (this.sellers.size !== 0) {
          this.productsQ = await Helper.getDocumentsByID(
            'Products',
            this.sellersQ.map((v) => v.productID),
          )
        } else {
          this.productsQ = []
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
