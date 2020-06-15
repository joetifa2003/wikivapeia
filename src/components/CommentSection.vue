<template>
  <v-container fluid>
    <v-subheader class="font-weight-bold pa-0" style="font-size: 18px;"
      >Comments
    </v-subheader>
    <div style="width: 100%; height: 2px;" class="grey lighten-1 mb-5" />
    <div class="grey lighten-3 comment-wrapper">
      <comment :productID="productID" />
    </div>
    <div v-for="comment in getComments" :key="comment.id" class="mt-2">
      <div class="chip grey lighten-4">
        <div class="black--text font-weight-bold" style="font-size: 13px;">
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
            commentsUtil[comment.id].showReplyBox = !commentsUtil[comment.id]
              .showReplyBox
          "
          text
          color="blue"
          small
          >Reply
        </v-btn>
        <div style="font-size: 13px;" class="black--text font-weight-bold">
          {{ comment.getCommentTime }}
        </div>
      </div>
      <div class="ml-7 d-flex flex-column">
        <div
          v-for="(reply, i) in comment.getReplies(
            commentsUtil[comment.id].showReplies,
          )"
          :key="i"
        >
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
            <div class="font-weight-bold mr-3" style="font-size: 13px;">
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
          <div style="font-size: 13px;" class="black--text font-weight-bold">
            <v-btn
              @click.stop="replyToReply(comment, reply)"
              text
              color="blue"
              small
              >Reply
            </v-btn>
            {{ reply.getReplyTime }}
          </div>
        </div>
        <reply
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
      >Load more comments
      <v-icon>keyboard_arrow_down</v-icon>
    </v-btn>
  </v-container>
</template>
<script>
import Comment from '../classes/Comment'
import comment from './Comment'
import reply from './Reply'
import { plainToClass } from 'class-transformer'
import { mapState } from 'vuex'
const fb = require('../firebaseConfig')

export default {
  name: 'CommentSection',
  components: { comment, reply },
  props: ['productIDD'],
  data() {
    return {
      productID: this.productIDD,
      commentsVis: 5,
      commentsQ: [],
      commentsUtil: {},
    }
  },
  firestore() {
    return {
      commentsQ: fb.db
        .collection('Comments')
        .where('productID', '==', this.productID)
        .orderBy('date', 'desc'),
    }
  },
  computed: {
    ...mapState(['user']),
    comments() {
      return plainToClass(
        Comment,
        this.commentsQ.map((v) => ({
          id: v.id,
          ...v,
        })),
      )
    },
    /**
     * @returns {Comment[]}
     */
    getComments() {
      return this.comments.slice(0, this.commentsVis)
    },
  },
  watch: {
    comments: {
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
  },
  methods: {
    clearUtils(comment) {
      this.commentsUtil[comment.id].replyTo = ''
      this.commentsUtil[comment.id].quote = ''
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
input {
  text-align: start;
  unicode-bidi: plaintext;
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

img {
  object-fit: cover;
}
</style>
