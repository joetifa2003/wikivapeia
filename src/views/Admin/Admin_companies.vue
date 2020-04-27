<template>
  <v-container fluid fill-height>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" lg="8">
        <v-card class="pa-5">
          <v-row>
            <v-col cols="9">
              <v-text-field label="Company" v-model="txtCompany" />
            </v-col>
            <v-col class="d-flex align-center">
              <v-btn @click.stop="addCompany" class="primary white--text"
                >Add company</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="company in companies"
              :key="company.id"
              cols="6"
              lg="4"
            >
              <v-card>
                <v-card-title>{{ company }}</v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { sortBy } from 'lodash'
const fb = require('../../firebaseConfig')

export default {
  name: 'Companies',
  data() {
    return {
      txtCompany: '',
      companiesQ: [],
    }
  },
  firestore: {
    companiesQ: fb.db.collection('Companies'),
  },
  computed: {
    companies: {
      set: function () {},
      get: function () {
        return sortBy(this.companiesQ.map((v) => v.name))
      },
    },
  },
  methods: {
    addCompany() {
      fb.db.collection('Companies').add({
        name: this.txtCompany,
      })
      this.txtCompany = ''
    },
  },
}
</script>

<style></style>
