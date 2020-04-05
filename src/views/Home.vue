<template>
  <v-container fill-height fluid class="pa-0">
    <vue-headful
      :title="`Wikivapeia - Worldwide vape ranking service`"
      description="Wikivapeia offers ranking for vape components like Atomizers, Mods and E-liquid by voting from users around the world to guide them to their needs."
    />
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
import Landing from '../components/Landing.vue'
import store from '../store/index.js'

export default {
  name: 'Home',
  data() {
    return {}
  },
  components: {
    Landing,
  },
  created() {
    store.commit('activePage', 'Home')
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
