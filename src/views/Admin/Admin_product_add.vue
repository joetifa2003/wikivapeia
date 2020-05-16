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
                    :items="['Mod', 'Atomizer', 'Pod system', 'E-Liquid']"
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
                  <v-row>
                    <v-col v-for="spec in specs" :key="spec.id" cols="6">
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
import { sortBy } from 'lodash'
import Swal from 'sweetalert2'
import { orderBy } from 'lodash'
import imageCompression from 'browser-image-compression'
import { v1 as uuid } from 'uuid'
import Product from '../../classes/Product'
import { classToPlain } from 'class-transformer'
const fb = require('../../firebaseConfig.js')

export default {
  name: 'Admin_add',
  components: {
    Progress: () => import('../../components/Progress'),
    quillEditor: async () => {
      let editor = await import('vue-quill-editor')
      return editor.quillEditor
    },
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
      selectedProduct: '',
      progressDialog: false,
      txtCompany: '',
      txtModel: '',
      txtDesc: '',
      valid: false,
      productPhotos: [],
      facebookBanner: [],
      modSpecs: [],
      atomizerSpecs: [],
      podSpecs: [],
      productImagesPreview: [],
      facebookImagesPreview: [],
      products: [],
      companiesQ: [],
      selectedFeatures: [],
      liquidSpecs: [],
    }
  },
  async created() {
    this.companies = orderBy(this.companies)
  },
  firestore() {
    return {
      modSpecs: fb.db.collection('ModSpecs').orderBy('index'),
      atomizerSpecs: fb.db.collection('AtomizerSpecs').orderBy('index'),
      podSpecs: fb.db.collection('PodSpecs').orderBy('index'),
      liquidSpecs: fb.db.collection('LiquidSpecs').orderBy('index'),
      products: fb.db.collection('Products'),
      companiesQ: fb.db.collection('Companies'),
    }
  },
  computed: {
    companies: {
      set: function () {},
      get: function () {
        return sortBy(this.companiesQ.map((v) => v.name))
      },
    },
    specs() {
      if (this.selectedProduct === 'Mod') {
        return this.modSpecs
      } else if (this.selectedProduct === 'Atomizer') {
        return this.atomizerSpecs
      } else if (this.selectedProduct === 'Pod system') {
        return this.podSpecs
      } else if (this.selectedProduct === 'E-Liquid') {
        return this.liquidSpecs
      } else {
        return []
      }
    },
  },
  watch: {
    productPhotos: {
      handler() {
        this.productImagesPreview = this.productPhotos.map((v) =>
          URL.createObjectURL(v.image),
        )
      },
    },
    facebookBanner: {
      handler() {
        this.facebookImagesPreview = this.facebookBanner.map((v) =>
          URL.createObjectURL(v.image),
        )
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
    facebookBannerChange(event) {
      this.facebookBanner = []
      let files = event.target.files
      for (let file of files) {
        this.facebookBanner.push({ image: file, type: 'facebook' })
      }
    },
    async addProduct() {
      if (!this.companies.includes(this.txtCompany)) {
        fb.db.collection('Companies').add({
          name: this.txtCompany,
        })
      }
      if (this.productPhotos.length === 0) {
        await Swal.fire('Image is required', '', 'warning')
        return
      }
      this.progressDialog = true
      this.selectedFeatures = []
      let imageUrls = []
      this.selectedFeatures = Product.getFeatures(this.specs)
      this.selectedFeatures = this.selectedFeatures.filter(function (el) {
        return el != null
      })
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
      console.log(
        classToPlain(
          new Product(
            this.selectedProduct,
            this.txtCompany,
            this.txtModel,
            this.txtDesc,
            imageUrls,
            this.selectedFeatures,
            this.specs
              .filter((v) => v.value.length !== 0)
              .map((v) => ({ name: v.name, value: v.value, unit: v.unit })),
            0,
            true,
            [],
            new Date(),
          ),
        ),
      )
      await fb.db.collection('Products').add(
        classToPlain(
          new Product(
            this.selectedProduct,
            this.txtCompany,
            this.txtModel,
            this.txtDesc,
            imageUrls,
            this.selectedFeatures,
            this.specs
              .filter((v) => v.value.length !== 0)
              .map((v) => ({ name: v.name, value: v.value, unit: v.unit })),
            0,
            true,
            [],
            new Date(),
          ),
        ),
      )
      this.$refs.formRef.reset()

      this.progressDialog = false
      this.productImagesPreview = []
      this.facebookImagesPreview = []
      this.txtDesc = ''
      this.productPhotos = []
      this.facebookBanner = []
      Swal.fire('Added!', 'Product has been added!', 'success')
    },
  },
}
</script>

<style></style>
