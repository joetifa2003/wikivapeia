<template>
  <v-container fluid fill-height>
    <div class="page">
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="pa-10" width="100%">
            <v-combobox
              :items="['Mods', 'Atomizers']"
              v-model="product"
              label="Product"
            />
            <v-row>
              <v-col class="d-flex align-center">
                <v-text-field v-model="specName" label="Name"></v-text-field>
              </v-col>
              <v-col class="d-flex align-center">
                <v-combobox
                  label="Field type"
                  :items="['Textfield', 'Combobox']"
                  v-model="fieldType"
                />
              </v-col>
              <v-col>
                <v-combobox
                  label="Unit"
                  :items="['g', 'mm', 'mAH']"
                  v-model="unit"
                />
              </v-col>
              <v-col class="d-flex align-center">
                <v-combobox
                  v-if="fieldType === 'Combobox'"
                  v-model="values"
                  chips
                  multiple
                  label="Items"
                />
              </v-col>
            </v-row>
            <v-row class="justify-space-around">
              <v-col>
                <v-btn @click.stop="addSpec" class="primary white--text"
                  >Add</v-btn
                >
              </v-col>
              <v-col class="d-flex align-end">
                <v-btn @click.stop="updateSpec" class="primary white--text"
                  >Update</v-btn
                >
              </v-col>
            </v-row>
            <v-card
              v-for="(spec, i) in specs"
              :key="spec.id"
              class="pa-5 mt-5"
              elevation="6"
            >
              <v-row>
                <v-col class="d-flex align-center">
                  <div>{{ spec.name }}</div>
                </v-col>
                <v-col class="d-flex align-center">
                  <div>
                    <ul>
                      <li v-for="(value, i) in spec.values" :key="i">
                        {{ value }}
                      </li>
                    </ul>
                  </div>
                </v-col>
                <v-col class="d-flex align-center">
                  {{ spec.unit }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn class="red white--text mt-4">Delete</v-btn>
                </v-col>
                <v-col class="d-flex justify-end">
                  <div>
                    <v-btn @click.stop="reIndex(i, 'down')">
                      <v-icon>arrow_downward</v-icon>
                    </v-btn>
                    <v-btn @click.stop="reIndex(i, 'up')">
                      <v-icon>arrow_upward</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { sortBy } from 'lodash'
import Swal from 'sweetalert2'
const fb = require('../../firebaseConfig')
export default {
  name: 'Admin_specs',
  data() {
    return {
      modSpecs: [],
      atomizerSpecs: [],
      product: '',
      fieldType: '',
      specName: '',
      unit: '',
      sortedArray: [],
    }
  },
  firestore() {
    return {
      modSpecs: fb.db.collection('ModSpecs').orderBy('index'),
      atomizerSpecs: fb.db.collection('AtomizerSpecs').orderBy('index'),
    }
  },
  computed: {
    specs() {
      switch (this.product) {
        case 'Mods':
          return this.modSpecs

        case 'Atomizers':
          return this.atomizerSpecs

        default:
          return []
      }
    },
    lastSpec() {
      switch (this.product) {
        case 'Mods':
          return this.modSpecs[this.modSpecs.length - 1]

        case 'Atomizers':
          return this.atomizerSpecs[this.atomizerSpecs.length - 1]

        default:
          return {}
      }
    },
  },
  methods: {
    async addSpec() {
      switch (this.product) {
        case 'Mods':
          await fb.db.collection('ModSpecs').add({
            index: this.lastSpec.index + 1,
            isCombo: this.fieldType === 'Combobox',
            name: this.specName,
            unit: this.unit,
            value: '',
            values: this.values,
          })
          break
        case 'Atomizers':
          await fb.db.collection('AtomizerSpecs').add({
            index: this.lastSpec.index + 1,
            isCombo: this.fieldType === 'Combobox',
            name: this.specName,
            unit: this.unit,
            value: '',
            values: this.values,
          })
          break
      }
    },
    // eslint-disable-next-line no-unused-vars
    async reIndex(index, upDown) {
      if (index !== 0) {
        let array = this.product === 'Mods' ? this.modSpecs : this.atomizerSpecs
        if (upDown === 'up') {
          array[index].index += -1
          array[index - 1].index += 1
        } else {
          array[index].index += 1
          array[index + 1].index += -1
        }
        array = sortBy(array, 'index')
        for (let i = 0; i < array.length; i++) {
          array[i].index = i
        }
        if (this.product === 'Mods') {
          this.modSpecs = array
        } else {
          this.atomizerSpecs = array
        }
      }
    },
    async updateSpec() {
      let array = this.product === 'Mods' ? this.modSpecs : this.atomizerSpecs
      for (const spec of array.filter((v) => v.indexChanged === true)) {
        await fb.db
          .collection(this.product === 'Mods' ? 'ModSpecs' : 'AtomizerSpecs')
          .doc(spec.id)
          .update({ index: spec.index })
      }
      Swal.fire('Updated !', '', 'success')
    },
  },
}
</script>

<style></style>
