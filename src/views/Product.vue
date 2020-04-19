<template>
  <v-container
    fill-height
    fluid
    class="align-start pa-2 justify-center pt-5 full"
  >
    <v-row class="justify-center" style="width: 100%;">
      <v-col cols="12" md="10" lg="7">
        <v-card v-if="product" width="100%" elevation="0">
          <vue-headful
            :title="`WIKIVAPEIA - ${facebookTitle} ranking`"
            :image="
              product.images.filter((v) => v.type === 'facebook')[0].image
            "
          />
          <v-col>
            <v-row>
              <v-col cols="12" md="6" class="d-flex align-start flex-column">
                <v-carousel
                  interval="4000"
                  height="400"
                  cycle
                  hide-delimiter-background
                  show-arrows-on-hover
                >
                  <v-carousel-item v-for="(image, i) in images" :key="i">
                    <v-img
                      contain
                      width="100%"
                      height="100%"
                      :src="image.image"
                    />
                  </v-carousel-item>
                </v-carousel>
                <v-subheader
                  class="font-weight-bold pa-0"
                  style="font-size: 18px;"
                  >Share
                </v-subheader>
                <v-col class="pa-0 mb-5">
                  <v-divider />
                </v-col>
                <social-sharing
                  :url="'wikivapeia.com' + $route.path"
                  hashtags="Wikivapeia"
                  network-tag="span"
                  inline-template
                >
                  <div
                    class="d-flex justify-space-around"
                    style="width: 150px;"
                  >
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
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col>
                    <h1 class="font-weight-medium" style="font-size: 25px;">
                      {{ title }}
                    </h1>
                    <div
                      class="pa-0 font-weight-medium grey--text lighten-2"
                      style="font-size: 15px;"
                    >
                      {{ product.company.toUpperCase() }}
                    </div>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-end align-end pr-0">
                    <div
                      style="height: 85px; width: 85px;"
                      class="grey darken-2 white--text avgScore"
                    >
                      <div
                        class="white--text font-weight-bold text-center"
                        style="font-size: 40px;"
                      >
                        {{ overall.toFixed(1) }}
                      </div>
                      <div class="text-center" style="letter-spacing: 2px;">
                        Score
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <v-divider />
                <div class="mt-2 mb-5">
                  <v-chip
                    v-for="(feature, i) in product.features"
                    :key="i"
                    class="mr-2 mt-2 font-weight-bold"
                    >{{ feature }}</v-chip
                  >
                </div>
                <v-col cols="12" class="pa-0">
                  <v-row v-for="(avg, i) in avgVotes" :key="i">
                    <v-col class="pa-2">
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
                    </v-col>
                  </v-row>
                </v-col>
                <v-row>
                  <v-col class="pa-0">
                    <v-hover v-slot:default="{ hover }">
                      <div style="width: 1px;">
                        <v-btn
                          v-if="voted !== null && !hover"
                          @click.stop="voteClick"
                          :class="[
                            'white--text mt-3 ml-2',
                            voted ? 'grey darken-2' : 'red darken-4',
                          ]"
                          >{{ voted ? 'Unvote' : 'Vote now' }}</v-btn
                        >
                        <v-btn
                          v-if="voted !== null && hover"
                          @click.stop="voteClick"
                          :class="['white--text mt-3', 'red darken-4']"
                          >{{ voted ? 'Unvote' : 'Vote now' }}</v-btn
                        >
                      </div>
                    </v-hover>
                  </v-col>
                  <v-col class="d-flex justify-end">
                    <v-icon color="black" class="mr-2">person</v-icon>
                    <v-chip
                      class="font-weight-medium red darken-4 white--text mr-n2"
                    >
                      {{ voteSum ? voteSum.votersCount : 0 }} Voted</v-chip
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="8" class="">
                <v-subheader
                  class="font-weight-bold pa-0"
                  style="font-size: 18px;"
                  >Description</v-subheader
                >
                <v-divider />
                <p
                  v-if="descReadMore"
                  v-html="product.desc"
                  class="mt-8 justify-desc font-weight-medium"
                ></p>
                <p
                  v-else
                  v-html="
                    product.desc.split(' ').slice(0, 50).join(' ') + '....'
                  "
                  class="mt-8 justify-desc font-weight-medium"
                ></p>
                <div class="d-flex justify-end">
                  <v-btn
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
              </v-col>
              <v-col>
                <v-subheader
                  class="font-weight-bold pa-0"
                  style="font-size: 18px;"
                  >Specifications</v-subheader
                >
                <v-divider />
                <v-row v-for="(spec, i) in specs" :key="i">
                  <v-col>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">{{ spec.icon }}</v-icon>
                      <div class="font-weight-bold primary--text">
                        {{ spec.name }}
                      </div>
                    </div>
                  </v-col>
                  <v-col>
                    <div class="d-flex flex-row justify-end">
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
                      <div v-if="typeof spec.value === 'string'" class="ml-0">
                        {{ spec.unit }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
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
          <div v-if="product.type === 'Atomizer'">
            <v-row v-for="(rank, i) in ranks.atomizers" :key="i">
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
          <div v-if="product.type === 'Mod'">
            <v-row v-for="(rank, i) in ranks.mods" :key="i">
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
const util = require('../utils/utlity.js')

const fb = require('../firebaseConfig')

export default {
  name: 'Product',
  props: ['id'],
  data() {
    return {
      descReadMore: false,
      productID: this.id,
      product: null,
      voteDialog: false,
      signUp: false,
      ranks: {
        mods: [
          { name: 'Fire speed', value: 0 },
          { name: 'Design', value: 0 },
          { name: 'Material', value: 0 },
          { name: 'Software', value: 0 },
          { name: 'Charging speed', value: 0 },
        ],
        atomizers: [],
      },
      voted: null,
      votedQ: null,
      avgVotes: null,
      overall: 0,
      voteSum: null,
      voteIsclicked: false,
    }
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
    ...mapState(['user']),
    images() {
      return this.product.images.filter((v) => v.type === 'product')
    },
    specs() {
      return sortBy(this.product.specs, 'index')
    },
    title() {
      return util.titleBuilder(this.product, false)
    },
    facebookTitle() {
      return util.titleBuilder(this.product, true)
    },
  },
  firestore() {
    return {
      product: fb.db.collection('Products').doc(this.productID),
      voteSum: fb.db.collection('VoteSum').doc(this.productID),
    }
  },
  watch: {
    product: {
      async handler() {
        if (this.avgVotes === null) {
          if (this.product.type === 'Atomizer') {
            if (
              this.product.specs.filter((v) => v.name === 'Category')[0]
                .value === 'DL'
            ) {
              this.ranks.atomizers.push(
                { name: 'Flavor', value: 0 },
                { name: 'Cloud production', value: 0 },
                { name: 'Ease of Build', value: 0 },
                { name: 'Air flow', value: 0 },
                { name: 'Thraot hit', value: 0 },
                { name: 'Material', value: 0 },
                { name: 'Design', value: 0 },
              )
            } else {
              this.ranks.atomizers.push(
                { name: 'Flavor', value: 0 },
                { name: 'Ease of Build', value: 0 },
                { name: 'Air flow', value: 0 },
                { name: 'Thraot hit', value: 0 },
                { name: 'Material', value: 0 },
                { name: 'Design', value: 0 },
              )
            }
            this.avgVotes = cloneDeep(this.ranks.atomizers)
          } else if (this.product.type === 'Mod') {
            this.avgVotes = cloneDeep(this.ranks.mods)
          }
        }
      },
    },
    voteSum: {
      async handler(voteSum) {
        if (voteSum) {
          this.overall = 0
          if (this.product.type === 'Atomizer') {
            this.avgVotes = cloneDeep(this.ranks.atomizers)
          } else if (this.product.type === 'Mod') {
            this.avgVotes = cloneDeep(this.ranks.mods)
          }
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
  },
  methods: {
    signUpDialog() {
      this.signUp = !this.signUp
    },
    async vote() {
      this.voteIsclicked = true
      if (this.product.type === 'Atomizer') {
        await fb.db.collection('Votes').add({
          productID: this.productID,
          voter: this.user.uid,
          votes: this.ranks.atomizers,
        })
      } else if (this.product.type === 'Mod') {
        await fb.db.collection('Votes').add({
          productID: this.productID,
          voter: this.user.uid,
          votes: this.ranks.mods,
        })
      }
      var totalRank = []
      if (this.product.type === 'Atomizer') {
        totalRank = cloneDeep(this.ranks.atomizers)
      } else if (this.product.type === 'Mod') {
        totalRank = cloneDeep(this.ranks.mods)
      }
      if (this.voteSum) {
        //eslint-disable-next-line no-unused-vars
        for (const [i, rank] of totalRank.entries()) {
          totalRank[i].value += this.voteSum.sum[i].value
        }
        await fb.db
          .collection('VoteSum')
          .doc(this.productID)
          .set({
            sum: totalRank,
            votersCount: this.voteSum.votersCount + 1,
          })
      } else {
        await fb.db.collection('VoteSum').doc(this.productID).set({
          sum: totalRank,
          votersCount: 1,
        })
      }
      await fb.db.collection('Products').doc(this.productID).update({
        lastScore: this.overall,
      })
      this.voteDialog = false
      this.voteIsclicked = false
      Swal.fire('Voted!', 'Voted successfully!!', 'success')
    },
    async voteClick() {
      if (this.user) {
        if (this.voted === false) {
          this.voteDialog = true
        } else {
          if (this.voteSum.votersCount === 1) {
            await fb.db.collection('VoteSum').doc(this.productID).delete()
            await fb.db.collection('Votes').doc(this.votedQ[0].id).delete()
          } else {
            for (let i = 0; i < this.votedQ[0].votes.length; i++) {
              let votedValue = this.votedQ[0].votes[i].value
              this.voteSum.sum[i].value -= votedValue
            }
            await fb.db
              .collection('VoteSum')
              .doc(this.productID)
              .set({
                sum: this.voteSum.sum,
                votersCount: this.voteSum.votersCount - 1,
              })
            await fb.db.collection('Votes').doc(this.votedQ[0].id).delete()
          }
        }
      } else {
        this.$router.push('/signUp')
      }
    },
  },
}
</script>

<style scoped>
.justify-desc {
  text-align: justify;
}
.avgScore {
  border-radius: 15px;
}
</style>
