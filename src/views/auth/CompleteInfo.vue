<template>
  <div>
    <v-card class="pa-5 d-flex justify-center flex-column">
      <v-form v-model="valid">
        <v-card-title class="text-center justify-center mb-4"
          >Complete your info</v-card-title
        >
        <v-row v-if="user && user.providerId !== 'facebook.com'">
          <v-col>
            <v-text-field
              :rules="[
                (v) => !!v || 'Frist name is required',
                (v) => v.length >= 3 || 'Name cannot be lese than 3 characters',
              ]"
              v-model="txtFname"
              outlined
              label="First name"
              type="text"
              dense
            />
          </v-col>
          <v-col>
            <v-text-field
              :rules="[
                (v) => !!v || 'Last name is required',
                (v) => v.length >= 3 || 'Name cannot be lese than 3 characters',
              ]"
              v-model="txtLname"
              outlined
              label="Last name"
              type="text"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-combobox
              label="Country"
              outlined
              :items="countries"
              v-model="selectedCountry"
              :rules="[
                (v) => countries.includes(v) || 'This country is not available',
              ]"
              dense
            />
          </v-col>
          <v-col class="py-0">
            <v-combobox
              label="Region"
              outlined
              :items="regions"
              v-model="selectedRegion"
              :rules="[
                (v) => regions.includes(v) || 'This region is not available',
              ]"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox
              v-model="gender"
              :rules="[(v) => !!v || 'Gender is requierd']"
              label="Gender"
              :items="['Male', 'Female']"
              dense
              outlined
            />
          </v-col>
          <v-col>
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="picker"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="picker"
                  label="Birthdate"
                  prepend-inner-icon="event"
                  readonly
                  v-on="on"
                  outlined
                  dense
                  append-icon=""
                ></v-text-field>
              </template>
              <v-date-picker v-model="picker" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="$refs.dialog.save(picker)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <v-text-field
          class="mb-5"
          label="Phone number (optional)"
          v-model.number="number"
          dense
          outlined
        ></v-text-field>
        <v-row class="justify-space-around">
          <v-btn class="primary white--text" @click.stop="cancle">Cancle</v-btn>
          <v-btn
            :disabled="!valid"
            class="primary white--text"
            @click.stop="uploadUserData"
            >Confirm</v-btn
          >
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import differenceInYears from 'date-fns/differenceInYears'
import Swal from 'sweetalert2'
const fb = require('../../firebaseConfig')
import { codesFull } from '../../utils/codes'
import { mapState } from 'vuex'
import Personal from '../../classes/Personal'
import { classToPlain } from 'class-transformer'

export default {
  name: 'CompleteInfo',
  data() {
    return {
      picker: '',
      number: '',
      gender: '',
      location: {},
      selectedCode: '',
      codes: codesFull.map((v) => v.code),
      txtFname: '',
      txtLname: '',
      valid: false,
      email: '',
      vertifyEmailDialog: false,
      selectedCountry: '',
      selectedRegion: '',
      allRegions: [],
      menu: false,
      modal: false,
    }
  },
  async created() {
    let regions = await fetch(`${process.env.BASE_URL}regions.json`)
    this.allRegions = await regions.json()

    let data = await fetch('https://freegeoip.app/json/')
    this.location = await data.json()
    this.selectedCountry = location.country_name
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
            .set(
              classToPlain(
                new Personal(
                  'personal',
                  this.user.providerId === 'facebook.com'
                    ? this.user.displayName
                    : `${this.txtFname} ${this.txtLname}`,
                  this.user.email,
                  this.selectedCountry,
                  this.selectedRegion,
                  `${this.selectedCode}${this.number}`,
                  this.gender,
                  this.picker,
                ),
              ),
            )
          await Swal.fire(
            'Signed Up !',
            `Welcome ${this.gender ? 'Mr.' : 'Mrs.'} ${this.txtFname} ${
              this.txtLname
            }`,
            'success',
          )
          if (this.user.providerId != 'facebook.com') {
            this.user
              .sendEmailVerification({
                url: process.env.VUE_APP_SIGNUP_REDIRECT,
              })
              .then(
                async () => {},
                async (err) => {
                  console.log(err)
                  await this.user.delete()
                },
              )
            this.email = this.user.email
            this.$emit('vertify', this.email)
          } else {
            this.$router.push('/')
          }
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
        this.selectedCountry = location.country_name
      },
    },
    selectedCountry: {
      handler() {
        this.selectedCode = codesFull.filter(
          (v) => v.name === this.selectedCountry,
        )[0].code
      },
    },
  },
  computed: {
    ...mapState(['user']),
    regions() {
      var regionsForCountry = this.allRegions.filter(
        (v) => v.countryName === this.selectedCountry,
      )[0]
      if (regionsForCountry) {
        return regionsForCountry.regions.map((v) => v.name)
      } else {
        return []
      }
    },
    countries() {
      return codesFull.map((v) => v.name)
    },
  },
}
</script>

<style></style>
