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
                  <v-combobox
                    :rules="[(v) => !!v || 'Model is required']"
                    v-model="txtModel"
                    append-icon=""
                    hide-details
                    clearable
                    :items="products"
                    label="Model"
                    item-text="model"
                    item-value="model"
                    class="mb-7"
                  >
                    <template v-slot:item="{ parent, item }">
                      <v-list-item-avatar tile size="70">
                        <v-img
                          :src="
                            item.images.filter((v) => v.type === 'product')[0]
                              .image
                          "
                        />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="
                            parent.genFilteredText(item.model.toUpperCase())
                          "
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-html="item.company.toUpperCase()"
                        ></v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <v-chip
                            v-for="(feature, i) in item.features"
                            :key="i"
                            class="mr-2 mt-2 font-weight-medium"
                            style="font-size: 10px;"
                            >{{ feature }}</v-chip
                          >
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-combobox>
                  <!--- specs -->
                  <div v-if="selectedProduct === 'Atomizer'">
                    <v-row>
                      <v-col
                        v-for="spec in atomizerSpecs"
                        :key="spec.id"
                        cols="6"
                      >
                        <v-combobox
                          v-if="spec.isCombo && spec.multi"
                          :items="spec.values"
                          :label="spec.name"
                          v-model="spec.value"
                          multiple
                        />
                        <v-combobox
                          v-else-if="spec.isCombo"
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
                          v-if="spec.isCombo && spec.multi"
                          :items="spec.values"
                          :label="spec.name"
                          v-model="spec.value"
                          multiple
                        />
                        <v-combobox
                          v-else-if="spec.isCombo"
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
                  <quill-editor v-model="txtDesc" :options="editorOption" />
                  <div class="content ql-editor" v-html="txtDesc"></div>
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
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
        },
      },
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
        'BDvape',
      ],
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
      products: [],
    }
  },
  async created() {
    this.companies = orderBy(this.companies)
  },
  firestore() {
    return {
      modSpecs: fb.db.collection('ModSpecs').orderBy('index'),
      atomizerSpecs: fb.db.collection('AtomizerSpecs').orderBy('index'),
      products: fb.db.collection('Products'),
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
      this.selectedFeatures = []
      if (this.selectedProduct === 'Mod') {
        this.modSpecs
          .filter((v) => v.isFeature === true)
          .forEach((feature) => {
            if (typeof feature.value === 'string') {
              if (feature.value === 'Yes') {
                this.selectedFeatures.push(feature.name)
              } else if (feature.value !== 'No') {
                if (feature.unit) {
                  this.selectedFeatures.push(feature.value + feature.unit)
                } else {
                  this.selectedFeatures.push(feature.value)
                }
              }
            } else {
              if (feature.value.length !== 0) {
                Array.prototype.push.apply(this.selectedFeatures, feature.value)
              }
            }
          })
      } else {
        this.atomizerSpecs
          .filter((v) => v.isFeature === true)
          .forEach((feature) => {
            if (typeof feature.value === 'string') {
              if (feature.value === 'Yes') {
                this.selectedFeatures.push(
                  feature.name + feature.unit ? feature.unit : '',
                )
              } else if (feature.value !== 'No') {
                if (feature.unit) {
                  this.selectedFeatures.push(feature.value + feature.unit)
                } else {
                  this.selectedFeatures.push(feature.value)
                }
              }
            } else {
              if (feature.value.length !== 0) {
                Array.prototype.push.apply(this.selectedFeatures, feature.value)
              }
            }
          })
      }
      this.selectedFeatures = this.selectedFeatures.filter(
        (v) => v !== '' || v !== null,
      )
      var imageUrls = []
      this.productImagesPreview = []
      this.facebookImagesPreview = []
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
            desc: this.txtDesc,
            images: imageUrls,
            features: this.selectedFeatures,
            specs: this.atomizerSpecs.filter((v) => v.value.length !== 0),
            lastScore: 0,
          })
        } else if (this.selectedProduct === 'Mod') {
          await fb.db.collection('Products').add({
            type: this.selectedProduct,
            company: this.txtCompany,
            model: this.txtModel,
            desc: this.txtDesc,
            images: imageUrls,
            features: this.selectedFeatures,
            specs: this.modSpecs.filter((v) => v.value.length !== 0),
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
