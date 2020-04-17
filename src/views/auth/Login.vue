<template>
  <v-container fill-height fluid>
    <div class="page">
      <v-row style="width: 100%;" justify="center" align="center">
        <v-col cols="12" md="6" lg="4">
          <v-card width="100%">
            <v-col>
              <div class="d-flex justify-center align-center">
                <div style="width: 80px; height: 80px;">
                  <v-img
                    src="~@/assets/WikivapeiaLogoBlackNoBg.svg"
                    aspect-ratio="1"
                  ></v-img>
                </div>
              </div>
              <div
                class="text-center font-weight-bold mb-5"
                style="font-size: 25px;"
              >
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
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :type="show1 ? 'text' : 'password'"
                  label="Password"
                  outlined
                  @click:append="show1 = !show1"
                />
              </v-form>
              <v-btn
                @click.stop="login"
                class="primary white--text"
                width="100%"
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
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
const fb = require('../../firebaseConfig')
import Swal from 'sweetalert2'

export default {
  name: 'Sign_Up',
  data() {
    return {
      txtEmail: '',
      txtPassword: '',
      show1: false,
    }
  },
  methods: {
    async login() {
      try {
        await fb.auth.signInWithEmailAndPassword(
          this.txtEmail,
          this.txtPassword,
        )
        await Swal.fire('Logged in !', '', 'success')
        this.$router.push('/')
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          await Swal.fire('Wrong password', error.message, 'warning')
        } else {
          await Swal.fire('Login failed', error.message, 'warning')
        }
      }
    },

    async facebook() {
      var facebook = new firebase.auth.FacebookAuthProvider()
      let result = await firebase.auth().signInWithPopup(facebook)
      this.newUser = result.additionalUserInfo.isNewUser

      if (this.newUser) {
        await Swal.fire("You don't have an account", '', 'error')
        result.user.delete()
      } else {
        await Swal.fire('Logged in !', '', 'success')
      }
    },
  },
}
</script>

<style></style>
