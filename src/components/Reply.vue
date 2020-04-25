<template>
  <v-container class="pa-0">
    <div class="d-flex flex-row align-center wrapperr" style="width: 100%;">
      <v-col class="pa-0">
        <VEmojiPicker v-show="emojiTrigger" @select="addEmoji" />
        <div
          v-if="commentUtil.replyTo !== ''"
          class="d-flex flex-row align-center"
        >
          <v-chip>to {{ commentUtil.replyTo }}</v-chip>
          <v-btn icon @click="$emit('clear', true)">
            <v-icon>close</v-icon>
          </v-btn>
        </div>
        <div class="d-flex flex-row align-center">
          <v-textarea
            v-if="$vuetify.breakpoint.smAndDown"
            ref="textfield"
            v-model="txt"
            :value="txt"
            solo
            clearable
            rounded
            hide-details
            placeholder="Write a reply"
            rows="1"
            dense
            auto-grow
          >
            <template slot="append">
              <font-awesome-icon
                @click="emojiTrigger = !emojiTrigger"
                style="width: 25px; height: 25px;"
                :icon="['far', 'laugh']"
                class="trigger mt-n1 mr-n3"
              />
            </template>
          </v-textarea>
          <v-textarea
            v-else
            ref="textfield"
            v-model="txt"
            :value="txt"
            solo
            clearable
            rounded
            hide-details
            placeholder="Write a reply"
            rows="1"
            dense
            auto-grow
            @keydown.enter.exact="sendReply"
          >
            <template slot="append">
              <font-awesome-icon
                @click="emojiTrigger = !emojiTrigger"
                style="width: 25px; height: 25px;"
                :icon="['far', 'laugh']"
                class="trigger mt-n1 mr-n3"
              />
            </template>
          </v-textarea>
          <v-btn
            @click="sendReply"
            fab
            width="40"
            height="40"
            class="blue white--text ml-2"
            :disabled="btnDisable"
          >
            <v-icon size="22" class="ml-1">send</v-icon>
          </v-btn>
        </div>
      </v-col>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import insertAtCursor from 'insert-text-at-cursor'
const fb = require('../firebaseConfig')
import VEmojiPicker from 'v-emoji-picker'

export default {
  name: 'Reply',
  props: ['comment', 'commentUtil'],
  components: {
    VEmojiPicker,
  },
  data() {
    return {
      emojiTrigger: false,
      btnDisable: true,
      txt: '',
    }
  },
  computed: {
    ...mapState(['user', 'userInfo']),
  },
  methods: {
    addEmoji(emoji) {
      insertAtCursor(this.$refs.textfield.$refs.input, emoji.data)
    },
    async sendReply(event) {
      if (event.preventDefault) event.preventDefault()
      if (this.txt !== '') {
        this.commentIsPressed = true
        fb.db
          .collection('Comments')
          .doc(this.comment.id)
          .update({
            replies: [
              ...this.comment.replies,
              {
                userID: this.user.uid,
                commentID: this.comment.id,
                name: this.userInfo.name,
                value: this.txt,
                replyTo: this.commentUtil.replyTo,
                quote: this.commentUtil.quote,
                date: new Date(),
              },
            ],
          })
        this.txt = ''
        this.$emit('clear', true)
        this.commentIsPressed = false
      } else {
        this.txt = ''
      }
    },
  },
  watch: {
    txt: {
      handler(txt) {
        if (txt === '') {
          this.btnDisable = true
        } else {
          this.btnDisable = false
        }
      },
    },
    commentUtil: {
      deep: true,
      handler() {
        this.$refs.textfield.focus()
      },
    },
  },
}
</script>

<style>
.wrapperr {
  position: relative;
}
#EmojiPicker {
  position: absolute;
  bottom: 100%;
  right: 50px;
}
.trigger {
  user-select: none;
  cursor: pointer;
}
input {
  white-space: initial;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
