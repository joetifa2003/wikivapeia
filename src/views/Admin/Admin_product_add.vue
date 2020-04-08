<template>
  <v-container fill-height fluid class="justify-center">
    <Progress :progressDialog="progressDialog" msg="Adding product" />
    <v-row class="justify-center">
      <v-col cols="12" md="10" lg="8">
        <v-card width="100%" elevation="20" class="pa-12">
          <v-form v-model="valid" ref="formRef">
            <v-col>
              <v-row>
                <v-col cols="12" md="6">
                  <input
                    :rules="[(v) => !!v || 'Image is required']"
                    type="file"
                    multiple
                    @change="fileChange"
                  />
                  <v-combobox
                    @input="productChange"
                    :items="productList"
                    :rules="[(v) => !!v || 'Product type is required']"
                    clearable
                    label="Select product type"
                    v-model="selectedProduct"
                  />
                  <v-combobox
                    :items="companies"
                    :rules="[(v) => !!v || 'Company is required']"
                    label="Company"
                    v-model="txtCompany"
                  />
                  <v-text-field
                    :rules="[(v) => !!v || 'Model is required']"
                    label="Model"
                    v-model="txtModel"
                  />
                  <v-combobox
                    :items="featureList"
                    :rules="[(v) => !!v || 'Feature is required']"
                    clearable
                    multiple
                    class="multiple"
                    small-chips
                    label="Select features"
                    v-model="selectedFeatures"
                  />
                  <!--- specs -->
                  <div v-if="selectedProduct === 'Atomizer'">
                    <v-text-field
                      v-model="specs.Atomizer[0].value"
                      label="Capacity up to"
                      :rules="[
                        (v) =>
                          !!v || v === 'N/A' || 'Please enter value or N/A',
                      ]"
                    />
                    <v-text-field
                      v-model="specs.Atomizer[1].value"
                      label="Base Diameter"
                      :rules="[
                        (v) =>
                          !!v || v === 'N/A' || 'Please enter value or N/A',
                      ]"
                    />
                    <v-combobox
                      v-model="specs.Atomizer[2].value"
                      label="Coil type"
                      :rules="[(v) => !!v || 'Coil type is required']"
                      clearable
                      :items="['Mesh', 'Wire']"
                    />
                    <v-combobox
                      v-model="specs.Atomizer[3].value"
                      label="Drip tip size"
                      :rules="[(v) => !!v || 'Dript tip size is required']"
                      clearable
                      :items="['510', '810', 'Multi']"
                    />
                  </div>
                  <div v-if="selectedProduct === 'Mod'">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="specs.Mod[0].value"
                          :label="specs.Mod[0].name"
                          :rules="[
                            (v) =>
                              !!v || v === 'N/A' || 'Please enter value or N/A',
                          ]"
                        />
                        <v-combobox
                          v-model="specs.Mod[1].value"
                          :label="specs.Mod[1].name"
                          clearable
                          :items="['Builtin', 'External']"
                          :rules="[
                            (v) => !!v || `${specs.Mod[3].name} is required`,
                          ]"
                        />
                        <v-text-field
                          v-model="specs.Mod[2].value"
                          :label="specs.Mod[2].name"
                          :rules="[
                            (v) =>
                              !!v || v === 'N/A' || 'Please enter value or N/A',
                          ]"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-combobox
                          v-model="specs.Mod[3].value"
                          :label="specs.Mod[3].name"
                          clearable
                          :items="['Yes', 'No']"
                          :rules="[(v) => !!v || 'Fast charge is required']"
                        />
                        <v-combobox
                          v-model="specs.Mod[4].value"
                          :label="specs.Mod[4].name"
                          clearable
                          :items="['Yes', 'No']"
                          :rules="[(v) => !!v || 'Touch screen is required']"
                        />
                        <v-text-field
                          v-model="specs.Mod[5].value"
                          :label="specs.Mod[5].name"
                          :rules="[
                            (v) =>
                              !!v || v === 'N/A' || 'Please enter value or N/A',
                          ]"
                        />
                        <v-text-field
                          v-model="specs.Mod[6].value"
                          :label="specs.Mod[6].name"
                          :rules="[
                            (v) =>
                              !!v || v === 'N/A' || 'Please enter value or N/A',
                          ]"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    label="Descreption"
                    class="mt-12"
                    v-model="txtDesc"
                    :rules="[
                      (v) => !!v || v === 'N/A' || 'Please enter value or N/A',
                    ]"
                  />
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                :class="[!valid ? 'v-btn--disabled' : '']"
                @click="addProduct"
                >Add product</v-btn
              >
            </v-col>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2'
import { orderBy } from 'lodash'
import imageCompression from 'browser-image-compression'
import { v1 as uuid } from 'uuid'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'Admin_add',
  components: {
    Progress: () => import('../../components/Progress'),
  },
  data() {
    return {
      companies: [
        'Vandy vape',
        'Geek vape',
        'Wootofo',
        'Smoke',
        'Voopoo',
        'Vaporesso',
        'Aspire',
        'Eleaf',
        'Sigelei',
        'Wismec',
        'Kaees',
        'DoVopo',
        'AugVape',
        'ExVape',
        'Vapefly',
        'Vapor',
        'Vapes',
        'OBS',
        'Think vape',
        'Rincoe',
        'Steam crave',
        'Hell vape',
        'Fumytech',
        'Kaees',
        'Cthulhu',
        'Damn vape',
        'Ehpro',
        'Uwell',
        'Ofrf',
        'IJoy',
        'Dotmod',
      ],
      productList: ['Mod', 'Atomizer', 'Pod'],
      featureList: [],
      selectedProduct: '',
      selectedFeatures: [],
      files: [],
      progressDialog: false,
      txtCompany: '',
      txtModel: '',
      txtDesc: '',
      specs: {
        Atomizer: [
          { name: 'Capacity up to', icon: 'opacity', value: 'N/A', unit: 'mm' },
          { name: 'Diameter', icon: '360', value: 'N/A', unit: 'mm' },
          { name: 'Coil type', icon: 'broken_image', value: 'N/A', unit: '' },
          {
            name: 'Drip tip size',
            icon: 'filter_tilt_shift',
            value: 'N/A',
            unit: '',
          },
        ],
        Mod: [
          {
            name: 'Power output',
            icon: 'speed',
            value: 'N/A',
            unit: 'mah',
          },
          {
            name: 'Power supply',
            icon: 'battery_unknown',
            value: 'N/A',
            unit: '',
          },
          {
            name: 'Power capacity',
            icon: 'battery_charging_full',
            value: 'N/A',
            unit: 'mah',
          },
          {
            name: 'Fast charge',
            icon: 'offline_bolt',
            value: 'N/A',
            unit: '',
          },
          { name: 'Touch screen', icon: 'touch_app', value: 'N/A', unit: '' },
          {
            name: 'Weight (without battery)',
            icon: 'fitness_center',
            value: 'N/A',
            unit: 'g',
          },
          { name: 'Dimention', icon: 'zoom_out_map', value: 'N/A', unit: 'mm' },
        ],
      },
      valid: false,
    }
  },
  async created() {
    this.companies = orderBy(this.companies)
  },
  methods: {
    productChange(v) {
      this.selectedFeatures = []
      if (v === 'Mod') {
        this.featureList = ['Box', 'Squonk', 'Mechanical', 'Regulated']
      } else if (v === 'Atomizer') {
        this.featureList = [
          'DL',
          'MTL',
          'RTA',
          'RDA',
          'RDTA',
          'Sub ohm',
          'Top airflow',
          'Bottom airflow',
          'Single',
          'Dual',
          'Triple',
        ]
      }
    },
    fileChange(event) {
      this.files = event.target.files
    },
    async addProduct() {
      var imageUrls = []
      this.progressDialog = true
      try {
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i]
          var fileCompressed = await imageCompression(file, {
            maxSizeMB: 1,
            useWebWorker: true,
            onProgress: () => {},
          })
          const filename = uuid() + '.' + file.name.split('.').pop()
          const snapshot = await fb.st
            .ref()
            .child('Products')
            .child(this.selectedProduct + 's')
            .child('images')
            .child(filename)
            .put(fileCompressed)
          const downloadURL = await snapshot.ref.getDownloadURL()
          imageUrls.push({
            index: i,
            image: downloadURL,
            imageName: filename,
          })
        }
        if (this.selectedProduct === 'Atomizer') {
          await fb.db.collection('Products').add({
            type: this.selectedProduct,
            company: this.txtCompany,
            model: this.txtModel,
            desc: this.txtDesc.replace(/\n/g, '<br>'),
            images: imageUrls,
            features: this.selectedFeatures,
            specs: this.specs.Atomizer,
            lastScore: 0,
          })
        } else if (this.selectedProduct === 'Mod') {
          await fb.db.collection('Products').add({
            type: this.selectedProduct,
            company: this.txtCompany,
            model: this.txtModel,
            desc: this.txtDesc.replace(/\n/g, '<br>'),
            images: imageUrls,
            features: this.selectedFeatures,
            specs: this.specs.Mod,
            lastScore: 0,
          })
        }
        this.$refs.formRef.reset()
      } catch (error) {
        console.log(error)
        this.progressDialog = false
      }
      this.progressDialog = false
      Swal.fire('Added!', 'Product has been added!', 'success')
    },
  },
}
</script>

<style></style>
