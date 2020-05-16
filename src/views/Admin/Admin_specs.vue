<template>
  <v-container fluid fill-height>
    <div class="page">
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="pa-10" width="100%">
            <v-combobox
              :items="['Mods', 'Atomizers', 'Pod systems', 'E-Liquid']"
              v-model="product"
              label="Product"
            />
            <v-form ref="formRef">
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
                <v-col
                  class="d-flex align-center"
                  v-if="fieldType === 'Combobox'"
                >
                  <v-combobox
                    label="Multi"
                    :items="['Yes', 'No']"
                    v-model="multi"
                  />
                </v-col>
                <v-col class="d-flex align-center">
                  <v-combobox
                    label="Unit"
                    :items="['g', 'mm', 'mAH']"
                    v-model="unit"
                  />
                </v-col>
              </v-row>
              <v-combobox
                v-if="fieldType === 'Combobox'"
                v-model="values"
                chips
                multiple
                label="Items"
              />
            </v-form>
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
                  <v-btn
                    @click="deleteSpec(spec.id)"
                    class="red white--text mt-4"
                    >Delete</v-btn
                  >
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
      podSpecs: [],
      product: '',
      fieldType: '',
      specName: '',
      unit: '',
      sortedArray: [],
      values: [],
      multi: false,
      liquidSpecs: [],
    }
  },
  firestore() {
    return {
      modSpecs: fb.db.collection('ModSpecs').orderBy('index'),
      atomizerSpecs: fb.db.collection('AtomizerSpecs').orderBy('index'),
      podSpecs: fb.db.collection('PodSpecs').orderBy('index'),
      liquidSpecs: fb.db.collection('LiquidSpecs').orderBy('index'),
    }
  },
  computed: {
    specs() {
      switch (this.product) {
        case 'Mods':
          return this.modSpecs
        case 'Atomizers':
          return this.atomizerSpecs
        case 'Pod systems':
          return this.podSpecs
        case 'E-Liquid':
          return this.liquidSpecs
        default:
          return []
      }
    },
    currentCollection() {
      switch (this.product) {
        case 'Mods':
          return 'ModSpecs'
        case 'Atomizers':
          return 'AtomizerSpecs'
        case 'Pod systems':
          return 'PodSpecs'
        case 'E-Liquid':
          return 'LiquidSpecs'
        default:
          return null
      }
    },
    lastSpecIndex() {
      return this.specs.length === 0
        ? -1
        : this.specs[this.specs.length - 1].index
    },
  },
  methods: {
    async addSpec() {
      await fb.db.collection(this.currentCollection).add({
        index: this.lastSpecIndex + 1,
        isCombo: this.fieldType === 'Combobox',
        name: this.specName,
        unit: this.unit ? this.unit : '',
        value: '',
        values: this.values,
        multi: this.multi === 'Yes',
      })
      this.$refs.formRef.reset()
    },
    // eslint-disable-next-line no-unused-vars
    async reIndex(index, upDown) {
      if (index !== 0) {
        let array = this.specs
        if (upDown === 'up') {
          array[index].index += -1
          array[index - 1].index += 1
          Object.assign(array[index], { indexChanged: true })
          Object.assign(array[index - 1], { indexChanged: true })
        } else {
          array[index].index += 1
          array[index + 1].index += -1
          Object.assign(array[index], { indexChanged: true })
          Object.assign(array[index + 1], { indexChanged: true })
        }
        array = sortBy(array, 'index')
        for (let i = 0; i < array.length; i++) {
          array[i].index = i
        }
        if (this.product === 'Mods') {
          this.modSpecs = array
        } else if (this.product === 'ِAtomizer') {
          this.atomizerSpecs = array
        } else if (this.product === 'Pod system') {
          this.podSpecs = array
        } else {
          this.liquidSpecs = array
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
    async deleteSpec(specID) {
      if (this.currentCollection == null) return

      const res = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })
      if (res.value) {
        fb.db.collection(this.currentCollection).doc(specID).delete()
      }
    },
  },
}
</script>

<style></style>
