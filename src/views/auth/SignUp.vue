<template>
  <v-container fill-height fluid>
    <div class="page">
      <v-row style="width: 100%;" justify="center" align="center">
        <v-col cols="12" md="6">
          <v-stepper v-model="e1">
            <v-stepper-header style="flex-wrap: nowrap !important;">
              <v-stepper-step :complete="e1 > 1" step="1"
                >Choose account type</v-stepper-step
              >
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 2" step="2"
                >Sign up</v-stepper-step
              >
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 3" step="3"
                >Complete info</v-stepper-step
              >
              <v-divider />
              <v-stepper-step step="4">Vertify email</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card>
                  <v-list class="text-center">
                    <v-list-item
                      @click="
                        () => {
                          e1 = 2
                          accountType = 0
                        }
                      "
                    >
                      <v-list-item-content>
                        <v-card class="pa-3">
                          <div class="d-flex flex-column align-center">
                            <img
                              height="200px"
                              width="200px"
                              src="~@/assets/accountTypes/icon_person.svg"
                            />
                            <div
                              style="font-size: 25px;"
                              class="font-weight-bold"
                            >
                              Personal
                            </div>
                          </div>
                        </v-card>
                      </v-list-item-content>
                    </v-list-item>
                    <div class="mt-1 font-weight-bold">
                      OR
                    </div>
                    <v-list-item
                      @click="
                        () => {
                          e1 = 2
                          accountType = 1
                        }
                      "
                    >
                      <v-list-item-content>
                        <v-card class="pa-3">
                          <div class="d-flex flex-column align-center">
                            <img
                              height="200px"
                              width="200px"
                              src="~@/assets/accountTypes/icon_store.svg"
                            />
                            <div
                              style="font-size: 25px;"
                              class="font-weight-bold"
                            >
                              Create a vape store
                            </div>
                            <div class="text-justify mt-5">
                              <span class="font-weight-bold"
                                >Start your business now!</span
                              >
                              <br />
                              Create a free online vape store within a large
                              community of vapors around the world on Wikivapeia
                              and save your time, effort and money. You will
                              have many features like Adding products, prices,
                              and get feedback from users And they can visit
                              your website, facebook page, or contact with you
                              through facebook messenger
                            </div>
                          </div>
                        </v-card>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-stepper-content>
              <v-stepper-content step="2">
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

              <v-stepper-content step="3" class="pa-0">
                <div v-if="e1 === 3">
                  <CompleteInfo
                    @vertify="vertifyEmail"
                    v-if="accountType === 0"
                  />
                  <StoreInfo @vertify="vertifyEmail" v-else />
                </div>
              </v-stepper-content>

              <v-stepper-content step="4">
                <v-card v-if="e1 === 4" width="100%" height="100%">
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
      personalDis: false,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    if (this.$route.query.accType) {
      this.accountType = this.$route.query.accType
      this.personalDis = true
    }
  },
  methods: {
    vertifyEmail(email) {
      this.email = email
      this.e1 = 4
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
          this.e1 = 3
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
          this.e1 = 3
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
