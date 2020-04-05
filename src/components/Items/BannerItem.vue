<template>
  <div style="width: 100%; height: 100%;">
    <v-img
      v-if="image.window === 'Main'"
      :src="image.image"
      height="100%"
      width="100%"
      aspect-ratio="16/9"
      class="d-flex"
    >
      <div
        style="width: 100%; height: 100%;"
        :class="['d-flex', image.justify, image.align]"
      >
        <v-btn
          v-if="image.btn"
          style="margin-bottom: 15px; font-size: 18px;"
          min-width="250px"
          @click.stop="$router.push(image.route)"
          class="grey darken-4 white--text font-weight-bold"
          >{{ image.caption }}</v-btn
        >
      </div>
    </v-img>
    <v-img
      v-else
      contain
      :src="image.image"
      height="100%"
      width="100%"
      aspect-ratio="16/9"
      class="d-flex"
    >
      <div
        style="width: 100%; height: 100%;"
        :class="['d-flex', image.justify, image.align]"
      >
        <v-btn
          v-if="image.btn"
          style="margin-bottom: 15px; font-size: 18px;"
          min-width="250px"
          @click.stop="$router.push(image.route)"
          class="grey darken-4 white--text font-weight-bold"
          >{{ image.caption }}</v-btn
        >
      </div>
    </v-img>
  </div>
</template>

<script>
export default {
  name: 'BannerItem',
  props: ['image'],
}
</script>

<style></style>
