<template>
  <v-btn
    @click="navigatorShare"
    fixed
    style="z-index: 15 !important;"
    bottom
    right
    v-if="navigatorSupport"
    color="black"
    dark
    fab
  >
    <v-icon>share</v-icon>
  </v-btn>
  <v-speed-dial
    v-else
    style="z-index: 15 !important;"
    v-model="fab"
    bottom
    right
    fixed
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="black" dark fab>
        <v-icon v-if="fab">close</v-icon>
        <v-icon v-else>share</v-icon>
      </v-btn>
    </template>
    <v-btn
      @click.stop="
        openUrl(`https://www.facebook.com/sharer.php?u=${currentHref}`)
      "
      fab
      icon
      dark
      small
    >
      <img width="40" height="40" src="~@/assets/social/facebook.svg" />
    </v-btn>
    <v-btn
      @click.stop="openUrl(`https://api.whatsapp.com/send?text=${currentHref}`)"
      fab
      dark
      small
      class="white"
    >
      <img width="40" height="40" src="~@/assets/social/whatsapp.svg" />
    </v-btn>
    <v-btn
      @click="
        openUrl(`http://www.facebook.com/dialog/send?
  app_id=1683549215116376
  &amp;link=${currentHref}
  &amp;redirect_uri=${currentHref}`)
      "
      fab
      dark
      small
      class="white"
    >
      <img width="40" height="40" src="~@/assets/social/messenger.svg" />
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'Share',
  props: ['title'],
  data() {
    return {
      fab: false,
    }
  },
  computed: {
    currentHref() {
      return window.location.href
    },
    navigatorSupport() {
      return navigator.share
    },
  },
  methods: {
    openUrl(url) {
      window.open(url, 'myWindow', 'width=800,height=600')
    },
    navigatorShare() {
      navigator.share({
        title: this.title,
        url: this.currentHref,
      })
    },
  },
}
</script>

<style scoped></style>
