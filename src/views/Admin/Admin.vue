<template>
  <v-container fill-height fluid class="justify-center">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-8" elevation="20">
          <v-row>
            <v-col>
              <v-btn
                width="100%"
                class="primary white--text"
                @click.stop="$router.push('/admin/product/add')"
                >Add product</v-btn
              >
              <v-btn
                width="100%"
                class="primary white--text mt-5"
                @click.stop="$router.push('/admin/product/manage')"
                >Manage product</v-btn
              >
              <v-btn
                width="100%"
                class="primary white--text mt-5"
                @click.stop="$router.push('/admin/specs')"
                >Manage specs</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                width="100%"
                class="primary white--text"
                @click.stop="$router.push('/admin/banner/add')"
                >Add banner</v-btn
              >
              <v-btn
                width="100%"
                class="primary white--text mt-5"
                @click.stop="$router.push('/admin/banner/manage')"
                >Manage banners</v-btn
              >
              <v-btn
                width="100%"
                class="primary white--text mt-5"
                @click.stop="$router.push('/admin/companies')"
                >Companies</v-btn
              >
            </v-col>
          </v-row>
          <v-btn class="red white--text" @click.stop="logout">Logout</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2'
import SecureLS from 'secure-ls'
var ls = new SecureLS({ encodingType: 'aes' })

export default {
  name: 'Admin',
  data() {
    return {}
  },
  methods: {
    logout() {
      ls.set('isA', false)
      this.$router.push('/admin/login')
      Swal.fire('Logged out!', 'Logged out as admin.', 'success')
    },
  },
}
</script>

<style></style>
