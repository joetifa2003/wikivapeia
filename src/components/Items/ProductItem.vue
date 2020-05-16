<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      @click="$router.push('/product/' + product.id)"
      v-if="product"
      class="pa-3 d-flex flex-column"
      height="100%"
      width="100%"
      :elevation="hover ? 12 : ''"
    >
      <v-overlay
        v-if="user && userInfo && userInfo.type === 'store' && page !== 'Admin'"
        color=""
        :value="true"
        :absolute="true"
      >
        <div
          style="width: 100%; min-height: 72.5px;"
          class="d-flex index justify-space-between"
        >
          <template v-if="page !== 'store'">
            <v-btn
              v-if="product.sellers.some((v) => v.id === user.uid)"
              class="ml-2 mt-2"
              color="green"
              small
              fab
            >
              <font-awesome-icon icon="check" size="lg" />
            </v-btn>
          </template>
          <template v-else>
            <v-img
              max-width="60px"
              src="https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/sale-icon-01.svg?alt=media&token=d38bb097-40fb-4017-b2be-dbe405cb99b6"
            />
          </template>
          <v-tooltip
            bottom
            v-if="!product.sellers.some((v) => v.id === user.uid)"
          >
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
          class="d-flex justify-end px-3"
          style="width: 100%; margin-top: -15px;"
        >
          <v-btn icon>
            <v-avatar size="34" style="border: 2px solid #134563;">
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
        <template>
          <v-img
            max-width="60px"
            src="https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/sale-icon-01.svg?alt=media&token=d38bb097-40fb-4017-b2be-dbe405cb99b6"
          />
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
      <v-img :src="product.productImages[0].image" height="250px" contain />
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
          Out of stock
        </div>
        <div class="d-flex flex-column">
          <div
            style="text-decoration: line-through; font-size: 14px;"
            class="grey--text text--darken-1 text-right"
          >
            20000.00 EGP
          </div>
          <div class="font-weight-bold">15000.00 EGP</div>
        </div>
      </div>
    </v-card>
  </v-hover>
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
    storeID: String,
  },
  computed: {
    ...mapState(['user', 'userInfo']),
  },
  methods: {
    publish(product) {
      fb.db.collection('Products').doc(product.id).update({
        approved: !product.approved,
      })
    },
    addToSellers(addRemove) {
      if (addRemove === 'add') {
        fb.db
          .collection('Products')
          .doc(this.product.id)
          .get()
          .then((doc) => {
            let data = doc.data()
            doc.ref.update({
              sellers: [
                ...data.sellers,
                {
                  id: this.user.uid,
                },
              ],
            })
          })
      } else {
        fb.db
          .collection('Products')
          .doc(this.product.id)
          .get()
          .then((doc) => {
            let data = doc.data()
            data.sellers.splice(
              data.sellers.map((v) => v.id).indexOf(this.user.uid),
              1,
            )
            doc.ref.update({
              sellers: data.sellers,
            })
          })
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
.v-overlay {
  z-index: 1 !important;
}
.v-overlay__content {
  width: 100%;
  height: 100%;
}
</style>
