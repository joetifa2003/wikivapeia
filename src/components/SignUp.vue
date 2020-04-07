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
              <v-img src="~@/assets/WikivapeiaLogoBlackNoBg.svg" aspect-ratio="1"></v-img>
            </div>
          </div>
          <div
            class="text-center font-weight-bold mb-5"
            style="font-size: 20px;"
          >Sign up for full features</div>
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
          <v-btn @click.stop="signUp" class="primary white--text" width="100%">Sign Up</v-btn>
          <v-btn class="blue darken-4 white--text mt-5" width="100%" @click="facebookSignUp">
            <font-awesome-icon :icon="['fab', 'facebook-f']" size="2x" class="mr-3" />Sign Up with facebook
          </v-btn>
          <v-btn
            text
            class="grey--text text--darken-2 mt-5"
            width="100%"
            @click="later"
          >Skip for now</v-btn>
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog width="500px" v-model="completeInfo" persistent>
      <v-card class="pa-5 d-flex justify-center flex-column">
        <v-form v-model="valid">
          <v-card-title class="text-center justify-center mb-4">Complete your registeration</v-card-title>
          <v-subheader class="font-weight-medium" style="font-size: 18px;">Birthday</v-subheader>
          <v-divider class="mb-5" />
          <v-date-picker full-width class="mb-5" v-model="picker" />
          <v-combobox
            v-model="gender"
            :rules="[(v) => !!v || 'Gender is requierd']"
            label="Gender"
            :items="['Male', 'Female']"
          />
          <v-row>
            <v-col>
              <v-combobox :items="codes" v-model="selectedCode" />
            </v-col>
            <v-col>
              <v-text-field class="mb-5" label="Phone number (optional)" v-model.number="number"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="justify-space-around">
            <v-btn class="primary white--text" @click.stop="cancle">Cancle</v-btn>
            <v-btn class="primary white--text" @click.stop="uploadUserData">Confirm</v-btn>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { codesFull, codes } from '../utils/codes'
import moment from 'moment'
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
      txtFname: '',
      txtLname: '',
      txtEmail: '',
      txtPassword: '',
      completeInfo: false,
      picker: '',
      number: '',
      user: null,
      gender: '',
      location: {},
      newUser: false,
      facebook: false,
      codes: codes,
      selectedCode: '',
      validSignUp: true,
    }
  },
  async created() {
    this.l_show = this.show
    let data = await fetch('https://geolocation-db.com/json/')
    this.location = await data.json()
  },
  methods: {
    later() {
      this.l_show = false
    },
    async signUp() {
      if (this.validSignUp) {
        try {
          let result = await fb.auth.createUserWithEmailAndPassword(
            this.txtEmail,
            this.txtPassword,
          )
          this.user = result.user
          this.l_show = false
          this.facebook = false
          this.completeInfo = true
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
          this.user = result.user
          this.l_show = false
          this.facebook = true
          this.completeInfo = true
        } else {
          await Swal.fire('Logged in !', '', 'success')
          this.l_show = false
        }
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    },
    async uploadUserData() {
      try {
        if (this.gender === '') {
          await Swal.fire('Gender is required', '', 'error')
          return
        }
        if (this.picker === '') {
          await Swal.fire('Birthday is required', '', 'error')
          return
        }
        if (moment().diff(moment(this.picker), 'years') < 18) {
          await Swal.fire(
            'You are under 18 !',
            'Users under 18 are not allowed',
            'error',
          )
          return
        }
        await fb.db
          .collection('Users')
          .doc(this.user.uid)
          .set({
            name: this.facebook
              ? this.user.displayName
              : `${this.txtFname} ${this.txtLname}`,
            email: this.user.email,
            country: this.location.country_name,
            city: this.location.city,
            number: `${this.selectedCode}${this.number}`,
            gender: this.gender,
            birthday: this.picker,
          })
        await Swal.fire(
          'Signed Up !',
          `Welcome ${this.gender ? 'Mr.' : 'Mrs.'} ${this.user.displayName}`,
          'success',
        )
        this.completeInfo = false
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    },
    async cancle() {
      await this.user.delete()
      this.completeInfo = false
    },
  },
  watch: {
    show: {
      handler(show) {
        this.l_show = show
      },
    },
    location: {
      handler(location) {
        this.selectedCode = codesFull.filter(
          (v) => v.name === location.country_name,
        )[0].code
      },
    },
  },
}
</script>

<style></style>
