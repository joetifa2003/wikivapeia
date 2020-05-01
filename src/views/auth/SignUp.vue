<template>
  <v-container fill-height fluid>
    <div class="page">
      <v-row style="width: 100%;" justify="center" align="center">
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="20" width="100%">
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
                <div class="d-flex">
                  <div class="d-inline">Account type:</div>
                  <v-radio-group v-model="accountType" column class="ma-0 ml-3">
                    <v-radio label="Personal" />
                    <div class="d-flex align-center">
                      <v-radio class="ma-0" label="Business" />
                      <v-tooltip
                        content-class="text-justify"
                        fixed
                        v-model="show"
                        right
                        max-width="200"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            class="ml-3"
                            width="20px"
                            height="20px"
                            icon
                            v-on="on"
                          >
                            <font-awesome-icon
                              icon="info-circle"
                              style="height: 20px; width: 20px;"
                              class="mr-3"
                            />
                          </v-btn>
                        </template>
                        <span
                          >Business account gives you additional features. Your
                          company is listed on the product page under "Where to
                          buy" list. And you can create your own virtual store
                          through wikivapeia.com</span
                        >
                      </v-tooltip>
                    </div>
                  </v-radio-group>
                </div>
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
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :type="show1 ? 'text' : 'password'"
                  label="Password"
                  outlined
                  @click:append="show1 = !show1"
                />
              </v-form>
              <v-btn
                @click.stop="signUp"
                class="primary white--text"
                width="100%"
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
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import firebase from 'firebase/app'
import 'firebase/auth'
import Swal from 'sweetalert2'
const fb = require('../../firebaseConfig')

export default {
  name: 'Sign_Up',
  data() {
    return {
      txtEmail: '',
      txtPassword: '',
      completeInfo: false,
      newUser: false,
      validSignUp: true,
      show1: false,
      accountType: 0,
    }
  },
  methods: {
    later() {
      this.l_show = false
      this.$emit('closing', 'yes')
    },
    async signUp() {
      if (this.validSignUp) {
        try {
          await fb.auth.createUserWithEmailAndPassword(
            this.txtEmail,
            this.txtPassword,
          )
          if (this.accountType === 0) {
            this.$router.push('/completeInfo')
          } else {
            this.$router.push('/storeInfo')
          }
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            await Swal.fire('Email already signed up', error.message, 'warning')
          } else {
            await Swal.fire('Sign up failed', error.message, 'error')
          }
        }
      } else {
        await Swal.fire('Complete your form !', '', 'error')
      }
    },
    async facebookSignUp() {
      try {
        var facebook = new firebase.auth.FacebookAuthProvider()
        let result = await firebase.auth().signInWithPopup(facebook)
        this.newUser = result.additionalUserInfo.isNewUser

        if (this.newUser) {
          if (this.accountType === 0) {
            this.$router.push('/completeInfo')
          } else {
            this.$router.push('/storeInfo')
          }
        } else {
          await Swal.fire('Logged in !', '', 'success')
        }
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    },
  },
}
</script>

<style></style>
