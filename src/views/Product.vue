<template>
  <v-container
    fill-height
    fluid
    class="align-start pa-2 justify-center pt-5 full"
  >
    <v-row class="justify-center" style="width: 100%;">
      <v-col cols="12" lg="7">
        <v-card v-if="product" width="100%" elevation="0">
          <vue-headful
            :title="`WIKIVAPEIA - ${facebookTitle.toUpperCase()} RANKING`"
            :image="
              product.images.filter((v) => v.type === 'facebook')[0].image
            "
          />
          <v-col>
            <v-row>
              <v-col cols="12" md="6">
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
                          :class="['white--text mt-3 ml-2', 'red darken-4']"
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
            <v-subheader class="font-weight-bold pa-0" style="font-size: 18px;"
              >Share
            </v-subheader>
            <v-col cols="6" class="pa-0 mb-5">
              <v-divider />
            </v-col>
            <social-sharing
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
            <v-row>
              <v-col cols="12" md="8" class="">
                <v-subheader
                  class="font-weight-bold pa-0"
                  style="font-size: 18px;"
                  >Description</v-subheader
                >
                <v-divider />
                <div class="content ql-editor">
                  <div v-if="descReadMore" v-html="product.desc"></div>
                  <div
                    v-else
                    v-html="
                      product.desc.split(' ').slice(0, 50).join(' ') + '....'
                    "
                  ></div>
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
            <v-col cols="12" md="8" class="pa-0 mt-6">
              <v-subheader
                class="font-weight-bold pa-0"
                style="font-size: 18px;"
                >Comments
              </v-subheader>
              <v-divider class="mb-1" />
              <div class="grey lighten-3 comment-wrapper">
                <Comment :productID="productID" />
              </div>
              <div
                v-for="comment in getComments"
                :key="comment.id"
                class="mt-2"
              >
                <div class="chip grey lighten-4">
                  <div
                    class="black--text font-weight-bold"
                    style="font-size: 13px;"
                  >
                    {{ comment.name }}:
                  </div>
                  <div
                    style="width: 100%; font-size: 15px;"
                    class="rtl text-justify black--text pre-formatted"
                  >
                    {{ comment.value }}
                  </div>
                </div>
                <div class="d-flex align-center">
                  <v-btn
                    @click="
                      commentsUtil[comment.id].showReplyBox = !commentsUtil[
                        comment.id
                      ].showReplyBox
                    "
                    text
                    color="blue"
                    small
                    >Reply</v-btn
                  >
                  <div
                    style="font-size: 13px;"
                    class="black--text font-weight-bold"
                  >
                    {{ getCommentTime(comment.date.toDate()) }}
                  </div>
                </div>
                <div class="ml-7 d-flex flex-column">
                  <div v-for="(reply, i) in getReplies(comment)" :key="i">
                    <v-btn
                      @click.stop="commentsUtil[comment.id].showReplies = true"
                      v-if="
                        !commentsUtil[comment.id].showReplies &&
                        comment.replies.length !== 1
                      "
                      class="d-block text-capitalize"
                      text
                      color="blue"
                      small
                      >View {{ comment.replies.length - 1 }} previous replies...
                      <v-icon>keyboard_arrow_down</v-icon>
                    </v-btn>
                    <div class="chip grey lighten-4">
                      <div
                        class="font-weight-bold mr-3"
                        style="font-size: 13px;"
                      >
                        <div v-if="reply.replyTo === ''">
                          {{ reply.name }}
                        </div>
                        <div v-else class="d-flex overflow-hidden">
                          {{ reply.name }}
                          <div
                            class="blue--text mx-1 font-weight-regular font-italic"
                            style="font-size: 10px;"
                          >
                            To
                          </div>
                          <div
                            class="blue--text font-weight-regular font-italic pr-1"
                            style="font-size: 10px;"
                          >
                            {{ reply.replyTo }}
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="reply.quote !== ''"
                        class="grey lighten-3 grey--text text--darken-2 quote mb-2"
                        style="font-size: 14px;"
                      >
                        {{ `"${reply.quote}"` }}
                      </div>
                      <div class="text-justify pre-formatted">
                        {{ reply.value }}
                      </div>
                    </div>
                    <div
                      style="font-size: 13px;"
                      class="black--text font-weight-bold"
                    >
                      <v-btn
                        @click.stop="replyToReply(comment, reply)"
                        text
                        color="blue"
                        small
                        >Reply</v-btn
                      >
                      {{ getCommentTime(reply.date.toDate()) }}
                    </div>
                  </div>
                  <Reply
                    v-show="commentsUtil[comment.id].showReplyBox"
                    :comment="comment"
                    :commentUtil="commentsUtil[comment.id]"
                    @clear="clearUtils(comment)"
                  />
                </div>
                <v-divider />
              </div>
              <v-btn
                v-if="commentsVis < comments.length"
                @click.stop="commentsVis += commentsPerPage"
                text
                color="blue"
                small
                >Load more comments <v-icon>keyboard_arrow_down</v-icon></v-btn
              >
            </v-col>
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
import differenceInSeconds from 'date-fns/differenceInSeconds'
const fb = require('../firebaseConfig')
const util = require('../utils/utlity.js')
import Comment from '../components/Comment'
import Reply from '../components/Reply'

export default {
  name: 'Product',
  props: ['id'],
  components: {
    Comment,
    Reply,
  },
  data() {
    return {
      comment: '',
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
          { name: 'Value for price', value: 0 },
        ],
        atomizers: [],
      },
      voted: null,
      votedQ: null,
      avgVotes: null,
      overall: 0,
      voteSum: null,
      voteIsclicked: false,
      comments: [],
      commentsUtil: {},
      replies: [],
      commentsPerPage: 5,
      commentsVis: 5,
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
    this.$store.commit('activePage', 'Ranks')
  },
  computed: {
    ...mapState(['user', 'userInfo']),
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
    getComments() {
      return this.comments.slice(0, this.commentsVis)
    },
  },
  firestore() {
    return {
      product: fb.db.collection('Products').doc(this.productID),
      voteSum: fb.db.collection('VoteSum').doc(this.productID),
      comments: fb.db
        .collection('Comments')
        .where('productID', '==', this.productID)
        .orderBy('date', 'desc'),
      replies: fb.db.collection('Replies').orderBy('date', 'asc'),
    }
  },
  watch: {
    comments: {
      immediate: true,
      handler(comments) {
        for (let i = 0; i < comments.length; i++) {
          const comment = comments[i]
          if (!(comment.id in this.commentsUtil)) {
            this.$set(this.commentsUtil, comment.id, {
              replyTo: '',
              showReplies: false,
              showReplyBox: false,
              quote: '',
            })
          }
        }
      },
    },
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
                { name: 'Value for price', value: 0 },
              )
            } else {
              this.ranks.atomizers.push(
                { name: 'Flavor', value: 0 },
                { name: 'Ease of Build', value: 0 },
                { name: 'Air flow', value: 0 },
                { name: 'Thraot hit', value: 0 },
                { name: 'Material', value: 0 },
                { name: 'Design', value: 0 },
                { name: 'Value for price', value: 0 },
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
    clearUtils(comment) {
      this.commentsUtil[comment.id].replyTo = ''
      this.commentsUtil[comment.id].quote = ''
    },
    getReplies(comment) {
      let replies = comment.replies
      if (this.commentsUtil[comment.id].showReplies) {
        return replies
      } else {
        if (replies.length !== 0) {
          return [replies.slice(-1)[0]]
        } else {
          return replies
        }
      }
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
    replyToReply(comment, reply) {
      if (this.user.uid !== reply.userID) {
        this.commentsUtil[comment.id].replyTo = reply.name
        this.commentsUtil[comment.id].quote =
          reply.value.split(' ').slice(0, 10).join(' ') + '...'
      }
      this.commentsUtil[comment.id].showReplyBox = true
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
.rtl {
  text-align: start;
  unicode-bidi: plaintext;
}
.comment-wrapper {
  // border-top-left-radius: 22px;
  // border-top-right-radius: 22px;
  border-radius: 30px;
}
.chip {
  display: inline-block;
  white-space: nowrap;
  border-radius: 20px;
  padding: 8px 10px 8px 10px;
  max-width: 100%;
  white-space: initial;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.pre-formatted {
  white-space: pre-line;
}
.quote {
  border-radius: 15px;
}
</style>
