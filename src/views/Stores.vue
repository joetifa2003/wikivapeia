<template>
  <v-container fill-height fluid class="pa-0">
    <vue-headful title="Wikivapeia - All products" />
    <PageHeader
      title="Stores"
      subtitle="Ranking for mods and automizers, From people for people"
      height="70vh"
    />
    <v-container class="white">
      <v-row>
        <v-col>
          <v-combobox
            :items="countries"
            :loading="countryLoading"
            v-model="selectedCountry"
            label="Country"
            hide-details
            outlined
            dense
          />
        </v-col>
        <v-col>
          <v-combobox
            :items="regions"
            :loading="regionLoading"
            v-model="selectedRegion"
            label="Region"
            hide-details
            outlined
            dense
          />
        </v-col>
      </v-row>
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
        <v-col cols="12" sm="3" v-for="store in storesList" :key="store.id">
          <StoreItem :store="store" />
        </v-col>
        <infinite-loading @infinite="infiniteHandler"></infinite-loading>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { plainToClass } from 'class-transformer'
import Store from '../classes/Store'
import { debounce } from 'lodash'
const fb = require('../firebaseConfig')

export default {
  name: 'Stores',
  components: {
    PageHeader: () => import('../components/PageHeader.vue'),
    StoreItem: () => import('../components/Items/StoreItem'),
  },
  watch: {
    txtSearch: {
      handler() {
        this.searchLoading = true
        this.updateStoreItems()
      },
    },
    selectedCountry: {
      handler() {
        this.countryLoading = true
        this.updateStoreItems()
      },
    },
    selectedRegion: {
      handler() {
        this.regionLoading = true
        this.updateStoreItems()
      },
    },
  },
  async created() {
    let regions = await fetch(`${process.env.BASE_URL}regions.json`)
    this.allRegions = JSON.parse(await regions.text())
    let country
    let region
    if (this.userInfo) {
      country = this.userInfo.country
      region = this.userInfo.region
    } else {
      let data = await fetch('https://freegeoip.app/json/')
      let location = await data.json()
      country = location.country_name
      region = location.city
    }
    this.selectedCountry = country
    this.selectedRegion = region
    this.searchQuery.get().then((query) => {
      this.lastStore = query.docs[query.docs.length - 1]
      for (let i = 0; i < query.docs.length; i++) {
        let doc = query.docs[i]
        this.$set(this.storesListQ, doc.id, { id: doc.id, ...doc.data() })
      }
      this.updateStores()
    })
  },
  data() {
    return {
      storesListQ: {},
      storesList: [],
      lastStore: {},
      txtSearch: '',
      allRegions: [],
      selectedCountry: '',
      selectedRegion: '',
      searchLoading: false,
      countryLoading: false,
      regionLoading: false,
    }
  },
  activated() {
    this.$store.commit('activePage', 'Stores')
  },
  methods: {
    updateStoreItems: debounce(function () {
      this.searchQuery.get().then((query) => {
        this.lastProduct = query.docs[query.docs.length - 1]
        this.storesListQ = {}
        for (let i = 0; i < query.docs.length; i++) {
          let doc = query.docs[i]
          this.$set(this.storesListQ, doc.id, { id: doc.id, ...doc.data() })
        }
        this.updateStores()
        this.searchLoading = false
        this.regionLoading = false
        this.countryLoading = false
      })
    }, 500),
    updateStores() {
      this.storesList = plainToClass(Store, Object.values(this.storesListQ))
    },
    infiniteHandler($state) {
      if (this.lastProduct) {
        this.searchQuery
          .startAfter(this.lastStore)
          .get()
          .then((query) => {
            this.lastProduct = query.docs[query.docs.length - 1]
            for (let i = 0; i < query.docs.length; i++) {
              let doc = query.docs[i]
              this.$set(this.storesListQ, doc.id, {
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
    countries() {
      return this.allRegions.map((v) => v.country)
    },
    regions() {
      let countryRegions = this.allRegions.find(
        (v) => v.country === this.selectedCountry,
      )
      if (countryRegions) {
        return countryRegions.regions.map((v) => v.name)
      } else {
        return []
      }
    },
    searchQuery() {
      let query = fb.db
        .collection('Users')
        .where('type', '==', 'store')
        .limit(12)
      if (this.txtSearch) {
        query = query
          .where('nameSRC', '>=', this.txtSearch.toLowerCase())
          .where('nameSRC', '<=', this.txtSearch.toLowerCase() + '\uf8ff')
      }
      if (this.selectedCountry) {
        query = query.where('country', '==', this.selectedCountry)
      }
      if (this.selectedRegion) {
        query = query.where('regions', 'array-contains', this.selectedRegion)
      }
      return query
    },
  },
}
</script>

<style></style>
