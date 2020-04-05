<template>
  <v-container fill-height fluid class="pa-0 full">
    <PageHeader
      title="Ranks"
      subtitle="Ranking for mods and automizers, From people for people"
      height="70vh"
    />
    <v-container fill-height fluid class="d-flex align-start justify-center">
      <v-row class="justify-center">
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
            </v-col>
            <v-col cols="12" md="8" class="pt-0">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  xl="4"
                  v-for="product in productList"
                  :key="product.id"
                >
                  <ProductItem :product="product" page="Ranks" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { sortBy, uniqBy } from 'lodash'
import PageHeader from '../components/PageHeader'
import store from '../store'
const fb = require('../firebaseConfig')

export default {
  name: 'Ranks',
  components: {
    PageHeader,
    ProductItem: () => import('../components/Items/ProductItem'),
    // SignUp: () => import('../components/SignUp'),
  },
  data() {
    return {
      productList: [],
      productListQ: [],
      txtSearch: '',
      sortBy: undefined,
      direction: undefined,
      filterProduct: undefined,
    }
  },
  created() {
    store.commit('activePage', 'Ranks')
  },
  firestore() {
    return {
      productListQ: fb.db.collection('Products'),
    }
  },
  watch: {
    productListQ: {
      handler(productListQ) {
        this.productList = productListQ
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
    async search(e) {
      var q1 = this.productListQ.filter((v) =>
        v.model.match(new RegExp('.*' + e.target.value + '.*', 'i')),
      )
      // var q2 = this.productListQ.filter((v) =>
      //   v.model.match(new RegExp('^' + e.target.value + '.*$', 'i')),
      // )
      this.productList = sortBy(uniqBy([...q1], 'id'), 'model').reverse()
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
          this.productList = this.productListQ.filter(
            (v) => v.type === 'Atomizer',
          )
          break
        case 1:
          this.productList = this.productListQ.filter((v) => v.type === 'Mod')
          break
        case undefined:
          this.productList = this.productListQ
      }
    },
  },
}
</script>

<style></style>