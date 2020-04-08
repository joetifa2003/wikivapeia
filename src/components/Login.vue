<template>
  <v-dialog
    @input="$emit('closing', 'yes')"
    v-model="l_show"
    width="400px"
    indeterminate
  >
    <v-card width="100%">
      <v-col>
        <div class="d-flex justify-center align-center">
          <div style="width: 100px; height: 100px;">
            <v-img
              src="~@/assets/WikivapeiaLogoBlackNoBg.svg"
              aspect-ratio="1"
            ></v-img>
          </div>
        </div>
        <div class="text-center font-weight-bold mb-5" style="font-size: 25px;">
          Login into wikivapeia !
        </div>
        <v-form>
          <v-text-field
            v-model="txtEmail"
            outlined
            label="Email"
            type="email"
          />
          <v-text-field
            v-model="txtPassword"
            outlined
            label="Password"
            type="password"
          />
        </v-form>
        <v-btn @click.stop="login" class="primary white--text" width="100%"
          >Login</v-btn
        >
        <v-btn
          @click.stop="facebook"
          class="blue darken-4 white--text mt-5"
          width="100%"
        >
          <font-awesome-icon
            :icon="['fab', 'facebook-f']"
            size="2x"
            class="mr-3"
          />
          Login with facebook
        </v-btn>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from 'firebase/app'
const fb = require('../firebaseConfig')
import SecureLS from 'secure-ls'
var ls = new SecureLS({ encodingType: 'aes' })
import Swal from 'sweetalert2'

export default {
  name: 'Sign_Up',
  props: ['show'],
  data() {
    return {
      l_show: false,
      txtEmail: '',
      txtPassword: '',
    }
  },
  watch: {
    show: {
      handler(show) {
        this.l_show = show
      },
    },
  },
  methods: {
    async login() {
      ls.set('first', false)
      try {
        await fb.auth.signInWithEmailAndPassword(
          this.txtEmail,
          this.txtPassword,
        )
        await Swal.fire('Logged in !', '', 'success')
        this.l_show = false
      } catch (error) {
        await Swal.fire('Error', error.message, 'error')
        this.l_show = false
      }
    },

    async facebook() {
      var facebook = new firebase.auth.FacebookAuthProvider()
      let result = await firebase.auth().signInWithPopup(facebook)
      this.newUser = result.additionalUserInfo.isNewUser

      if (this.newUser) {
        await Swal.fire("You don't have an account", '', 'error')
        result.user.delete()
        this.l_show = false
      } else {
        await Swal.fire('Logged in !', '', 'success')
        this.l_show = false
      }
    },
  },
}
</script>

<style></style>
