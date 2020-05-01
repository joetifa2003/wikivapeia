<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      v-if="product"
      class="pa-3"
      height="100%"
      width="100%"
      :elevation="hover ? 12 : ''"
    >
      <v-overlay v-if="page === 'Ranks'" :absolute="true" :value="hover">
        <div
          style="width: 100%; height: 100%;"
          class="d-flex justify-center flex-column"
        >
          <div
            v-if="userInfo !== null"
            style="height: 50%;"
            class="d-flex justify-end"
          >
            <v-tooltip bottom v-if="!product.sellers.includes(user.uid)">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click.stop="addToSellers('add')"
                  color="green"
                  icon
                  width="50px"
                  height="50px"
                  v-on="on"
                >
                  <v-img
                    width="50px"
                    height="50px"
                    src="~@/assets/addtostore.svg"
                  />
                </v-btn>
              </template>
              <span>Add to {{ userInfo.name }} product list</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  width="50px"
                  height="50px"
                  @click.stop="addToSellers('remove')"
                  color="red"
                  v-on="on"
                >
                  <v-img
                    width="50px"
                    height="50px"
                    src="~@/assets/removefstore.svg"
                /></v-btn>
              </template>
              <span>Remove from {{ userInfo.name }} product list</span>
            </v-tooltip>
          </div>
          <div
            v-if="userInfo && userInfo.type === 'store'"
            style="height: 50%;"
            class="d-flex justify-center"
          >
            <v-btn
              style="margin-top: -20px;"
              @click.stop="$router.push('/product/' + product.id)"
              class="black white--text"
              >More Details</v-btn
            >
          </div>
          <div v-else class="d-flex justify-center">
            <v-btn
              @click.stop="$router.push('/product/' + product.id)"
              class="black white--text"
              >More Details</v-btn
            >
          </div>
        </div>
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
            <div class="pre" style="font-size: 18px;">
              {{ product.titleBuilder(false) }}
            </div>
          </v-card-title>
          <v-card-subtitle>{{ product.getCompany }}</v-card-subtitle>
        </v-col>
        <v-col cols="3" class="pl-0">
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
              sellers: [...data.sellers, this.user.uid],
            })
          })
      } else {
        fb.db
          .collection('Products')
          .doc(this.product.id)
          .get()
          .then((doc) => {
            let data = doc.data()
            data.sellers.splice(data.sellers.indexOf(this.user.uid), 1)
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
.v-overlay__content {
  width: 100%;
  height: 100%;
}
.v-overlay__scrim {
  background: transparent !important;
}
</style>
