<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      class="pa-3"
      height="100%"
      width="100%"
      :elevation="hover ? 12 : ''"
    >
      <v-overlay v-if="page === 'Ranks'" :absolute="true" :value="hover">
        <v-btn
          @click.stop="$router.push('/product/' + product.id)"
          class="primary secondary--text"
          >Details</v-btn
        >
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
      <v-img :src="image" height="250px" contain />
      <v-row>
        <v-col class="pa-0">
          <v-card-title>
            <div class="pre">
              {{
                `${product.model} ${
                  product.type === 'Mod'
                    ? product.specs.filter((v) => v.name === 'Power output')[0]
                        .value + 'W'
                    : ''
                } ${
                  product.type === 'Mod'
                    ? product.specs.filter((v) => v.name === 'Control')[0].value
                    : ''
                } ${
                  product.type === 'Atomizer'
                    ? product.specs.filter((v) => v.name === 'Category')[0]
                        .value
                    : ''
                } ${product.specs.filter((v) => v.name === 'Type')[0].value} ${
                  product.type === 'Mod' ? 'Mod' : ''
                }`
              }}
            </div>
          </v-card-title>
          <v-card-subtitle>{{ product.company.toUpperCase() }}</v-card-subtitle>
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
                {{ product.lastScore.toFixed(1) }}
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
export default {
  name: 'Product_item',
  props: ['product', 'page'],
  computed: {
    image() {
      return this.product.images.filter((v) => v.type === 'product')[0].image
    },
  },
}
</script>

<style>
.avgScore {
  border-radius: 15px;
}
.pre {
  word-break: keep-all; /*this stops the word breaking*/
}
</style>
