<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-5 d-flex justify-center flex-column">
          <v-form v-model="valid">
            <v-card-title class="text-center justify-center mb-4"
              >Complete your registeration</v-card-title
            >
            <div class="d-flex justify-center mb-6">
              <v-btn
                @click="$refs.imageInput.click()"
                width="200"
                height="200"
                icon
              >
                <v-avatar width="200" height="200">
                  <v-img contain width="200" height="200" :src="imgPreview" />
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
            <v-text-field
              :rules="[
                (v) => !!v || 'Store name is required',
                (v) => v.length >= 3 || 'Name cannot be lese than 3 characters',
              ]"
              v-model="txtName"
              outlined
              label="Store name"
              type="text"
            />
            <v-col>
              <v-combobox
                label="Country"
                :items="countries"
                v-model="country_name"
              />
              <div class="">
                <div v-for="(address, i) in addresss" :key="i">
                  <div class="d-flex flex-row align-center">
                    <v-text-field
                      class="ma-0 pa-0"
                      label="Branch address"
                      v-model="addresss[i]"
                    ></v-text-field>
                    <v-btn
                      class="ml-3"
                      icon
                      @click.stop="
                        addresss.length > 1 ? addresss.splice(i, 1) : ''
                      "
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </div>
                </div>
                <div class="d-flex">
                  <v-btn small text color="blue" @click.stop="addresss.push('')"
                    >Add branch</v-btn
                  >
                </div>
              </div>
              <v-divider class="my-7" />
              <v-combobox
                label="Country code"
                :items="codes"
                v-model="selectedCode"
              />
              <div v-for="(number, i) in numbers" :key="i">
                <div class="d-flex flex-row align-center">
                  <v-text-field
                    class="ma-0 pa-0"
                    label="Phone numbers"
                    v-model.number="numbers[i]"
                  ></v-text-field>
                  <v-btn
                    class="ml-3"
                    icon
                    @click.stop="numbers.length > 1 ? numbers.splice(i, 1) : ''"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="d-flex">
                <v-btn small text color="blue" @click.stop="numbers.push('')"
                  >Add number</v-btn
                >
              </div>
            </v-col>
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
    <v-dialog width="700px" v-model="vertifyEmailDialog" persistent>
      <v-card width="100%" height="100%">
        <div class="d-flex justify-center align-center">
          <div style="width: 80px; height: 80px;">
            <v-img
              src="~@/assets/WikivapeiaLogoBlackNoBg.svg"
              aspect-ratio="1"
            ></v-img>
          </div>
        </div>
        <h2 class="text-center">Please vertify your email to continue</h2>
        <p class="text-center ma-0 mt-5">
          We have sent an email to {{ email }}, Please check your mail !
        </p>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { classToPlain } from 'class-transformer'
import Swal from 'sweetalert2'
const fb = require('../../firebaseConfig')
import { codesFull, codes } from '../../utils/codes'
import imageCompression from 'browser-image-compression'
import { mapState } from 'vuex'
import Store from '../../classes/Store'
import { v1 as uuid } from 'uuid'

export default {
  name: 'StoreInfo',
  data() {
    return {
      picker: '',
      numbers: [''],
      addresss: [''],
      gender: '',
      location: {},
      selectedCode: '',
      codes: codes,
      txtName: '',
      valid: false,
      email: '',
      vertifyEmailDialog: false,
      country_name: '',
      img: '',
      imgPreview:
        'https://firebasestorage.googleapis.com/v0/b/wikivapia.appspot.com/o/avatar.svg?alt=media&token=0153969e-33af-4d7a-a2f0-848310a19e06',
    }
  },
  async created() {
    let data = await fetch('https://freegeoip.app/json/')
    this.location = await data.json()
  },
  methods: {
    async fileChange(event) {
      let file = await imageCompression(event.target.files[0], {
        maxSizeMB: 1,
        useWebWorker: true,
        onProgress: () => {},
      })
      const filename = uuid() + '.' + file.name.split('.').pop()
      let snapshot = await fb.st.ref('Users').child(filename).put(file)
      this.img = await snapshot.ref.getDownloadURL()
      this.imgPreview = URL.createObjectURL(file)
    },
    async uploadUserData() {
      if (this.valid) {
        try {
          await fb.db
            .collection('Users')
            .doc(this.user.uid)
            .set(
              classToPlain(
                new Store(
                  'store',
                  this.txtName,
                  this.user.email,
                  this.country_name,
                  this.location.city,
                  this.selectedCode + this.numbers,
                  this.addresss,
                  this.img,
                ),
              ),
            )
          await Swal.fire('Signed Up !', `Welcome ${this.txtName}`, 'success')
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
            this.vertifyEmailDialog = true
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
        this.selectedCode = codesFull.filter(
          (v) => v.name === location.country_name,
        )[0].code
        this.country_name = location.country_name
      },
    },
  },
  computed: {
    ...mapState(['user']),
    countries() {
      return codesFull.map((v) => v.name)
    },
  },
}
</script>

<style></style>
