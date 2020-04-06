<template>
  <v-container fluid>
    <v-dialog
      @input="$emit('closing', 'yes')"
      v-model="l_show"
      width="460px"
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
          <div
            class="text-center font-weight-bold mb-5"
            style="font-size: 25px;"
          >
            Sign up for full features
          </div>
          <v-form>
            <v-row>
              <v-col>
                <v-text-field outlined label="First name" type="text" />
              </v-col>
              <v-col>
                <v-text-field outlined label="Last name" type="text" />
              </v-col>
            </v-row>
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
            />
            Sign Up with facebook
          </v-btn>
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog width="500px" v-model="completeInfo" persistent>
      <v-card class="pa-5 d-flex justify-center flex-column">
        <v-form>
          <v-card-title class="text-center justify-center mb-4"
            >Complete your registeration</v-card-title
          >
          <v-subheader class="font-weight-medium" style="font-size: 18px;"
            >Birthday</v-subheader
          >
          <v-divider class="mb-5" />
          <v-date-picker
            full-width
            class="mb-5"
            type="month"
            v-model="picker"
          />
          <v-combobox
            v-model="gender"
            :rules="[(v) => !!v || 'Gender is requierd']"
            label="Gender"
            :items="['Male', 'Female']"
          />
          <v-text-field
            class="mb-5"
            label="Phone number (optional)"
            v-model="number"
          ></v-text-field>
          <v-row class="justify-space-around">
            <v-btn class="primary white--text" @click.stop="cancle"
              >Cancle</v-btn
            >
            <v-btn class="primary white--text" @click.stop="uploadUserData"
              >Confirm</v-btn
            >
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
const fb = require('../firebaseConfig')
import Swal from 'sweetalert2'

export default {
  name: 'Sign_Up',
  props: ['show'],
  data() {
    return {
      l_show: false,
      txtEmail: '',
      txtPassword: '',
      completeInfo: false,
      picker: '',
      number: '',
      user: null,
      gender: '',
      location: {},
      newUser: false,
    }
  },
  async created() {
    this.l_show = this.show
    let data = await fetch('https://geolocation-db.com/json/')
    this.location = await data.json()
  },
  methods: {
    async signUp() {
      try {
        await fb.auth.createUserWithEmailAndPassword(
          this.txtEmail,
          this.txtPassword,
        )
        Swal.fire('Signed Up !', '', 'success')
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    },
    async facebookSignUp() {
      try {
        var facebook = new firebase.auth.FacebookAuthProvider()
        let result = await firebase.auth().signInWithPopup(facebook)
        this.newUser = result.additionalUserInfo.isNewUser

        if (this.newUser) {
          this.user = result.user
          this.show = false
          this.completeInfo = true
        } else {
          this.show = false
          Swal.fire('Logged in !', '', 'success')
        }
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    },
    async uploadUserData() {
      try {
        await fb.db.collection('Users').doc(this.user.uid).set({
          name: this.user.displayName,
          email: this.user.email,
          country: this.location.country_name,
          city: this.location.city,
          number: this.number,
          gender: this.gender,
        })
        this.completeInfo = false
        Swal.fire(
          'Signed Up !',
          `Welcome ${this.gender ? 'Mr.' : 'Mrs.'} ${this.user.displayName}`,
          'success',
        )
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    },
    async cancle() {
      await this.user.delete()
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
