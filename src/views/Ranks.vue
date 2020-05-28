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
          <v-col cols="12" lg="7">
            <v-text-field
              prepend-inner-icon="search"
              hide-details
              outlined
              clearable
              :loading="searchLoading"
              label="Search"
              v-model="txtSearch"
              dense
            />
            <v-row>
              <v-col>
                <v-combobox
                  v-model="filterProduct"
                  dense
                  outlined
                  hide-details
                  :loading="filterLoading"
                  label="Product type"
                  clearable
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
              <v-col>
                <v-combobox
                  v-model="subFilterProduct"
                  dense
                  outlined
                  hide-details
                  :loading="subFilterLoading"
                  label="Product subtype"
                  clearable
                  :disabled="
                    !(
                      typeSubTypes[filterProduct] &&
                      typeSubTypes[filterProduct].length > 0
                    )
                  "
                  :items="typeSubTypes[filterProduct]"
                />
              </v-col>
            </v-row>
            <v-combobox
              dense
              outlined
              hide-details
              label="Sort by"
              clearable
              :loading="sortProductByLoading"
              v-model="sortProductBy"
              :items="['None', 'Brand', 'Model A-Z', 'Model Z-A', 'Score']"
            />
            <ProductRequest class="mt-2" />
            <v-row>
              <v-col
                cols="12"
                sm="4"
                v-for="product in productList"
                :key="product.id"
              >
                <ProductItem
                  :product="product"
                  page="Ranks"
                  :seller="sellers.get(product.id)"
                  :score="
                    ['Mod', 'Atomizer', 'Pod system', 'E-Liquid'].includes(
                      product.type,
                    )
                  "
                />
              </v-col>
              <infinite-loading @infinite="infiniteHandler"></infinite-loading>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-container>
</template>

<script>
import { debounce } from 'lodash'

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
      productListQ: {},
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
      perPage: 10,
      searchIndex: null,
      sellersQ: [],
      filterProduct: '',
      subFilterProduct: '',
      sortProductBy: '',
      lastProduct: null,
      searchLoading: false,
      filterLoading: false,
      subFilterLoading: false,
      sortProductByLoading: false,
      typeSubTypes: {
        Mod: [],
        'Starter kit': [],
        Atomizer: [],
        'Pod system': [],
        'E-Liquid': [],
        'Coils & Cartridges': [
          'Wires',
          'Prebuilt coils',
          'Replacement coils',
          'RBA coils',
          'Cartridges',
        ],
        'Batteries & Chargers': ['Batteries', 'Chargers'],
        'Vape accessories': [
          'Cotton',
          'Drip tips',
          'Glass tube',
          'Silicon cases',
          'Bottles',
          'Adaptors',
          'Tools',
          'Other',
        ],
      },
    }
  },
  created() {
    this.$store.commit('activePage', 'Ranks')
    this.searchQuery.get().then((query) => {
      this.lastProduct = query.docs[query.docs.length - 1]
      for (let i = 0; i < query.docs.length; i++) {
        let doc = query.docs[i]
        this.$set(this.productListQ, doc.id, { id: doc.id, ...doc.data() })
      }
      this.updateProducts()
    })
  },
  watch: {
    txtSearch: {
      handler() {
        this.searchLoading = true
        this.updateProductItems()
      },
    },
    filterProduct: {
      handler() {
        this.filterLoading = true
        this.updateProductItems()
      },
    },
    subFilterProduct: {
      handler() {
        this.subFilterLoading = true
        this.updateProductItems()
      },
    },
    sortProductBy: {
      handler() {
        this.sortProductByLoading = true
        this.updateProductItems()
      },
    },
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
  },
  methods: {
    updateProductItems: debounce(function () {
      this.searchQuery.get().then((query) => {
        this.lastProduct = query.docs[query.docs.length - 1]
        this.productListQ = {}
        for (let i = 0; i < query.docs.length; i++) {
          let doc = query.docs[i]
          this.$set(this.productListQ, doc.id, { id: doc.id, ...doc.data() })
        }
        this.updateProducts()
        this.searchLoading = false
        this.filterLoading = false
        this.subFilterLoading = false
        this.sortProductByLoading = false
      })
    }, 500),
    updateProducts() {
      this.productList = plainToClass(Product, Object.values(this.productListQ))
    },
    infiniteHandler($state) {
      if (this.lastProduct) {
        this.searchQuery
          .startAfter(this.lastProduct)
          .get()
          .then((query) => {
            this.lastProduct = query.docs[query.docs.length - 1]
            for (let i = 0; i < query.docs.length; i++) {
              let doc = query.docs[i]
              this.$set(this.productListQ, doc.id, {
                id: doc.id,
                ...doc.data(),
              })
            }
            this.updateProducts()
            $state.loaded()
          })
      } else {
        $state.complete()
      }
    },
  },
  computed: {
    ...mapState(['user', 'userInfo']),
    sellers() {
      return new Map(this.sellersQ.map((v) => [v.productID, v]))
    },
    searchQuery() {
      let query = fb.db
        .collection('Products')
        .where('approved', '==', true)
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
      if (this.subFilterProduct && this.subFilterProduct !== 'All products') {
        query = query.where('subType', '==', this.subFilterProduct)
      }
      if (this.sortProductBy && this.sortProductBy !== 'None') {
        if (this.sortProductBy === 'Brand')
          query = query.where('company', '>', '').orderBy('company', 'asc')
        if (this.sortProductBy === 'Model A-Z')
          query = query.orderBy('model', 'asc')
        if (this.sortProductBy === 'Model Z-A')
          query = query.orderBy('model', 'desc')
        if (this.sortProductBy === 'Score')
          query = query.orderBy('lastScore', 'desc')
      }
      if (
        !(
          this.txtSearch ||
          (this.filterProduct && this.filterProduct !== 'All products') ||
          (this.subFilterProduct && this.subFilterProduct !== 'All products') ||
          (this.sortProductBy && this.sortProductBy !== 'None')
        )
      ) {
        query = query.orderBy('type', 'asc')
      }
      return query
    },
  },
}
</script>

<style></style>
