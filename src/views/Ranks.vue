<template>
  <v-container fill-height fluid class="pa-0">
    <PageHeader
      title="Ranks"
      subtitle="Ranking for mods and automizers, From people for people"
      height="70vh"
    />
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
                @input="search"
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
            </v-col>
            <v-col cols="12" md="8" class="pt-0">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  v-for="product in visiblePages"
                  :key="product.id"
                >
                  <ProductItem :product="product" page="Ranks" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-pagination
            v-model="page"
            total-visible="10"
            :length="totalPages"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { sortBy } from 'lodash'
const fb = require('../firebaseConfig')
import Fuse from 'fuse.js'

export default {
  name: 'Ranks',
  components: {
    PageHeader: () => import('../components/PageHeader.vue'),
    ProductItem: () => import('../components/Items/ProductItem'),
    // SignUp: () => import('../components/SignUp'),
  },
  data() {
    return {
      productListQ: [],
      productList: [],
      txtSearch: '',
      sortBy: undefined,
      direction: undefined,
      filterProduct: undefined,
      page: 1,
      perPage: 10,
      searchIndex: null,
    }
  },
  created() {
    this.$store.commit('activePage', 'Ranks')
  },
  firestore() {
    return {
      productListQ: fb.db.collection('Products'),
    }
  },
  watch: {
    productListQ: {
      immediate: true,
      handler(productListQ) {
        this.productList = productListQ
        this.buildIndex(this.productListQ)
      },
    },
    sortBy: {
      handler(sortBy) {
        this.searchSort(sortBy)
      },
    },
    direction: {
      handler() {
        this.searchSort(this.sortBy)
      },
    },
    filterProduct: {
      handler(filterProduct) {
        this.searchFilter(filterProduct)
        this.searchSort(this.sortBy)
      },
    },
  },
  methods: {
    search() {
      this.productList = this.searchedList
      this.searchFilter(this.filterProduct)
      this.searchSort(this.sortBy)
    },
    async searchSort(sortByy) {
      switch (sortByy) {
        case 0:
          this.productList =
            this.direction === 0
              ? sortBy(this.productList, 'lastScore').reverse()
              : sortBy(this.productList, 'lastScore')
          break
        case 1:
          this.productList =
            this.direction === 0
              ? sortBy(this.productList, 'model').reverse()
              : sortBy(this.productList, 'model')
          break
        case 2:
          this.productList =
            this.direction === 0
              ? sortBy(this.productList, 'company').reverse()
              : sortBy(this.productList, 'company')
          break
        case undefined:
          break
      }
    },
    searchFilter(filterProduct) {
      switch (filterProduct) {
        case 0:
          this.productList = this.searchedList.filter(
            (v) => v.type === 'Atomizer',
          )
          break
        case 1:
          this.productList = this.searchedList.filter((v) => v.type === 'Mod')
          break
        case undefined:
          this.productList = this.searchedList
      }
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
  },
  computed: {
    visiblePages() {
      return this.productList.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage,
      )
    },
    totalPages() {
      return Math.ceil(this.productList.length / this.perPage)
    },
    searchedList() {
      if (this.txtSearch === '') {
        return this.productList
      } else {
        return this.searchIndex.search(this.txtSearch).map((v) => v.item)
      }
    },
  },
}
</script>

<style></style>
