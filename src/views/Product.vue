<template>
  <v-container
    fill-height
    fluid
    class="align-start pa-2 justify-center pt-10 full grey lighten-3"
  >
    <v-row class="justify-center" style="width: 100%;">
      <v-col cols="12" md="8" lg="6">
        <v-card v-if="product" width="100%" elevation="0">
          <Share :title="product.titleBuilder(true)" />
          <vue-headful
            :title="`WIKIVAPEIA - ${product
              .titleBuilder(true)
              .toUpperCase()} RANKING`"
            :image="
              product.facebookImages[0]
                ? product.facebookImages[0].image
                : product.productImages[0].image
            "
          />
          <v-col>
            <div class="d-flex flex-row pa-3">
              <div class="flex-grow-1">
                <h1
                  class="font-weight-medium"
                  :style="{
                    fontSize: $vuetify.breakpoint.smAndDown ? '20px' : '25px',
                  }"
                >
                  {{ product.titleBuilder(false) }}
                </h1>
                <div
                  class="pa-0 font-weight-medium grey--text lighten-2"
                  style="font-size: 15px;"
                >
                  {{ product.company.toUpperCase() }}
                </div>
              </div>
              <div v-if="pType">
                <div
                  class="d-flex justify-end align-end ml-1"
                  style="height: 100%;"
                >
                  <div
                    style="height: 85px; width: 85px;"
                    class="black white--text avgScore"
                  >
                    <div
                      class="white--text font-weight-bold text-center"
                      style="font-size: 35px;"
                    >
                      {{ overall.toFixed(2) }}
                    </div>
                    <div class="text-center" style="letter-spacing: 2px;">
                      Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="width: 100%; height: 2px;" class="black" />
            <div class="mt-2 d-flex justify-center grey lighten-4 py-2">
              <v-chip
                v-for="(feature, i) in product.features"
                :key="i"
                class="mr-2 font-weight-bold"
                >{{ feature }}</v-chip
              >
            </div>
            <v-row justify="center">
              <v-col
                cols="12"
                md="6"
                class="d-flex flex-column align-start justify-center"
              >
                <v-carousel
                  interval="4000"
                  height="350px"
                  cycle
                  hide-delimiter-background
                  show-arrows-on-hover
                >
                  <v-carousel-item
                    v-for="(image, i) in product.productImages"
                    :key="i"
                  >
                    <v-img
                      contain
                      width="100%"
                      height="100%"
                      :src="image.image"
                    />
                  </v-carousel-item>
                </v-carousel>
                <v-btn
                  v-if="
                    ['Atomizer', 'Mod', 'Pod system'].includes(product.type)
                  "
                  @click="
                    $router.push({
                      path: '/compare',
                      query: {
                        type: product.type.replace(/\s/g, '+'),
                        product0: productID,
                      },
                    })
                  "
                  class="grey darken-2 white--text mt-2"
                  rounded
                  small
                  ><v-icon class="mr-2">compare_arrows</v-icon> Compare
                  with</v-btn
                >
              </v-col>
              <v-col v-if="pType" cols="12" md="6" class="d-flex flex-column">
                <div class="pa-2 mb-1" v-for="(avg, i) in avgVotes" :key="i">
                  <div class="d-flex flex-row justify-center align-center">
                    <div
                      style="width: 300px;"
                      class="font-weight-bold black--text"
                    >
                      {{ avg.name }}
                    </div>
                    <v-progress-linear
                      background-color="grey lighten-2"
                      class="mr-5"
                      :value="avg.value * 10"
                      height="15"
                    />
                    {{ avg.value.toFixed(1) }}
                  </div>
                </div>
                <div class="d-flex justify-space-between">
                  <div class="d-flex flex-column">
                    <v-btn
                      v-if="voted !== null"
                      @click.stop="voteClick"
                      :class="[
                        'white--text',
                        voted ? 'grey darken-2' : 'black',
                      ]"
                      >{{ voted ? 'Unvote' : 'Vote' }}</v-btn
                    >
                  </div>
                  <div
                    class="font-weight-medium black--text align-self-end"
                    style="font-size: 14px;"
                  >
                    <v-icon color="black" class="mr-2">person</v-icon>
                    {{ voteSum ? voteSum.votersCount : 0 }} Voted
                  </div>
                </div>
              </v-col>
              <v-col v-else cols="12" md="12" class="d-flex flex-column">
                <v-subheader
                  class="font-weight-bold pa-0"
                  style="font-size: 18px;"
                  >Description</v-subheader
                >
                <div
                  style="width: 100%; height: 2px;"
                  class="grey lighten-1 mb-3"
                />
                <div
                  class="content ql-editor text-justify"
                  style="padding: 0 !important;"
                >
                  <div v-if="descReadMore" v-html="product.desc"></div>
                  <div
                    v-else
                    v-html="
                      product.desc.split(' ').slice(0, 25).join(' ') + '....'
                    "
                  ></div>
                  <div class="d-flex justify-end">
                    <v-btn
                      v-if="product.desc.split(' ').length > 25"
                      text
                      @click.stop="descReadMore = !descReadMore"
                      class="blue--text"
                    >
                      {{ descReadMore ? 'Read less' : 'Read more' }}
                      <v-icon>
                        {{
                          descReadMore
                            ? 'keyboard_arrow_up'
                            : 'keyboard_arrow_down'
                        }}
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
            <div
              style="height: 48px;"
              class="grey lighten-4 d-flex align-center"
            >
              <social-sharing
                class="my-4"
                :url="'wikivapeia.com' + $route.path"
                hashtags="WIKIVAPEIA"
                network-tag="span"
                inline-template
              >
                <div class="d-flex justify-space-around" style="width: 150px;">
                  <network network="facebook">
                    <font-awesome-icon
                      class="indigo--text darken-4"
                      :icon="['fab', 'facebook-square']"
                      size="2x"
                    />
                  </network>
                  <network network="twitter">
                    <font-awesome-icon
                      class="blue--text darken-2"
                      :icon="['fab', 'twitter-square']"
                      size="2x"
                    />
                  </network>
                  <network network="whatsapp">
                    <font-awesome-icon
                      class="green--text darken-3"
                      :icon="['fab', 'whatsapp-square']"
                      size="2x"
                    />
                  </network>
                  <network network="telegram">
                    <font-awesome-icon
                      class="blue--text darken-3"
                      :icon="['fab', 'telegram']"
                      size="2x"
                    />
                  </network>

                  <network network="instagram">
                    <font-awesome-icon
                      class="blue--text darken-3"
                      :icon="['fab', 'telegram']"
                      size="2x"
                    />
                  </network>
                </div>
              </social-sharing>
            </div>
            <v-subheader class="font-weight-bold pa-0" style="font-size: 18px;"
              >Where to buy ?</v-subheader
            >
            <div
              style="width: 100%; height: 2px;"
              class="grey lighten-1 mb-1"
            />
            <div v-if="stores.length > 4">
              <hooper :settings="hooperOptions" style="height: auto;">
                <slide
                  class="d-flex justify-center"
                  v-for="(store, i) in stores"
                  :key="i"
                  index="1"
                >
                  <v-card
                    @click="$router.push(`/store/${store.username}`)"
                    elevation="8"
                    max-width="150px"
                    class="my-5 grey lighten-4"
                    height="212px"
                  >
                    <v-img :src="store.img" width="150px" height="150px" />
                    <v-card-title
                      class="pre d-flex justify-center"
                      style="font-size: 16px;"
                    >
                      <h5 class="text-center linespaced">
                        {{ store.name.toUpperCase() }}
                      </h5>
                    </v-card-title>
                  </v-card>
                </slide>
                <hooper-navigation slot="hooper-addons"></hooper-navigation>
              </hooper>
            </div>
            <div v-else class="d-flex flex-row">
              <v-row>
                <v-col
                  class="d-flex justify-center"
                  v-for="store in stores"
                  :key="store.id"
                >
                  <v-card
                    @click="$router.push(`/store/${store.username}`)"
                    elevation="8"
                    max-width="150px"
                    class="my-5"
                    height="212px"
                  >
                    <v-img :src="store.img" width="150px" height="150px" />
                    <v-card-title
                      class="pre d-flex justify-center"
                      style="font-size: 16px;"
                    >
                      <h5 class="text-center linespaced">
                        {{ store.name.toUpperCase() }}
                      </h5>
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <v-row v-if="pType">
              <v-col>
                <v-subheader
                  class="font-weight-bold pa-0"
                  style="font-size: 18px;"
                  >Specifications</v-subheader
                >
                <div
                  style="width: 100%; height: 2px;"
                  class="grey lighten-1 mb-3"
                />
                <div
                  style="
                    max-height: 400px;
                    overflow-y: auto;
                    overflow-x: hidden;
                  "
                  class="scrollbar"
                  id="style-8"
                >
                  <v-col v-for="(spec, i) in specs" :key="i" class="pa-0">
                    <v-row>
                      <v-col>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2">{{ spec.icon }}</v-icon>
                          <div class="font-weight-bold primary--text">
                            {{ spec.name }}
                          </div>
                        </div>
                      </v-col>
                      <v-col>
                        <div class="d-flex flex-row">
                          <div v-if="typeof spec.value === 'string'">
                            {{ spec.value }}
                          </div>
                          <div v-else>
                            <ul>
                              <li v-for="(x, i) in spec.value" :key="i">
                                {{ x + spec.unit }}
                              </li>
                            </ul>
                          </div>
                          <div
                            v-if="typeof spec.value === 'string'"
                            class="ml-0"
                          >
                            {{ spec.unit }}
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                    <v-divider />
                  </v-col>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-subheader
                  class="font-weight-bold pa-0"
                  style="font-size: 18px;"
                  >Description</v-subheader
                >
                <div
                  style="width: 100%; height: 2px;"
                  class="grey lighten-1 mb-3"
                />
                <div
                  class="content ql-editor text-justify"
                  style="padding: 0 !important;"
                >
                  <div v-if="descReadMore" v-html="product.desc"></div>
                  <div
                    v-else
                    v-html="
                      product.desc.split(' ').slice(0, 100).join(' ') + '....'
                    "
                  ></div>
                  <div class="d-flex justify-end">
                    <v-btn
                      v-if="product.desc.split(' ').length > 100"
                      text
                      @click.stop="descReadMore = !descReadMore"
                      class="blue--text"
                    >
                      {{ descReadMore ? 'Read less' : 'Read more' }}
                      <v-icon>
                        {{
                          descReadMore
                            ? 'keyboard_arrow_up'
                            : 'keyboard_arrow_down'
                        }}
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
            <CommentSection :productIDD="productID" />
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-if="product"
      v-model="voteDialog"
      :width="$vuetify.breakpoint.smAndDown ? '100%' : '30%'"
    >
      <v-card width="100%" class="pa-5">
        <v-card-title class="justify-center"
          >Vote for {{ product.model }}</v-card-title
        >
        <v-col>
          <div>
            <v-row v-for="(rank, i) in votes" :key="i">
              <v-col>
                <h4>{{ rank.name }}</h4>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-slider
                  v-model="rank.value"
                  thumb-label="always"
                  max="10"
                  min="1"
                />
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col cols="12">
              <v-btn
                @click.stop="vote"
                style="width: 100%;"
                :class="[
                  'red darken-4 white--text',
                  voteIsclicked ? 'v-btn--disabled' : '',
                ]"
                >Vote</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2'
import { cloneDeep, sortBy } from 'lodash'
import { mapState } from 'vuex'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { plainToClass } from 'class-transformer'
import Product from '../classes/Product'
import Store from '../classes/Store'
import { Slide, Hooper, Navigation as HooperNavigation } from 'hooper'
import 'hooper/dist/hooper.css'

const fb = require('../firebaseConfig')

export default {
  name: 'Product',
  props: ['id'],
  components: {
    CommentSection: () => import('../components/CommentSection'),
    Share: () => import('../components/Share'),
    Hooper,
    Slide,
    HooperNavigation,
  },
  data() {
    return {
      hooperOptions: {
        itemsToShow: 2,
        infiniteScroll: true,
        autoPlay: true,
        playSpeed: 2000,
        breakpoints: {
          800: {
            itemsToShow: 3,
          },
          1024: {
            itemsToShow: 4,
          },
          1500: {
            itemsToShow: 5,
          },
        },
      },
      comment: '',
      descReadMore: false,
      productID: this.id,
      productQ: null,
      voteDialog: false,
      signUp: false,
      ranks: {
        mods: [
          { name: 'Fire speed', value: 0 },
          { name: 'Design', value: 0 },
          { name: 'Material', value: 0 },
          { name: 'Software', value: 0 },
          { name: 'Charging speed', value: 0 },
          { name: 'Value for price', value: 0 },
        ],
        atomizersDL: [
          { name: 'Flavor', value: 0 },
          { name: 'Cloud production', value: 0 },
          { name: 'Ease of Build', value: 0 },
          { name: 'Air flow', value: 0 },
          { name: 'Thraot hit', value: 0 },
          { name: 'Material', value: 0 },
          { name: 'Design', value: 0 },
          { name: 'Value for price', value: 0 },
        ],
        atomizersMTL: [
          { name: 'Flavor', value: 0 },
          { name: 'Ease of Build', value: 0 },
          { name: 'Air flow', value: 0 },
          { name: 'Thraot hit', value: 0 },
          { name: 'Material', value: 0 },
          { name: 'Design', value: 0 },
          { name: 'Value for price', value: 0 },
        ],
        pods: [
          { name: 'Flavor', value: 0 },
          { name: 'Airflow control', value: 0 },
          { name: 'Ease of refill', value: 0 },
          { name: 'Battery life', value: 0 },
          { name: 'Design', value: 0 },
          { name: 'Value for price', value: 0 },
        ],
        liquid: [
          { name: 'Recipe', value: 0 },
          { name: 'Material', value: 0 },
          { name: 'Nicotine', value: 0 },
        ],
      },
      voted: null,
      votedQ: null,
      avgVotes: null,
      overall: 0,
      voteSum: null,
      voteIsclicked: false,
      commentsQ: [],
      replies: [],
      commentsPerPage: 5,
      commentsVis: 5,
      storesQ: [],
      sellers: [],
    }
  },
  activated() {
    this.$store.commit('activePage', 'Ranks')
  },
  created() {
    if (this.user) {
      this.$bind(
        'votedQ',
        fb.db
          .collection('Votes')
          .where('productID', '==', this.productID)
          .where('voter', '==', this.user.uid),
      )
    } else {
      this.voted = false
    }
  },
  computed: {
    ...mapState(['user', 'userInfo']),
    pType() {
      return ['Atomizer', 'Mod', 'Pod system', 'E-Liquid'].includes(
        this.product.type,
      )
    },
    /**
     * @returns {Array}
     */
    specs() {
      if (this.storesQ) {
        return sortBy(this.product.specs, 'index')
      } else {
        return []
      }
    },
    /**
     * @returns {Product}
     */
    product() {
      return /** @type {Product} */ plainToClass(Product, this.productQ)
    },
    /** @returns {Store[]} */
    stores() {
      return plainToClass(Store, this.storesQ).filter(
        (v) => v.region === 'Cairo',
      )
    },
    votes() {
      if (this.product.type === 'Mod') {
        return cloneDeep(this.ranks.mods)
      } else if (this.product.type === 'Atomizer') {
        if (
          this.product.specs.filter((v) => v.name === 'Category')[0].value ===
          'DL'
        ) {
          return cloneDeep(this.ranks.atomizersDL)
        } else {
          return cloneDeep(this.ranks.atomizersDL)
        }
      } else if (this.product.type === 'Pod system') {
        return cloneDeep(this.ranks.pods)
      } else {
        return cloneDeep(this.ranks.liquid)
      }
    },
  },
  firestore() {
    return {
      productQ: fb.db.collection('Products').doc(this.productID),
      voteSum: fb.db.collection('VoteSum').doc(this.productID),
      sellers: fb.db
        .collection('Sellers')
        .where('productID', '==', this.productID),
    }
  },
  watch: {
    sellers: {
      async handler() {
        if (this.sellers.length !== 0) {
          let country
          if (this.userInfo) {
            country = this.userInfo.country
          } else {
            let data = await fetch('https://freegeoip.app/json/')
            let location = await data.json()
            country = location.country_name
          }
          this.$bind(
            'storesQ',
            fb.db
              .collection('Users')
              .where(
                'username',
                'in',
                this.sellers.map((v) => v.storeID),
              )
              .where('country', '==', country),
            { reset: false },
          )
        }
      },
    },
    product: {
      async handler() {
        if (!this.voteSum) {
          this.avgVotes = cloneDeep(this.votes)
        }
      },
    },
    voteSum: {
      async handler(voteSum) {
        if (voteSum) {
          this.overall = 0
          this.avgVotes = cloneDeep(this.votes)
          const votersCount = voteSum.votersCount
          for (const [i, v] of voteSum.sum.entries()) {
            this.avgVotes[i].value = v.value / votersCount
            this.overall += v.value / (votersCount * voteSum.sum.length)
          }
        } else {
          for (let i = 0; i < this.avgVotes.length; i++) {
            this.avgVotes[i].value = 0
          }
          this.overall = 0
        }
      },
    },
    votedQ: {
      handler(votedQ) {
        if (votedQ.length >= 1) {
          this.voted = true
        } else {
          this.voted = false
        }
      },
    },
    carouselData() {
      this.$refs.carousel.slideTo(this.carouselData)
    },
  },
  methods: {
    signUpDialog() {
      this.signUp = !this.signUp
    },
    async vote() {
      this.voteIsclicked = true
      let totalRank = []
      let ranks = {}
      totalRank = cloneDeep(this.votes)
      ranks = this.votes
      fb.db
        .runTransaction((transaction) => {
          return transaction
            .get(fb.db.collection('VoteSum').doc(this.productID))
            .then((voteSumQ) => {
              let voteSum = voteSumQ.data()
              if (voteSum) {
                //eslint-disable-next-line no-unused-vars
                for (const [i, rank] of totalRank.entries()) {
                  totalRank[i].value += voteSum.sum[i].value
                }
                transaction.set(
                  fb.db.collection('VoteSum').doc(this.productID),
                  {
                    sum: totalRank,
                    votersCount: fb.fb.firestore.FieldValue.increment(1),
                  },
                )
              } else {
                transaction.set(
                  fb.db.collection('VoteSum').doc(this.productID),
                  {
                    sum: totalRank,
                    votersCount: 1,
                  },
                )
              }
            })
        })
        .then(() => {
          fb.db
            .collection('Votes')
            .add({
              productID: this.productID,
              voter: this.user.uid,
              votes: ranks,
            })
            .then(() => {
              this.voteDialog = false
              this.voteIsclicked = false
              Swal.fire('Voted!', 'Voted successfully!!', 'success')
            })
        })
    },
    async voteClick() {
      if (this.user) {
        if (this.voted === false) {
          this.voteDialog = true
        } else {
          fb.db.runTransaction((transaction) => {
            return transaction
              .get(fb.db.collection('VoteSum').doc(this.productID))
              .then((voteSumQ) => {
                let voteSum = voteSumQ.data()
                if (voteSum.votersCount === 1) {
                  transaction.delete(
                    fb.db.collection('VoteSum').doc(this.productID),
                  )
                  transaction.delete(
                    fb.db.collection('Votes').doc(this.votedQ[0].id),
                  )
                } else {
                  for (let i = 0; i < this.votedQ[0].votes.length; i++) {
                    let votedValue = this.votedQ[0].votes[i].value
                    voteSum.sum[i].value -= votedValue
                  }
                  transaction.set(
                    fb.db.collection('VoteSum').doc(this.productID),
                    {
                      sum: voteSum.sum,
                      votersCount: fb.fb.firestore.FieldValue.increment(
                        -Math.abs(1),
                      ),
                    },
                  )
                  transaction.delete(
                    fb.db.collection('Votes').doc(this.votedQ[0].id),
                  )
                }
              })
          })
        }
      } else {
        this.$router.push('/signUp')
      }
    },
    getCommentTime(date) {
      let time = differenceInSeconds(new Date(), date)
      if (time < 60) {
        return 'Just now'
      } else if (time >= 60 && time < 60 * 60) {
        return (time / 60).toFixed(0) + 'm'
      } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
        return (time / (60 * 60)).toFixed(0) + 'h'
      } else if (time >= 60 * 60 * 24 && time < 60 * 60 * 24 * 7) {
        return (time / (60 * 60 * 24)).toFixed(0) + 'd'
      } else {
        return (time / (60 * 60 * 24 * 7)).toFixed(0) + 'w'
      }
    },
  },
}
</script>

<style lang="scss">
.justify-desc {
  text-align: justify;
}
.avgScore {
  border-radius: 15px;
}
#emoji-popup {
  width: 400px !important;
}
.emoji-popover-inner {
  width: 400px !important;
}
input {
  text-align: start;
  unicode-bidi: plaintext;
}
#twemoji-textarea {
  text-align: start !important;
  unicode-bidi: plaintext !important;
  border-radius: 30px !important;
  display: flex;
  align-items: center;
  margin-left: 0 !important;
  outline: none !important;
}
#twemoji-textarea-outer {
  border-radius: 30px !important;
  div {
    margin-top: 3px;
  }
}
#btn-emoji-default {
  margin: 0 !important;
}

.hooper-track {
  padding: 0 !important;
}
img {
  object-fit: cover;
}
.pre {
  white-space: initial;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: keep-all; /*this stops the word breaking*/
}

#style-8::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

#style-8::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

#style-8::-webkit-scrollbar-thumb {
  background-color: darkgrey;
}
.linespaced {
  line-height: 15px;
}
</style>
