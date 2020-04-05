<template>
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
        <div class="text-center font-weight-bold mb-5" style="font-size: 25px;">
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
        <v-btn class="blue darken-4 white--text mt-5" width="100%">
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
</template>

<script>
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
    }
  },
  async created() {
    this.l_show = this.show
    let data = await fetch('https://geolocation-db.com/json/')
    console.log(await data.json())
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
