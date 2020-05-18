<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      @click="$router.push('/store/' + store.username)"
      v-if="store"
      class="pa-3"
      height="100%"
      width="100%"
      :elevation="hover ? 12 : ''"
    >
      <v-img :src="store.img" height="250px" contain />
      <v-row>
        <v-col class="pa-0">
          <v-card-title>
            <div class="pre" style="font-size: 18px;">
              {{ store.name }}
            </div>
          </v-card-title>
          <v-card-subtitle
            >{{ store.country }} - ({{
              Array.from(new Set(store.branches.map((v) => v.region))).join(
                ', ',
              )
            }})</v-card-subtitle
          >
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'StoreItem',
  props: {
    store: Object,
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
</style>
