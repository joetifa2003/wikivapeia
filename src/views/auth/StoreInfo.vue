<template>
  <div style="width: 100%;" class="d-flex justify-center">
    <v-card class="pa-3 d-flex justify-center flex-column">
      <v-form v-model="valid">
        <h2 class="text-center justify-center mb-4">
          Complete store information
        </h2>
        <div class="d-flex justify-center mb-6">
          <v-btn
            @click="$refs.imageInput.click()"
            width="150px"
            height="150px"
            icon
          >
            <v-avatar width="150" height="150">
              <v-img
                v-if="imagePreview"
                contain
                max-height="150px"
                max-width="150"
                :src="imagePreview"
              />
              <v-img
                v-else
                contain
                max-height="150px"
                max-width="150px"
                src="~@/assets/addlogo.svg"
              />
            </v-avatar>
          </v-btn>
          <input
            style="display: none;"
            ref="imageInput"
            :rules="[(v) => !!v || 'Image is required']"
            type="file"
            @change="fileChange"
          />
        </div>
        <div
          style="width: 100%; font-size: 20px; margin-top: -15px;"
          class="text-center mb-4 font-weight-bold black--text"
        >
          Add your logo
        </div>
        <v-combobox
          v-model="busType"
          outlined
          :rules="[(v) => !!v || 'Business type is required']"
          label="Business type: "
          :items="[
            'Wholeseler',
            'Vape Store',
            'E-liquid production',
            'Service center',
          ]"
          dense
          multiple
        />
        <v-text-field
          :rules="[
            (v) => !!v || 'Store name is required',
            (v) => v.length >= 5 || 'Name cannot be lese than 5 characters',
          ]"
          v-model="txtName"
          outlined
          label="Store name"
          type="text"
          dense
        />
        <v-row>
          <v-col>
            <v-combobox
              prepend-inner-icon="public"
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
          <v-col>
            <v-combobox
              prepend-inner-icon="monetization_on"
              label="Currency"
              outlined
              :items="currencies"
              v-model="selectedCurrency"
              :rules="[
                (v) =>
                  currencies.includes(v) || 'This currency is not available',
              ]"
              dense
            />
          </v-col>
        </v-row>
        <div class="font-weight-bold">Chose your store url address</div>
        <div
          :class="[
            'd-flex',
            $vuetify.breakpoint.xsOnly ? 'flex-column' : 'flex-row',
          ]"
        >
          <div class="mr-3 indigo--text mt-2">www.wikivapeia.com/store/</div>
          <v-text-field
            prepend-inner-icon="link"
            :rules="[
              (v) =>
                usernameIsValid(v) ||
                'Username not valid - minimum 4 characters, maximum 15 characters from a-z 1-9 no symbols expect . - _',
            ]"
            v-model="storeUsername"
            dense
            label="Store username"
            :persistent-hint="true"
            hint="4-15 characters from a-z 1-9 no spaces or symbols expect (.) (-) (_)"
            outlined
          />
        </div>
        <v-text-field
          prepend-inner-icon="language"
          class="mt-6"
          hint="Example: www.wikivapeia.com"
          v-model="webUrl"
          label="Website url"
          outlined
          dense
          :persistent-hint="true"
        />
        <v-text-field
          prepend-inner-icon="emoji_flags"
          :rules="[
            (v) => v.split(' ').length === 1 || `Link mustn't include spaces`,
            (v) => new RegExp(/facebook.com/).test(v) || 'Facebook only',
          ]"
          hint="Example: www.facebook.com/wikivapeia"
          v-model="facebookUrl"
          label="Facebook store page url"
          outlined
          dense
          :persistent-hint="true"
        />
        <v-textarea
          v-model="about"
          label="About store"
          outlined
          counter
          dense
          :persistent-hint="true"
        />
        <div class="mt-3">
          <div v-for="(branch, i) in branches" :key="i">
            <v-card
              style="border: 2px solid grey;"
              class="pa-5 mt-4"
              elevation="5"
            >
              <h3 class="">Branch information</h3>
              <div style="height: 2px;" class="black mb-4" />
              <v-row>
                <v-col class="py-0">
                  <v-combobox
                    label="Region"
                    outlined
                    :items="regions"
                    v-model="branch.region"
                    :rules="[
                      (v) =>
                        regions.includes(v) || 'This region is not available',
                    ]"
                    dense
                  />
                </v-col>
                <v-col cols="12" md="8" class="py-0">
                  <v-text-field
                    :persistent-hint="true"
                    hint="Example: Downtown branch"
                    class="ma-0 pa-0"
                    label="Branch area"
                    v-model="branch.area"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                class="ma-0 pa-0"
                label="Branch address"
                v-model="branch.address"
                outlined
                dense
              ></v-text-field>
              <div v-for="(number, i) in branch.numbers" :key="i">
                <div
                  :class="[
                    'd-flex',
                    $vuetify.breakpoint.xsOnly ? 'flex-column' : 'flex-row',
                  ]"
                >
                  <v-text-field
                    class="ma-0 pa-0"
                    label="Phone number"
                    v-model="number.number"
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                  <div class="d-flex flex-row">
                    <v-checkbox
                      label="Whatsapp number"
                      class="ma-0 mx-3"
                      v-model="number.isWhatsApp"
                      hide-details
                    />
                    <font-awesome-icon
                      v-if="number.isWhatsApp"
                      class="green--text darken-3"
                      :icon="['fab', 'whatsapp-square']"
                      size="2x"
                    />
                    <v-btn
                      class="ml-3"
                      icon
                      @click.stop="
                        branch.numbers.length > 1
                          ? branch.numbers.splice(i, 1)
                          : ''
                      "
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </div>
                </div>
                <v-divider class="mb-4 mt-4" />
              </div>
              <div class="d-flex">
                <v-btn
                  class="white--text"
                  small
                  color="black"
                  @click.stop="
                    branch.numbers.push({ number: '', isWhatsApp: false })
                  "
                  ><v-icon>add</v-icon>Add phone number</v-btn
                >
              </div>
              <v-divider class="my-2" />
              <v-card-actions>
                <v-row justify="center">
                  <v-btn
                    class="white--text"
                    small
                    color="red"
                    @click.stop="
                      branches.length > 1 ? branches.splice(i, 1) : ''
                    "
                  >
                    Delete branch
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </div>
          <div class="d-flex mt-3 mb-5">
            <v-btn
              text
              color="blue"
              @click.stop="
                branches.push({
                  area: '',
                  address: '',
                  region: '',
                  numbers: [{ number: '', isWhatsApp: false }],
                })
              "
              ><v-icon>add</v-icon>Add new branch</v-btn
            >
          </div>
        </div>
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
import { classToPlain } from 'class-transformer'
import Swal from 'sweetalert2'
const fb = require('../../firebaseConfig')
import { codesFull } from '../../utils/codes'
import imageCompression from 'browser-image-compression'
import { mapState } from 'vuex'
import Store from '../../classes/Store'
import { v1 as uuid } from 'uuid'
import { orderBy } from 'lodash'

export default {
  name: 'StoreInfo',
  components: {},
  data() {
    return {
      picker: '',
      branches: [
        {
          area: '',
          address: '',
          region: '',
          numbers: [{ number: '', isWhatsApp: false }],
        },
      ],
      gender: '',
      location: {},
      selectedCode: '',
      txtName: '',
      valid: false,
      email: '',
      selectedCountry: '',
      facebookUrl: '',
      storeUsername: '',
      busType: '',
      allRegions: [],
      allCurrencies: [],
      selectedRegion: '',
      /** @type {File} */
      imgFile: null,
      webUrl: '',
      about: '',
      selectedCurrency: '',
    }
  },
  async created() {
    let regions = await fetch(`${process.env.BASE_URL}regions.json`)
    this.allRegions = await regions.json()
    let currencies = await fetch(`${process.env.BASE_URL}currencies.json`)
    this.allCurrencies = await currencies.json()

    let data = await fetch('https://freegeoip.app/json/')
    this.location = await data.json()
  },
  methods: {
    usernameIsValid(username) {
      return /^[a-z0-9_-]{4,15}$/.test(username)
    },
    async fileChange(event) {
      this.imgFile = await imageCompression(event.target.files[0], {
        maxSizeMB: 1,
        useWebWorker: true,
        onProgress: () => {},
      })
    },
    async uploadUserData() {
      if (this.imgFile === null)
        return Swal.fire('You must provide a logo.', '', 'error')
      try {
        const filename = uuid() + '.' + this.imgFile.name.split('.').pop()
        let snapshot = await fb.st
          .ref('Users')
          .child(filename)
          .put(this.imgFile)
        let imageUrl = await snapshot.ref.getDownloadURL()
        await fb.db
          .collection('Users')
          .doc(this.user.uid)
          .set({
            id: this.user.uid,
            ...Object.assign(
              classToPlain(
                new Store(
                  'store',
                  this.txtName,
                  this.about,
                  this.user.email,
                  this.selectedCountry,
                  this.selectedCurrency,
                  this.location.city,
                  this.selectedCode,
                  orderBy(this.branches, ['region'], ['asc']),
                  imageUrl,
                  [],
                  this.busType,
                  this.storeUsername,
                  this.webUrl,
                  this.facebookUrl,
                  this.facebookPageID,
                ),
              ),
              { revSum: 0, revCount: 0 },
            ),
          })
        await Swal.fire('Signed Up !', `Welcome ${this.txtName}`, 'success')
        if (this.user.providerId != 'facebook.com') {
          if (this.$route.path === '/createStoreAccount') {
            this.$router.push(`/store/${this.userInfo.username}`)
          } else {
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
          }
        } else {
          this.$router.push('/')
        }
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
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
        this.selectedCurrency = this.allCurrencies.find(
          (v) => v.country === this.selectedCountry,
        ).currency_code
      },
    },
  },
  computed: {
    ...mapState(['user', 'userInfo']),
    countries() {
      return codesFull.map((v) => v.name)
    },
    currencies() {
      return this.allCurrencies.map((v) => v.currency_code)
    },
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
    facebookPageID() {
      return this.facebookUrl.split('facebook.com/')[1].replace(/[\\/]/g, '')
    },
    imagePreview() {
      if (this.imgFile) {
        return URL.createObjectURL(this.imgFile)
      } else {
        return null
      }
    },
  },
}
</script>

<style></style>
