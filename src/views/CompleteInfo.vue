<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="6" md="8" lg="6">
        <v-card class="pa-5 d-flex justify-center flex-column">
          <v-form>
            <v-card-title class="text-center justify-center mb-4"
              >Complete your registeration</v-card-title
            >
            <v-subheader class="font-weight-medium" style="font-size: 18px;"
              >Birthday</v-subheader
            >
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
                <v-text-field
                  class="mb-5"
                  label="Phone number (optional)"
                  v-model.number="number"
                ></v-text-field>
              </v-col>
            </v-row>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import Swal from 'sweetalert2'
const fb = require('../firebaseConfig')
import { codesFull, codes } from '../utils/codes'
import { mapState } from 'vuex'
import SecureLS from 'secure-ls'
var ls = new SecureLS({ encodingType: 'aes' })

export default {
  name: 'CompleteInfo',
  data() {
    return {
      picker: '',
      number: '',
      gender: '',
      location: {},
      selectedCode: '',
      codes: codes,
      fName: ls.get('f'),
      lName: ls.get('l'),
    }
  },
  async created() {
    let data = await fetch('https://geolocation-db.com/json/')
    this.location = await data.json()
  },
  methods: {
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
            name:
              this.user.providerId === 'facebook.com'
                ? this.user.displayName
                : `${this.fName} ${this.lName}`,
            email: this.user.email,
            country: this.location.country_name,
            city: this.location.city,
            number: `${this.selectedCode}${this.number}`,
            gender: this.gender,
            birthday: this.picker,
          })
        await Swal.fire(
          'Signed Up !',
          `Welcome ${this.gender ? 'Mr.' : 'Mrs.'} ${this.fName} ${this.lName}`,
          'success',
        )
        this.$router.push('/')
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
    location: {
      handler(location) {
        this.selectedCode = codesFull.filter(
          (v) => v.name === location.country_name,
        )[0].code
      },
    },
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<style></style>
