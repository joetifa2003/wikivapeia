<template>
  <v-container fill-height fluid>
    <div class="page">
      <v-row style="width: 100%;" justify="center" align="center">
        <v-col cols="12" md="6">
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1"
                >Sign up</v-stepper-step
              >

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2"
                >Complete info</v-stepper-step
              >

              <v-divider></v-divider>

              <v-stepper-step step="3">Vertify email</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
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
                        <v-radio-group
                          v-model="accountType"
                          row
                          class="ma-0 ml-3"
                        >
                          <v-radio label="Personal" />
                          <div class="d-flex align-center">
                            <v-radio class="ma-0" label="Business" />
                            <v-tooltip
                              content-class="text-justify"
                              fixed
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
                                >Business account gives you additional features.
                                Your company is listed on the product page under
                                "Where to buy" list. And you can create your own
                                virtual store through wikivapeia.com</span
                              >
                            </v-tooltip>
                          </div>
                        </v-radio-group>
                      </div>
                      <v-text-field
                        :rules="[
                          (v) => !!v || 'Email is required',
                          (v) =>
                            (v.split('@').length === 2 && v.includes('.')) ||
                            'Enter a valid email',
                        ]"
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
              </v-stepper-content>

              <v-stepper-content step="2" class="pa-0">
                <div v-if="e1 === 2">
                  <CompleteInfo
                    @vertify="vertifyEmail"
                    v-if="accountType === 0"
                  />
                  <StoreInfo @vertify="vertifyEmail" v-else />
                </div>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card v-if="e1 === 3" width="100%" height="100%">
                  <div class="d-flex justify-center align-center">
                    <div style="width: 80px; height: 80px;">
                      <v-img
                        src="~@/assets/WikivapeiaLogoBlackNoBg.svg"
                        aspect-ratio="1"
                      ></v-img>
                    </div>
                  </div>
                  <h2 class="text-center">
                    Please vertify your email to continue
                  </h2>
                  <p class="text-center ma-0 mt-5">
                    We have sent an email to {{ email }}, Please check your mail
                    !
                  </p>
                </v-card>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
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
import { mapState } from 'vuex'
const fb = require('../../firebaseConfig')

export default {
  name: 'Sign_Up',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    CompleteInfo: () => import('./CompleteInfo'),
    StoreInfo: () => import('./StoreInfo'),
  },
  data() {
    return {
      txtEmail: '',
      txtPassword: '',
      completeInfo: false,
      newUser: false,
      validSignUp: true,
      show1: false,
      accountType: 0,
      e1: 1,
      email: '',
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    vertifyEmail(email) {
      this.email = email
      this.e1 = 3
    },
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
          this.e1 = 2
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
          this.e1 = 2
        } else {
          await Swal.fire('Logged in !', '', 'success')
          this.$router.push('/')
        }
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    },
  },
}
</script>

<style></style>
