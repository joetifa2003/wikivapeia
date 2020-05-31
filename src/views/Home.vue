<template>
  <v-container fill-height fluid class="pa-0">
    <vue-headful title="Wikivapeia - Vape market around the world" />
    <Landing
      title="Wikivapeia"
      subtitle="Occaecat deserunt sit occaecat et labore ipsum. Amet ut nisi
                pariatur amet qui aute ea eu enim tempor eiusmod. Cillum ex
                cupidatat ut mollit excepteur consequat sunt eu. Duis cupidatat
                dolore dolore aute laboris deserunt ad. Nostrud aliqua nisi
                ullamco esse. Commodo ex tempor et nisi elit consequat aliquip
                quis ex deserunt consectetur. Eu ut dolor eiusmod irure
                reprehenderit nulla."
    />
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  components: {
    Landing: () => import('../components/Landing.vue'),
  },
  activated() {
    this.$store.commit('activePage', 'Home')
  },
}
</script>

<style lang="scss">
// .heros {
//   position: absolute;
//   top: 0px;
// }
// video {
//   object-fit: cover;
// }
</style>
