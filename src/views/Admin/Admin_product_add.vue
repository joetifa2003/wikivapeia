<template>
  <v-container fill-height fluid class="justify-center">
    <Progress :progressDialog="progressDialog" msg="Adding product" />
    <v-row class="justify-center">
      <v-col cols="12" md="10" lg="8">
        <v-card width="100%" elevation="20" class="pa-12">
          <v-form v-model="valid" ref="formRef">
            <v-col>
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="6">
                      <v-carousel
                        style="width: 200px;"
                        height="100"
                        cycle
                        hide-delimiter-background
                        hide-delimiters
                        show-arrows-on-hover
                      >
                        <v-carousel-item
                          v-for="(image, i) in productImagesPreview"
                          :key="i"
                        >
                          <v-img
                            contain
                            width="100%"
                            height="100%"
                            :src="image"
                          >
                            <div
                              style="width: 100%; height: 100%;"
                              class="d-flex align-end justify-center"
                            >
                              <v-btn
                                text
                                @click="productPhotos.splice(i, 1)"
                                class="white--text"
                                >X</v-btn
                              >
                            </div>
                          </v-img>
                        </v-carousel-item>
                      </v-carousel>
                      <div>Product images</div>
                      <input
                        style="width: 108px;"
                        type="file"
                        multiple
                        @change="productPhotoChange"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-carousel
                        style="width: 200px;"
                        height="100"
                        cycle
                        hide-delimiter-background
                        show-arrows-on-hover
                      >
                        <v-carousel-item
                          v-for="(image, i) in facebookImagesPreview"
                          :key="i"
                        >
                          <v-img
                            contain
                            width="100%"
                            height="100%"
                            :src="image"
                          />
                        </v-carousel-item>
                      </v-carousel>
                      <div>Facebook image</div>
                      <input
                        style="width: 108px;"
                        type="file"
                        multiple
                        @change="facebookBannerChange"
                      />
                    </v-col>
                  </v-row>
                  <v-combobox
                    @input="productChange"
                    :items="['Mod', 'Atomizer']"
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
                    <v-row>
                      <v-col
                        v-for="spec in atomizerSpecs"
                        :key="spec.id"
                        cols="6"
                      >
                        <v-combobox
                          v-if="spec.isCombo"
                          :items="spec.values"
                          :label="spec.name"
                          v-model="spec.value"
                        />
                        <v-text-field
                          v-else
                          :label="spec.name"
                          v-model="spec.value"
                        />
                      </v-col>
                    </v-row>
                  </div>
                  <div v-if="selectedProduct === 'Mod'">
                    <v-row>
                      <v-col v-for="spec in modSpecs" :key="spec.id" cols="6">
                        <v-combobox
                          v-if="spec.isCombo"
                          :items="spec.values"
                          :label="spec.name"
                          v-model="spec.value"
                        />
                        <v-text-field
                          v-else
                          :label="spec.name"
                          v-model="spec.value"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="12">
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
      featureList: [],
      selectedProduct: '',
      selectedFeatures: [],
      progressDialog: false,
      txtCompany: '',
      txtModel: '',
      txtDesc: '',
      valid: false,
      productPhotos: [],
      facebookBanner: [],
      modSpecs: [],
      atomizerSpecs: [],
      productImagesPreview: [],
      facebookImagesPreview: [],
    }
  },
  async created() {
    this.companies = orderBy(this.companies)
  },
  firestore() {
    return {
      modSpecs: fb.db.collection('ModSpecs').orderBy('index'),
      atomizerSpecs: fb.db.collection('AtomizerSpecs').orderBy('index'),
    }
  },
  watch: {
    productPhotos: {
      handler() {
        this.productImagesPreview = [
          ...this.productPhotos.map((v) => URL.createObjectURL(v.image)),
        ]
      },
    },
    facebookBanner: {
      handler() {
        this.facebookImagesPreview = [
          ...this.facebookBanner.map((v) => URL.createObjectURL(v.image)),
        ]
      },
    },
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
          'Top airflow',
          'Bottom airflow',
          'Single',
          'Dual',
          'Triple',
        ]
      }
    },
    productPhotoChange(event) {
      let files = event.target.files
      for (let file of files) {
        this.productPhotos.push({ image: file, type: 'product' })
      }
    },
    facebookBannerChange() {
      this.facebookBanner = []
      let files = event.target.files
      for (let file of files) {
        this.facebookBanner.push({ image: file, type: 'facebook' })
      }
    },
    async addProduct() {
      var imageUrls = []
      this.progressDialog = true
      if (this.productPhotos.length === 0) {
        await Swal.fire('Image is required', '', 'warning')
        return
      }
      try {
        let files = [...this.facebookBanner, ...this.productPhotos]
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          var fileCompressed = await imageCompression(file.image, {
            maxSizeMB: 1,
            useWebWorker: true,
            onProgress: () => {},
          })
          const filename = uuid() + '.' + file.image.name.split('.').pop()
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
            type: file.type,
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
            specs: this.atomizerSpecs,
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
            specs: this.modSpecs,
            lastScore: 0,
          })
        }
        this.$refs.formRef.reset()
        this.specs.Atomizer.map((v) => (v.value = 'N/A'))
        this.specs.Mod.map((v) => (v.value = 'N/A'))
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
