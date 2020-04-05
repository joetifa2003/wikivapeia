<template>
  <v-app>
    <Nav />
    <v-content>
      <v-container fill-height fluid class="pa-0 align-start">
        <div
          :class="[
            'warn d-flex justify-center align-center font-weight-bold pa-5',
          ]"
        >
          <p class="mb-0 text-center">
            WARNING: This product contains nicotine. Nicotine is an addictive
            chemical.
          </p>
        </div>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Nav from './components/Nav.vue'

export default {
  name: 'App',
  components: {
    Nav,
  },
}
</script>

<style lang="scss">
#app {
  color: #000000;
  overflow-x: hidden;
}
.warn {
  height: 50px;
  width: 100%;
  border: 5px solid black;
  position: fixed;
  top: 48px;
  background: white;
  z-index: 2;
}
.swal2-container {
  font-family: 'Roboto', sans-serif;
}
.page {
  display: flex;
  align-content: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
}
.bgs {
  background-color: #000000;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='30' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23222' stroke-width='10' %3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E");
  background-size: cover;
  background-attachment: fixed;
}
</style>
