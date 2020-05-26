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
                  <v-btn class="black white--text" @click="addImages = true"
                    >Add images</v-btn
                  >
                  <v-row>
                    <v-col>
                      <v-combobox
                        :items="[
                          'Mod',
                          'Starter kit',
                          'Atomizer',
                          'Pod system',
                          'E-Liquid',
                          'Coils & Cartridges',
                          'Batteries & Chargers',
                          'Vape accessories',
                        ]"
                        :rules="[(v) => !!v || 'Product type is required']"
                        clearable
                        label="Select product type"
                        v-model="selectedProduct"
                      />
                    </v-col>
                    <v-col>
                      <v-combobox
                        :disabled="
                          !(
                            typeSubTypes[selectedProduct] &&
                            typeSubTypes[selectedProduct].length > 0
                          )
                        "
                        :items="typeSubTypes[selectedProduct]"
                        :rules="[(v) => !!v || 'Product type is required']"
                        clearable
                        label="Select product sub type"
                        v-model="selectedSubType"
                      />
                    </v-col>
                  </v-row>
                  <v-combobox
                    :items="companies"
                    :rules="getRules()"
                    label="Company"
                    v-model="txtCompany"
                  />
                  <v-text-field
                    :rules="[(v) => !!v || 'Model is required']"
                    v-model="txtModel"
                    clearable
                    label="Model"
                    item-text="model"
                    item-value="model"
                    class="mb-7"
                  />
                  <!--- specs -->
                  <v-row>
                    <v-col v-for="spec in specs" :key="spec.id" cols="6">
                      <v-combobox
                        v-if="spec.isCombo && spec.multi && spec.chips"
                        :label="spec.name"
                        v-model="spec.value"
                        multiple
                        chips
                        deletable-chips
                      />
                      <v-combobox
                        v-else-if="spec.isCombo && spec.multi"
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
    <v-dialog
      :width="$vuetify.breakpoint.mdAndUp ? '20%' : '100%'"
      v-model="addImages"
      persistent
    >
      <v-card class="pa-5">
        <v-btn
          @click="$refs.bannerInput.click()"
          class="black white--text mb-3"
          style="width: 100%;"
          ><v-icon>add</v-icon>Add product photo</v-btn
        >
        <input
          style="display: none;"
          ref="bannerInput"
          type="file"
          accept="image/jpeg"
          @change="productPhotoChange"
          multiple
        />
        <v-card v-for="(product, i) in productPhotos" :key="i" class="my-2">
          <v-img
            contain
            :src="getImageUrl(product.image)"
            width="auto"
            height="144px"
          >
            <div
              v-if="product.type === 'facebook'"
              class="white pa-0"
              style="max-width: 30px; max-height: 30px;"
            >
              <font-awesome-icon
                style="width: 30px; height: 30px;"
                class="indigo--text"
                :icon="['fab', 'facebook-square']"
              />
            </div>
          </v-img>
          <div class="d-flex flex-row justify-space-between align-center">
            <v-btn
              style="text-transform: none !important;"
              text
              :disabled="product.type === 'facebook'"
              color="indigo"
              @click="makeFBImage(i)"
              ><v-icon>share</v-icon> Sharing image</v-btn
            >
            <v-btn @click="productPhotos.splice(i, 1)" text color="grey" icon
              ><v-icon>delete</v-icon></v-btn
            >
            <div class="d-flex flex-row">
              <v-btn small icon @click.stop="reIndex(i, 'down')">
                <v-icon>arrow_downward</v-icon>
              </v-btn>
              <v-btn small icon @click.stop="reIndex(i, 'up')">
                <v-icon>arrow_upward</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
        <v-btn
          @click="addImages = false"
          class="black white--text mt-3"
          style="width: 100%;"
          ><v-icon>exit_to_app</v-icon>Exit</v-btn
        >
      </v-card>
    </v-dialog>
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
      selectedSubType: '',
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
      typeSubTypes: {
        Mod: [],
        'Starter kit': [],
        Atomizer: [],
        'Pod system': [],
        'E-Liquid': [],
        'Coils & Cartridges': [
          'Wires',
          'Prebuilt coils',
          'Replacement coils',
          'RBA coils',
          'Cartridges',
        ],
        'Batteries & Chargers': ['Batteries', 'Chargers'],
        'Vape accessories': [
          'Cotton',
          'Drip tips',
          'Glass tube',
          'Silicon cases',
          'Bottles',
          'Adaptors',
          'Tools',
          'Other',
        ],
      },
      addImages: false,
    }
  },
  async created() {
    this.companies = orderBy(this.companies)
  },
  watch: {
    selectedProduct: {
      handler() {
        this.selectedSubType = ''
      },
    },
  },
  firestore() {
    return {
      modSpecs: fb.db.collection('ModSpecs').orderBy('index'),
      atomizerSpecs: fb.db.collection('AtomizerSpecs').orderBy('index'),
      podSpecs: fb.db.collection('PodSpecs').orderBy('index'),
      liquidSpecs: fb.db.collection('LiquidSpecs').orderBy('index'),
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
  methods: {
    makeFBImage(index) {
      for (let i = 0; i < this.productPhotos.length; i++) {
        this.productPhotos[i].type = 'product'
      }
      this.productPhotos[index].type = 'facebook'
    },
    getImageUrl(image) {
      return URL.createObjectURL(image)
    },
    getRules() {
      if (
        [
          'Atomizer',
          'Mod',
          'Pod system',
          'E-Liquid',
          'Coils & Cartridges',
          'Batteries & Chargers',
        ].includes(this.selectedProduct)
      ) {
        return [(v) => !!v || 'Company is required']
      } else {
        return []
      }
    },
    reIndex(index, upDown) {
      if (this.productPhotos.length === 0 && upDown === 'up') return
      if (this.productPhotos.length === index + 1 && upDown === 'down') return
      if (index === 0 && upDown === 'up') return
      if (upDown === 'up') {
        let tmp = this.productPhotos[index - 1]
        this.productPhotos[index - 1] = this.productPhotos[index]
        this.productPhotos[index] = tmp
      } else {
        let tmp = this.productPhotos[index + 1]
        this.productPhotos[index + 1] = this.productPhotos[index]
        this.productPhotos[index] = tmp
      }
      this.$forceUpdate()
    },
    productPhotoChange(event) {
      let files = event.target.files
      for (let file of files) {
        this.productPhotos.push({ image: file, type: 'product' })
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
      let files = this.productPhotos
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
      await fb.db.collection('Products').add(
        Object.assign(
          classToPlain(
            new Product(
              this.selectedProduct,
              this.selectedSubType,
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
              new Date(),
            ),
          ),
          { modelSRC: this.txtModel.toLowerCase() },
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
