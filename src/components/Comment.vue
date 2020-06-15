<template>
  <v-container class="pa-2 px-3">
    <div class="d-flex flex-row align-center wrapperr" style="width: 100%;">
      <!-- <picker
        v-show="emojiTrigger"
        :data="index"
        set="facebook"
        title="Pick your emoji..."
        emoji="point_up"
        @select="addEmoji"
      /> -->
      <VEmojiPicker v-show="emojiTrigger" @select="addEmoji" />
      <v-textarea
        v-if="$vuetify.breakpoint.smAndDown"
        ref="textfield"
        v-model="txt"
        :value="txt"
        solo
        clearable
        rounded
        hide-details
        placeholder="Write a comment"
        rows="1"
        auto-grow
        id="input"
        dense
      >
        <template slot="append">
          <font-awesome-icon
            @click="emojiTrigger = !emojiTrigger"
            style="width: 30px; height: 30px;"
            :icon="['far', 'laugh']"
            class="trigger mt-n1 mr-n3"
          />
        </template>
      </v-textarea>
      <v-textarea
        ref="textfield"
        v-else
        v-model="txt"
        solo
        clearable
        rounded
        hide-details
        placeholder="Write a comment"
        rows="1"
        auto-grow
        @keydown.enter.exact="sendComment"
        dense
      >
        <template slot="append">
          <font-awesome-icon
            @click="emojiTrigger = !emojiTrigger"
            style="width: 30px; height: 30px;"
            :icon="['far', 'laugh']"
            class="trigger mt-n1 mr-n3"
          />
        </template>
      </v-textarea>
      <v-btn
        @click="sendComment"
        fab
        width="40"
        height="40"
        class="blue white--text ml-2"
        :disabled="btnDisable"
      >
        <v-icon size="22" class="ml-1">send</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig')
import VEmojiPicker from 'v-emoji-picker'
import insertAtCursor from 'insert-text-at-cursor'

export default {
  name: 'Comment',
  props: ['productID'],
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
    async sendComment(event) {
      if (event.preventDefault) event.preventDefault()
      if (this.txt !== '') {
        this.commentIsPressed = true
        fb.db.collection('Comments').add({
          userID: this.user.uid,
          productID: this.productID,
          name:
            this.userInfo.type === 'store'
              ? this.userInfo.storeName
              : this.userInfo.name,
          value: this.txt,
          replies: [],
          date: new Date(),
        })
        this.txt = ''
        this.commentIsPressed = false
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
