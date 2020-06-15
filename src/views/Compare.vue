<template>
  <v-container class="white mt-12">
    <vue-headful
      v-if="Object.values(items).filter((v) => v.selected).length >= 1"
      :title="`WIKIVAPEIA - ${compTitle} ${
        Object.values(items).filter((v) => v.selected).length === 1
          ? 'Specs'
          : 'Comparison'
      }`"
      :image="productImageShare"
    />
    <vue-headful
      v-else
      :title="`WIKIVAPEIA - Products comparision`"
      :image="productImageShare"
    />
    <Share
      v-if="Object.values(this.items).filter((v) => v.selected).length > 1"
      :title="compTitle"
      :bottom="true"
    />
    <v-row>
      <v-col cols="8" md="4">
        <v-combobox
          :items="['Mod', 'Atomizer', 'Pod system']"
          :rules="[(v) => !!v || 'Product type is required']"
          clearable
          label="Select product type"
          v-model="selectedProduct"
          outlined
          dense
          auto-select-first
        />
      </v-col>
    </v-row>
    <v-row style="flex-wrap: nowrap !important; overflow: auto;">
      <v-col
        cols="8"
        md="4"
        v-for="(product, pi) in Object.values(items)"
        :key="pi"
        class="d-flex flex-column px-3"
      >
        <v-autocomplete
          v-model="product.selected"
          :loading="product.loading"
          :items="product.values"
          :search-input.sync="product.search"
          hide-no-data
          hide-details
          :label="pi === 0 ? 'Search' : 'Compare with'"
          style="max-height: 40px !important;"
          append-icon=""
          dense
          prepend-inner-icon="search"
          clearable
          item-text="model"
          item-value="model"
          return-object
          outlined
          class="grey lighten-3"
        >
          <template v-slot:item="{ parent, item }">
            <v-list-item-avatar tile size="80">
              <v-img
                :src="item.images.filter((v) => v.type === 'product')[0].image"
              />
            </v-list-item-avatar>
            <v-list-item-content style="width: 100px;">
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
        <template v-if="product.selected">
          <v-hover v-slot:default="{ hover }">
            <v-card
              class="mt-3 pa-4"
              style="flex: 1;"
              :elevation="hover ? 6 : ''"
            >
              <v-img
                class="mt-2"
                contain
                height="250px"
                :src="
                  product.selected.images
                    ? product.selected.images.find((v) => v.type === 'product')
                        .image
                    : ''
                "
              />
              <v-card-title
                class="pre d-flex justify-center text-center pt-0 align-start grey lighten-3 mb-3 font-weight-bold pt-4"
                style="font-size: 15px; min-height: 100px; max-height: 100px;"
                >{{
                  product.selected
                    .titleBuilder(false)
                    .split(' ')
                    .slice(0, 6)
                    .join(' ')
                }}</v-card-title
              >
              <v-btn
                style="width: 100%;"
                class="white--text black"
                @click.stop="$router.push(`/product/${product.selected.id}`)"
                >More details</v-btn
              >
              <div class="mt-4 mb-2 ml-2">Specs</div>
              <div class="black" style="width: 100%; height: 2px;" />
              <div
                style="overflow-x: hidden;"
                class="scrollbar d-flex flex-column"
                id="style-8"
              >
                <v-card
                  v-for="(spec, i) in product.selected.specs"
                  :key="i"
                  class="pa-0 mt-3 mb-1"
                >
                  <div class="d-flex align-center grey mb-1 pl-2">
                    <div style="font-size: 12px;" class="white--text">
                      {{ spec.name }}
                    </div>
                  </div>
                  <div class="d-flex flex-row font-weight-medium pl-2">
                    <div
                      style="font-size: 14px;"
                      v-if="typeof spec.value === 'string'"
                    >
                      {{ spec.value ? spec.value : 'N/A' }}
                    </div>
                    <div v-else style="font-size: 14px;">
                      {{ spec.value.join(', ') + spec.unit }}
                    </div>
                    <div
                      style="font-size: 14px;"
                      v-if="typeof spec.value === 'string'"
                      class="ml-0"
                    >
                      {{ spec.unit }}
                    </div>
                  </div>
                  <v-divider />
                </v-card>
              </div>
            </v-card>
          </v-hover>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { debounce } from 'lodash'
import { plainToClass } from 'class-transformer'
import Product from '../classes/Product'
import buildUrl from 'build-url'
const fb = require('../firebaseConfig')
// const queryString = require('query-string')

export default {
  name: 'Compare',
  components: {
    Share: () => import('../components/Share'),
  },
  data() {
    return {
      selectedProduct: 'Atomizer',
      /** @type {Object} */
      items: {
        product0: {
          search: '',
          loading: false,
          selected: null,
          values: [],
        },
        product1: {
          search: '',
          loading: false,
          selected: null,
          values: [],
        },
        product2: {
          search: '',
          loading: false,
          selected: null,
          values: [],
        },
      },
    }
  },
  computed: {
    compTitle() {
      if (Object.values(this.items).filter((v) => v.selected).length > 0) {
        return Object.values(this.items)
          .filter((v) => v.selected)
          .map((v) => (v.selected ? v.selected.model : ''))
          .join(', ')
      } else if (
        Object.values(this.items).filter((v) => v.selected).length === 1
      ) {
        return this.items.product1.selected.model
      } else {
        return 'Products comparision'
      }
    },
    productImageShare() {
      if (this.items.product0.selected) {
        let fb = this.items.product0.selected.images.find(
          (v) => v.type === 'facebook',
        )
        if (fb) return fb.image
        return this.items.product0.selected.images[0].image
      } else if (this.items.product1.selected) {
        let fb = this.items.product1.selected.images.find(
          (v) => v.type === 'facebook',
        )
        if (fb) return fb.image
        return this.items.product1.selected.images[0].image
      } else if (this.items.product2.selected) {
        let fb = this.items.product2.selected.images.find(
          (v) => v.type === 'facebook',
        )
        if (fb) return fb.image
        return this.items.product2.selected.images[0].image
      } else {
        return ''
      }
    },
  },
  activated() {
    this.$store.commit('activePage', 'Compare')
  },
  created() {
    if (this.$route.query.type) {
      this.selectedProduct = this.$route.query.type.replace(/\+/g, ' ')
    }
    Promise.all(
      Object.keys(this.$route.query)
        .filter((key) => new RegExp(/product/gi).exec(key))
        .map((key) =>
          fb.db.collection('Products').doc(this.$route.query[key]).get(),
        ),
    ).then((docs) => {
      docs
        .map((doc) => plainToClass(Product, { id: doc.id, ...doc.data() }))
        .forEach((doc, index) => {
          this.items[`product${index.toString()}`].selected = doc
          this.updateUrl()
        })
    })
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    getItems: debounce(function (product) {
      fb.db
        .collection('Products')
        .where('modelSRC', 'array-contains', product.search.toLowerCase())
        .where('approved', '==', true)
        .where('type', '==', this.selectedProduct)
        .limit(3)
        .get()
        .then((docSnapshots) => {
          // console.log(docSnapshots.docs.map((doc) => doc.data()))
          product.values.splice(0, product.values.length)
          product.values.push(
            ...plainToClass(
              Product,
              docSnapshots.docs.map((doc) =>
                Object.assign(doc.data(), { id: doc.id }),
              ),
            ),
          )
          product.loading = false
        })
    }, 1000),
    updateUrl() {
      let params = new Map()
      params.set('type', this.selectedProduct.replace(/\s/g, '+'))
      window.history.replaceState(
        {},
        null,
        buildUrl('', {
          queryParams: { ...Object.fromEntries(params.entries()) },
        }),
      )
      for (let product of Object.keys(this.items)) {
        if (this.items[product].selected) {
          params.set(product, this.items[product].selected.id)
          window.history.replaceState(
            {},
            null,
            buildUrl('', {
              queryParams: { ...Object.fromEntries(params.entries()) },
            }),
          )
        }
      }
    },
  },
  watch: {
    selectedProduct: {
      handler() {
        for (let product of Object.keys(this.items)) {
          this.items[product].selected = null
          this.items[product].values.splice(
            0,
            this.items[product].values.length,
          )
          this.updateUrl()
        }
      },
    },
    'items.product0.search': {
      handler(search) {
        if (search) {
          this.items.product0.loading = true
          this.getItems(this.items.product0)
        }
      },
    },
    'items.product1.search': {
      handler(search) {
        if (search) {
          this.items.product1.loading = true
          this.getItems(this.items.product1)
        }
      },
    },
    'items.product2.search': {
      handler(search) {
        if (search) {
          this.items.product2.loading = true
          this.getItems(this.items.product2)
        }
      },
    },
    'items.product0.selected': {
      handler() {
        this.updateUrl()
      },
    },
    'items.product1.selected': {
      handler() {
        this.updateUrl()
      },
    },
    'items.product2.selected': {
      handler() {
        this.updateUrl()
      },
    },
  },
}
</script>

<style>
.pre {
  white-space: initial;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: keep-all; /*this stops the word breaking*/
}
#style-8::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

#style-8::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

#style-8::-webkit-scrollbar-thumb {
  background-color: darkgrey;
}
</style>
