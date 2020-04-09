<template>
  <v-container fill-height :style="{ height: height }" fluid class="pa-0 main">
    <v-container fill-height fluid class="hero-container pa-0">
      <v-container fill-height fluid class="pa-0 hero justify-center">
        <v-col class="text-center">
          <h1
            :class="[
              $vuetify.breakpoint.xs ? 'display-3' : '',
              $vuetify.breakpoint.smAndUp ? 'display-4' : '',
              'secondary--text font-weight-regular mb-8',
            ]"
          >
            {{ title }}
          </h1>
          <v-row justify="center" align="center">
            <v-col cols="12" sm="6" lg="4">
              <p class="secondary--text">
                {{ subtitle }}
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-container>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'PageHeader',
  props: ['title', 'subtitle', 'height'],
  mounted() {},
}
</script>

<style lang="scss">
.hero-container {
  background: url('~@/assets/hero.jpg') no-repeat center center fixed;
  background-size: cover;
}
.hero {
  background-color: rgba(0, 0, 0, 0.5);
}
.main {
  background-color: #000;
}
</style>
