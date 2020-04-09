<template>
  <v-container fluid>
    <v-dialog
      @input="$emit('closing', 'yes')"
      v-model="l_show"
      width="460px"
      indeterminate
      persistent
    >
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
            style="font-size: 20px;"
          >
            Sign up for full features
          </div>
          <v-form v-model="validSignUp">
            <v-row>
              <v-col>
                <v-text-field
                  :rules="[
                    (v) => !!v || 'Frist name is required',
                    (v) =>
                      v.length >= 3 || 'Name cannot be lese than 3 characters',
                  ]"
                  v-model="txtFname"
                  outlined
                  label="First name"
                  type="text"
                />
              </v-col>
              <v-col>
                <v-text-field
                  :rules="[
                    (v) => !!v || 'Last name is required',
                    (v) =>
                      v.length >= 3 || 'Name cannot be lese than 3 characters',
                  ]"
                  v-model="txtLname"
                  outlined
                  label="Last name"
                  type="text"
                />
              </v-col>
            </v-row>
            <v-text-field
              :rules="[(v) => !!v || 'Email is required']"
              v-model="txtEmail"
              outlined
              label="Email"
              type="email"
            />
            <v-text-field
              :rules="[(v) => !!v || 'Password is required']"
              v-model="txtPassword"
              outlined
              label="Password"
              type="password"
            />
          </v-form>
          <v-btn @click.stop="signUp" class="primary white--text" width="100%"
            >Sign Up</v-btn
          >
          <v-btn
            class="blue darken-4 white--text mt-5"
            width="100%"
            @click="facebookSignUp"
          >
            <font-awesome-icon
              :icon="['fab', 'facebook-f']"
              size="2x"
              class="mr-3"
            />Sign Up with facebook
          </v-btn>
          <v-btn
            text
            class="grey--text text--darken-2 mt-5"
            width="100%"
            @click="later"
            >Skip for now</v-btn
          >
        </v-col>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import firebase from 'firebase/app'
import 'firebase/auth'
import Swal from 'sweetalert2'
const fb = require('../firebaseConfig')
import SecureLS from 'secure-ls'
var ls = new SecureLS({ encodingType: 'aes' })

export default {
  name: 'Sign_Up',
  props: ['show'],
  data() {
    return {
      l_show: false,
      txtFname: '',
      txtLname: '',
      txtEmail: '',
      txtPassword: '',
      completeInfo: false,
      newUser: false,
      validSignUp: true,
    }
  },
  async created() {
    this.l_show = this.show
  },
  methods: {
    later() {
      this.l_show = false
    },
    async signUp() {
      if (this.validSignUp) {
        try {
          await fb.auth.createUserWithEmailAndPassword(
            this.txtEmail,
            this.txtPassword,
          )
          ls.set('f', this.txtFname)
          ls.set('l', this.txtLname)
          fb.auth.currentUser
            .sendEmailVerification({
              url: process.env.VUE_APP_SIGNUP_REDIRECT,
            })
            .then(
              () => {
                this.l_show = false
              },
              async (err) => {
                console.log(err)
              },
            )
        } catch (error) {
          await Swal.fire('Error', error.message, 'error')
        }
      } else {
        await Swal.fire('Complete your form', '', 'error')
      }
    },
    async facebookSignUp() {
      try {
        var facebook = new firebase.auth.FacebookAuthProvider()
        let result = await firebase.auth().signInWithPopup(facebook)
        this.newUser = result.additionalUserInfo.isNewUser

        if (this.newUser) {
          this.l_show = false
          this.$router.push('/completeInfo')
        } else {
          await Swal.fire('Logged in !', '', 'success')
          this.l_show = false
        }
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    },
  },
  watch: {
    show: {
      handler(show) {
        this.l_show = show
      },
    },
  },
}
</script>

<style></style>
