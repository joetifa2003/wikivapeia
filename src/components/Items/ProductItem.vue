<template>
  <v-container fluid style="width: 100%; height: 100%;" class="pa-0">
    <v-hover v-slot:default="{ hover }">
      <v-card
        @click="$router.push('/product/' + product.id)"
        v-if="product"
        class="pa-3 d-flex flex-column overlay-wrapper"
        height="100%"
        width="100%"
        :elevation="hover ? 12 : ''"
      >
        <v-overlay
          v-if="
            user && userInfo && userInfo.type === 'store' && page !== 'Admin'
          "
          color=""
          :value="true"
          :absolute="true"
        >
          <div
            style="width: 100%; min-height: 72.5px;"
            class="d-flex index justify-space-between"
          >
            <template v-if="page !== 'store'">
              <v-btn v-if="seller" class="ml-2 mt-2" color="green" small fab>
                <font-awesome-icon icon="check" size="lg" />
              </v-btn>
            </template>
            <template
              v-else-if="
                (seller ? seller.hasDiscount : false) &&
                !(seller ? seller.outOfStock : false)
              "
            >
              <v-img
                style="z-index: -100;"
                max-width="60px"
                src="https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/sale-icon-01.svg?alt=media&token=d38bb097-40fb-4017-b2be-dbe405cb99b6"
              />
            </template>
            <v-tooltip bottom v-if="!seller">
              <template v-slot:activator="{ on }">
                <v-btn
                  class="mr-2 mt-2 ml-auto"
                  @click.stop="addToSellers('add')"
                  color="green"
                  icon
                  width="43px"
                  height="43px"
                  v-on="on"
                >
                  <v-img
                    width="43px"
                    height="43px"
                    src="~@/assets/addtostore.svg"
                  />
                </v-btn>
              </template>
              <span>Add to {{ userInfo.name }} product list</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="mr-2 mt-2 ml-auto"
                  icon
                  width="43px"
                  height="43px"
                  @click.stop="addToSellers('remove')"
                  color="red"
                  v-on="on"
                >
                  <v-img
                    width="43px"
                    height="43px"
                    src="~@/assets/removefstore.svg"
                /></v-btn>
              </template>
              <span>Remove from {{ userInfo.name }} product list</span>
            </v-tooltip>
          </div>
          <div
            v-if="page === 'store'"
            class="d-flex justify-space-between pl-2 pr-3 edit-product-wrapper"
            style="width: 100%; margin-top: -15px;"
          >
            <div
              v-if="
                seller &&
                seller.hasDiscount &&
                !seller.outOfStock &&
                seller.price &&
                seller.priceDis
              "
              class="red--text text-center d-flex align-center justify-center font-weight-bold"
              style="
                width: 50px;
                height: 50px;
                font-size: 20px;
                margin-top: -15px;
              "
            >
              {{ ((1 - seller.priceDis / seller.price) * 100).toFixed(0) }}%
            </div>
            <v-btn
              class="ml-auto"
              color="indigo"
              icon
              @click.stop="showEditProduct = !showEditProduct"
            >
              <v-avatar size="33" style="border: 1.5px solid #134563;">
                <v-icon style="font-size: 24px; color: #134563;">edit</v-icon>
              </v-avatar>
            </v-btn>
          </div>
        </v-overlay>
        <v-overlay
          v-else-if="page === 'store'"
          :value="true"
          :absolute="true"
          color=""
        >
          <template
            v-if="
              (seller ? seller.hasDiscount : false) &&
              !(seller ? seller.outOfStock : false)
            "
          >
            <v-img
              style="z-index: -100;"
              max-width="60px"
              src="https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/sale-icon-01.svg?alt=media&token=d38bb097-40fb-4017-b2be-dbe405cb99b6"
            />
            <div
              class="d-flex justify-space-between pl-2 pr-3 edit-product-wrapper"
              style="width: 100%; margin-top: -15px;"
            >
              <div
                v-if="
                  seller &&
                  seller.hasDiscount &&
                  !seller.outOfStock &&
                  seller.price &&
                  seller.priceDis
                "
                class="red--text text-center d-flex align-center justify-center font-weight-bold"
                style="
                  width: 50px;
                  height: 50px;
                  font-size: 20px;
                  margin-top: -15px;
                "
              >
                {{
                  (
                    (1 - parseInt(seller.priceDis) / parseInt(seller.price)) *
                    100
                  ).toFixed(0)
                }}%
              </div>
            </div>
          </template>
        </v-overlay>
        <v-overlay
          class="d-flex pa-0"
          v-if="page === 'Admin'"
          :absolute="true"
          :value="hover"
        >
          <div
            style="width: 100%; height: 100%;"
            class="d-flex justify-center flex-column"
          >
            <v-btn
              min-width="200"
              max-height="200"
              @click.stop="$emit('addImage', product)"
              class="primary secondary--text"
              >Add image</v-btn
            >
            <v-btn
              min-width="200"
              max-height="200"
              @click.stop="$emit('editImages', product)"
              class="primary secondary--text"
              >Edit images</v-btn
            >
            <v-btn
              min-width="200"
              max-height="200"
              @click.stop="$emit('updateProduct', product)"
              class="primary secondary--text"
              >Update product</v-btn
            >
            <v-btn
              @click.stop="publish(product)"
              :color="product.approved ? 'red' : 'blue'"
              >{{ product.approved ? 'unpublish' : 'publish' }}</v-btn
            >
            <v-btn
              min-width="200"
              max-height="200"
              @click.stop="$emit('deleteProduct', product)"
              class="primary secondary--text"
              >Delete product</v-btn
            >
            <v-checkbox
              color="white"
              background-color="primary"
              class="white--text"
              label="Select"
              v-model="product.checked"
            />
          </div>
        </v-overlay>
        <v-img :src="product.productImages[0].image" height="250px" contain>
          <div
            v-if="product.type === 'E-Liquid'"
            style="
              margin-top: 80px;
              background-color: rgba(255, 255, 255, 0.56);
            "
            class="d-inline-flex flex-column justify-start ml-n3 pa-1"
          >
            <ul>
              <li
                class="font-weight-black"
                style="font-size: 16px; font-style: italic;"
              >
                {{ product.specs.find((v) => v.name === 'DL/MTL').value }}
              </li>
              <li
                class="font-weight-black"
                style="font-size: 16px; font-style: italic;"
              >
                {{
                  product.specs
                    .find((v) => v.name === 'E-Liquid type')
                    .value.toUpperCase()
                }}
              </li>
              <div style="width: 100%; height: 2px;" class="black mb-2" />
              <li
                class="font-weight-black"
                style="font-size: 12px; font-style: italic;"
                v-for="(flavor, i) in product.specs.find(
                  (v) => v.name === 'Flavors',
                ).value"
                :key="i"
              >
                {{ flavor.toUpperCase() }}
              </li>
            </ul>
          </div>
        </v-img>
        <v-row>
          <v-col class="pa-0">
            <v-card-title>
              <div class="pre" style="font-size: 15px; line-height: 20px;">
                {{ product.titleBuilder(false) }}
              </div>
            </v-card-title>
            <v-card-subtitle>{{ product.getCompany }}</v-card-subtitle>
          </v-col>
          <v-col v-if="score" cols="3" class="pl-0">
            <div class="-width d-flex align-end justify-end">
              <div
                class="primary d-flex justify-center align-center flex-column avgScore"
                style="width: 70px; height: 70px;"
              >
                <div
                  class="white--text font-weight-bold text-center"
                  style="font-size: 28px;"
                >
                  {{ product.getLastScore }}
                </div>
                <div
                  class="text-center white--text"
                  style="letter-spacing: 2px; font-size: 14px;"
                >
                  Score
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <div
          v-if="page === 'store'"
          style="width: 100%; flex: 1;"
          class="d-flex flex-row justify-space-between mt-n4"
        >
          <div class="align-self-end red--text text--darken-1 font-weight-bold">
            <div v-if="seller.outOfStock">
              Out of stock
            </div>
          </div>
          <div
            v-if="!seller.outOfStock"
            class="d-flex flex-column text-right justify-end"
          >
            <div
              v-if="seller.hasDiscount && seller.price"
              style="text-decoration: line-through; font-size: 15px;"
              class="grey--text text--darken-1 text-right"
            >
              {{ seller.price }} {{ storeCurrency }}
            </div>
            <div
              v-if="seller.price"
              class="font-weight-bold"
              style="font-size: 20px;"
            >
              {{ seller.hasDiscount ? seller.priceDis : seller.price }}
              {{ storeCurrency }}
            </div>
          </div>
        </div>
      </v-card>
    </v-hover>
    <v-dialog
      v-model="showEditProduct"
      :width="$vuetify.breakpoint.mdAndUp ? '25%' : '100%'"
      :persistent="true"
    >
      <v-card class="pa-8">
        <v-img :src="product.productImages[0].image" height="150px" contain />
        <v-card-title class="d-flex justify-center" style="font-size: 18px;"
          >Edit {{ product.titleBuilder(false) }}</v-card-title
        >
        <div class="d-flex flex-row justify-space-between">
          <v-checkbox label="Out of stock" v-model="price.outOfStock" />
          <v-checkbox
            :disabled="price.outOfStock"
            label="Discount"
            v-model="price.hasDiscount"
          />
        </div>
        <v-text-field
          :disabled="price.outOfStock"
          outlined
          dense
          label="Price"
          v-model.number="price.price"
        />
        <v-text-field
          outlined
          dense
          label="Price after discount"
          v-model.number="price.priceDis"
          :disabled="price.outOfStock || !price.hasDiscount"
        />
        <div class="d-flex flex-row justify-space-between">
          <v-btn @click="showEditProduct = false" class="black white--text"
            >Cancel</v-btn
          >
          <v-btn @click="savePrice" class="black white--text">Save</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Product from '../../classes/Product'
const fb = require('../../firebaseConfig')

export default {
  name: 'Product_item',
  props: {
    product: Product,
    page: String,
    score: {
      type: Boolean,
      default: true,
    },
    storeUsername: String,
    storeCurrency: String,
    seller: Object,
  },
  data() {
    return {
      showEditProduct: false,
      price: {
        outOfStock: false,
        hasDiscount: false,
        price: '',
        priceDis: '',
      },
    }
  },
  created() {
    if (this.seller) {
      this.price['outOfStock'] = this.seller['outOfStock']
      this.price['hasDiscount'] = this.seller['hasDiscount']
      this.price['price'] = this.seller['price']
      this.price['priceDis'] = this.seller['priceDis']
    }
  },
  computed: {
    ...mapState(['user', 'userInfo']),
  },
  methods: {
    async savePrice() {
      await fb.db
        .collection('Sellers')
        .doc(`${this.storeUsername}-${this.product.id}`)
        .update({
          ...this.price,
          productID: this.product.id,
          storeID: this.storeUsername,
        })
      this.showEditProduct = false
    },
    publish(product) {
      fb.db.collection('Products').doc(product.id).update({
        approved: !product.approved,
      })
    },
    addToSellers(addRemove) {
      if (addRemove === 'add') {
        fb.db
          .collection('Sellers')
          .doc(`${this.userInfo.username}-${this.product.id}`)
          .set({
            productID: this.product.id,
            storeID: this.userInfo.username,
            modelSRC: this.product.modelSRC,
            type: this.product.type,
            subType: this.product.subType,
            price: '',
            priceDis: '',
            hasDiscount: false,
            outOfStock: false,
            date: new Date(),
          })
      } else {
        fb.db
          .collection('Sellers')
          .doc(`${this.userInfo.username}-${this.product.id}`)
          .delete()
      }
    },
  },
}
</script>

<style>
.avgScore {
  border-radius: 15px;
}
.pre {
  white-space: initial;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: keep-all; /*this stops the word breaking*/
}
.v-overlay__content {
  width: 100%;
  height: 100%;
}
.edit-product-wrapper {
  position: relative;
}
.edit-product {
  position: absolute;
  top: 50px;
}
</style>
