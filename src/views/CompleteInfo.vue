<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-5 d-flex justify-center flex-column">
          <v-form v-model="valid">
            <v-card-title class="text-center justify-center mb-4"
              >Complete your registeration</v-card-title
            >
            <v-row v-if="user.providerId !== 'facebook.com'">
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
import differenceInYears from 'date-fns/differenceInYears'
import Swal from 'sweetalert2'
const fb = require('../firebaseConfig')
import { codesFull, codes } from '../utils/codes'
import { mapState } from 'vuex'

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
      txtFname: '',
      txtLname: '',
      valid: false,
    }
  },
  async created() {
    let data = await fetch('https://geolocation-db.com/json/')
    this.location = await data.json()
  },
  methods: {
    async uploadUserData() {
      if (this.valid) {
        try {
          if (this.picker === '') {
            await Swal.fire('Birthday is required', '', 'error')
            return
          }
          if (differenceInYears(new Date(), new Date(this.picker)) < 18) {
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
            `Welcome ${this.gender ? 'Mr.' : 'Mrs.'} ${this.txtFname} ${
              this.txtLname
            }`,
            'success',
          )
          this.$router.push('/')
        } catch (error) {
          Swal.fire('Error', error.message, 'error')
        }
      } else {
        await Swal.fire('Complete your form !', '', 'error')
      }
    },
    async cancle() {
      await this.user.delete()
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
