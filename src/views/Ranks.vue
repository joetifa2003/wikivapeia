<template>
  <v-container fill-height fluid class="pa-0">
    <PageHeader
      title="Products"
      subtitle="Ranking for mods and automizers, From people for people"
      height="70vh"
    />
    <v-container fluid>
      <div class="page d-flex align-start justify-center">
        <v-row justify="center" style="width: 100%;">
          <v-col cols="12" lg="8">
            <v-row>
              <v-col>
                <v-text-field
                  label="Search"
                  filled
                  v-model="txtSearch"
                  single-line
                  @keydown.enter="search"
                ></v-text-field>
                <v-subheader>Product</v-subheader>
                <v-divider />
                <v-btn-toggle class="mt-5" v-model="filterProduct">
                  <v-btn>Atomizer</v-btn>
                  <v-btn>Mod</v-btn>
                </v-btn-toggle>
                <v-subheader class="mt-5">Sort by</v-subheader>
                <v-divider />
                <v-btn-toggle class="mt-5" v-model="sortBy">
                  <v-btn>Score</v-btn>
                  <v-btn>Model</v-btn>
                  <v-btn>Company</v-btn>
                </v-btn-toggle>
                <v-subheader class="mt-5">Sorting direction</v-subheader>
                <v-divider />
                <v-btn-toggle class="mt-5" v-model="direction">
                  <v-btn>
                    <v-icon>arrow_downward</v-icon>
                  </v-btn>
                  <v-btn>
                    <v-icon>arrow_upward</v-icon>
                  </v-btn>
                </v-btn-toggle>
                <v-combobox
                  class="mt-5"
                  v-model.number="perPage"
                  label="Product per page"
                  :items="[10, 20, 50, 100]"
                />
                <ProductRequest />
              </v-col>
              <v-col cols="12" md="8" class="pt-0">
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    v-for="product in productList"
                    :key="product.id"
                  >
                    <ProductItem
                      :product="product"
                      page="Ranks"
                      :seller="sellers.get(product.id)"
                    />
                  </v-col>
                  <infinite-loading
                    @infinite="infiniteHandler"
                  ></infinite-loading>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-container>
</template>

<script>
const fb = require('../firebaseConfig')
import { plainToClass } from 'class-transformer'
import Product from '../classes/Product'
import { mapState } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Ranks',
  components: {
    PageHeader: () => import('../components/PageHeader.vue'),
    ProductItem: () => import('../components/Items/ProductItem'),
    ProductRequest: () => import('../components/ProductRequest'),
    InfiniteLoading,
  },
  directives: {
    infiniteScroll,
  },
  data() {
    return {
      productListQ: [],
      /**
       * @type {Product[]} productList
       */
      productList: [],
      /**
       * @type {string}
       */
      txtSearch: '',
      /**
       * @type {number}
       */
      sortBy: undefined,
      /**
       * @type {number}
       */
      direction: undefined,
      /**
       * @type {number}
       */
      filterProduct: undefined,
      /**
       * @type {number}
       */
      page: 1,
      /**
       * @type {number}
       */
      perPage: 10,
      searchIndex: null,
      sellersQ: [],
      lastDoc: null,
      busy: false,
    }
  },
  created() {
    this.$store.commit('activePage', 'Ranks')
    this.busy = true
    fb.db
      .collection('Products')
      .where('approved', '==', true)
      .orderBy('date', 'desc')
      .orderBy('model')
      .limit(this.perPage)
      .get()
      .then((snapshot) => {
        this.lastDoc = snapshot.docs[snapshot.docs.length - 1]
        this.productListQ = snapshot.docs.map((v) => ({
          id: v.id,
          ...v.data(),
        }))
        this.busy = false
      })
  },
  watch: {
    userInfo: {
      immediate: true,
      handler(userInfo) {
        if (userInfo) {
          this.$bind(
            'sellersQ',
            fb.db
              .collection('Sellers')
              .where('storeID', '==', this.userInfo.username),
          )
        }
      },
    },
    productListQ: {
      immediate: true,
      handler() {
        this.productList = plainToClass(
          Product,
          this.productListQ.map((v) => ({ id: v.id, ...v })),
        )
      },
    },
    sortBy: {
      handler() {},
    },
    direction: {
      handler() {},
    },
    filterProduct: {
      handler() {},
    },
  },
  methods: {
    infiniteHandler($state) {
      if (this.lastDoc) {
        fb.db
          .collection('Products')
          .where('approved', '==', true)
          .orderBy('date', 'desc')
          .orderBy('model')
          .startAfter(this.lastDoc)
          .limit(this.perPage)
          .get()
          .then((snapshot) => {
            this.lastDoc = snapshot.docs[snapshot.docs.length - 1]
            this.productListQ = [
              ...this.productListQ,
              ...snapshot.docs.map((v) => ({ id: v.id, ...v.data() })),
            ]
            $state.loaded()
          })
      } else {
        $state.complete()
      }
    },
    search() {
      if (this.txtSearch === '') {
        this.$bind(
          'productListQ',
          fb.db
            .collection('Products')
            .where('approved', '==', true)
            .orderBy('date', 'desc')
            .orderBy('model')
            .limit(this.perPage),
          { reset: true },
        ).then((documents) => {
          this.lastDoc = documents[documents.length - 1]
        })
      } else {
        this.$bind(
          'productListQ',
          fb.db
            .collection('Products')
            .where('approved', '==', true)
            .orderBy('model')
            .startAt(this.txtSearch)
            .endAt(this.txtSearch + '\uf8ff')
            .limit(this.perPage),
          { reset: true },
        ).then((documents) => {
          this.lastDoc = documents[documents.length - 1]
        })
      }
    },
  },
  computed: {
    ...mapState(['user', 'userInfo']),
    sellers() {
      return new Map(this.sellersQ.map((v) => [v.productID, v]))
    },
  },
}
</script>

<style></style>
