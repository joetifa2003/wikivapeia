<template>
  <v-container fill-height fluid class="pa-0">
    <vue-headful title="Wikivapeia - Vape stores" />
    <PageHeader
      title="Stores"
      subtitle="Wikivapeia vape stores"
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
                <ProductRequest />
              </v-col>
              <v-col cols="12" md="8" class="pt-0">
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    v-for="store in visiblePages"
                    :key="store.id"
                  >
                    <StoreItem :store="store" />
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
  </v-container>
</template>

<script>
import { sortBy } from 'lodash'
const fb = require('../firebaseConfig')
import Fuse from 'fuse.js'
import { plainToClass } from 'class-transformer'
import Store from '../classes/Product'

export default {
  name: 'Stores',
  components: {
    PageHeader: () => import('../components/PageHeader.vue'),
    StoreItem: () => import('../components/Items/StoreItem'),
    ProductRequest: () => import('../components/ProductRequest'),
  },
  data() {
    return {
      storesQ: [],
      /**
       * @type {Store[]}
       */
      stores: [],
      /**       * @type {string}
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
    }
  },
  activated() {
    this.$store.commit('activePage', 'Stores')
  },
  firestore() {
    return {
      storesQ: fb.db.collection('Users').where('type', '==', 'store'),
    }
  },
  watch: {
    storesQ: {
      immediate: true,
      handler() {
        this.stores = plainToClass(Store, this.storesQWithID)
        this.buildIndex(this.stores)
        this.search()
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
      this.stores = this.searchedList
      this.searchFilter(this.filterProduct)
      this.searchSort(this.sortBy)
    },
    async searchSort(sortByy) {
      switch (sortByy) {
        case 0:
          this.stores =
            this.direction === 0
              ? sortBy(this.stores, 'lastScore').reverse()
              : sortBy(this.stores, 'lastScore')
          break
        case 1:
          this.stores =
            this.direction === 0
              ? sortBy(this.stores, 'model').reverse()
              : sortBy(this.stores, 'model')
          break
        case 2:
          this.stores =
            this.direction === 0
              ? sortBy(this.stores, 'company').reverse()
              : sortBy(this.stores, 'company')
          break
        case undefined:
          break
      }
    },
    searchFilter(filterProduct) {
      switch (filterProduct) {
        case 0:
          this.stores = this.searchedList.filter((v) => v.type === 'Atomizer')
          break
        case 1:
          this.stores = this.searchedList.filter((v) => v.type === 'Mod')
          break
        case undefined:
          this.stores = this.searchedList
      }
    },
    buildIndex(docs) {
      this.searchIndex = new Fuse(docs, {
        caseSensitive: false,
        includeScore: true,
        keys: ['name'],
        shouldSort: false,
        threshold: 0.3,
      })
    },
  },
  computed: {
    visiblePages() {
      return this.stores.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage,
      )
    },
    totalPages() {
      return Math.ceil(this.stores.length / this.perPage)
    },
    searchedList() {
      if (this.txtSearch === '') {
        return plainToClass(Store, this.storesQWithID)
      } else {
        return this.searchIndex.search(this.txtSearch).map((v) => v.item)
      }
    },
    storesQWithID() {
      return this.storesQ.map((v) => ({
        ...v,
        id: v.id,
      }))
    },
  },
}
</script>

<style></style>
