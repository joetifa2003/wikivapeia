<template>
  <div class="page hero-container">
    <v-row justify="center" align="center" class="flex-grow-1">
      <v-col cols="12" lg="8" class="pa-0">
        <v-responsive aspect-ratio="21/9">
          <v-carousel cycle hide-delimiters height="500px">
            <v-carousel-item v-for="(image, i) in imagesMain" :key="i">
              <BannerItem :image="image" />
            </v-carousel-item>
          </v-carousel>
        </v-responsive>
        <v-row>
          <v-col>
            <v-carousel cycle show-arrows-on-hover hide-delimiters height="200">
              <v-carousel-item v-for="(image, i) in imagesLeft" :key="i">
                <BannerItem :image="image" />
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col>
            <v-carousel cycle show-arrows-on-hover hide-delimiters height="200">
              <v-carousel-item v-for="(image, i) in imagesCenter" :key="i">
                <BannerItem :image="image" />
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col>
            <v-carousel cycle show-arrows-on-hover hide-delimiters height="200">
              <v-carousel-item v-for="(image, i) in imagesRight" :key="i">
                <BannerItem :image="image" />
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { sortBy } from 'lodash'
const fb = require('../firebaseConfig')

export default {
  name: 'Landing',
  components: {
    BannerItem: () => import('../components/Items/BannerItem'),
  },
  data() {
    return {
      imagesMainQ: [],
      imagesMain: [],
      imagesLeftQ: [],
      imagesLeft: [],
      imagesCenterQ: [],
      imagesCenter: [],
      imagesRightQ: [],
      imagesRight: [],
    }
  },
  mounted() {},
  firestore() {
    return {
      imagesMainQ: fb.db.collection('Banners').where('window', '==', 'Main'),
      imagesLeftQ: fb.db.collection('Banners').where('window', '==', 'Left'),
      imagesCenterQ: fb.db
        .collection('Banners')
        .where('window', '==', 'Center'),
      imagesRightQ: fb.db.collection('Banners').where('window', '==', 'Right'),
    }
  },
  watch: {
    imagesMainQ: {
      handler() {
        this.imagesMain = sortBy(this.imagesMainQ, 'index')
      },
    },
    imagesLeftQ: {
      handler() {
        this.imagesLeft = sortBy(this.imagesLeftQ, 'index')
      },
    },
    imagesCenterQ: {
      handler() {
        this.imagesCenter = sortBy(this.imagesCenterQ, 'index')
      },
    },
    imagesRightQ: {
      handler() {
        this.imagesRight = sortBy(this.imagesRightQ, 'index')
      },
    },
  },
}
</script>

<style scoped lang="scss">
.hero-container {
  background: rgb(47, 47, 47);
  background: -moz-radial-gradient(
    circle,
    rgba(47, 47, 47, 1) 0%,
    rgba(0, 0, 0, 1) 90%
  );
  background: -webkit-radial-gradient(
    circle,
    rgba(47, 47, 47, 1) 0%,
    rgba(0, 0, 0, 1) 90%
  );
  background: radial-gradient(
    circle,
    rgba(47, 47, 47, 1) 0%,
    rgba(0, 0, 0, 1) 90%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#2f2f2f",endColorstr="#000000",GradientType=1);
}
</style>
