<template>
  <v-container fluid class="pa-0">
    <!-- <div style="position: fixed; bottom: 10px; right: 10px; z-index: 100;">
      <v-btn small class="red darken-4 white--text">Request new product</v-btn>
    </div> -->
    <Progress :progressDialog="progressDialog" msg="Sending product request" />
    <v-dialog
      v-model="productReuestDialog"
      :width="$vuetify.breakpoint.smAndDown ? '100%' : '50%'"
    >
      <v-card class="pa-5">
        <v-img
          width="100px"
          v-if="productImagesPreview[0]"
          :src="productImagesPreview[0]"
        ></v-img>
        <div>Product image</div>
        <input
          style="width: 100px;"
          type="file"
          accept="image/x-png,image/jpeg"
          @change="productPhotoChange"
        />
        <v-form ref="form">
          <v-combobox
            :items="['Mod', 'Atomizer']"
            :rules="[(v) => !!v || 'Product type is required']"
            clearable
            label="Select product type"
            v-model="selectedProduct"
          />
          <v-combobox
            :disabled="!selectedProduct"
            :items="companies"
            :rules="[(v) => !!v || 'Company is required']"
            label="Company"
            v-model="txtCompany"
          />
          <v-combobox
            :disabled="!txtCompany"
            :rules="[(v) => !!v || 'Product name is required']"
            v-model="txtModel"
            append-icon=""
            hide-details
            clearable
            :items="products"
            label="Product name"
            item-text="model"
            item-value="model"
            class="mb-7"
          >
            <template v-slot:item="{ parent, item }">
              <v-list-item-avatar tile size="70">
                <v-img
                  :src="
                    item.images.filter((v) => v.type === 'product')[0].image
                  "
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-html="parent.genFilteredText(item.model.toUpperCase())"
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
              <v-col v-for="spec in atomizerSpecs" :key="spec.id" cols="6">
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
                <v-text-field v-else :label="spec.name" v-model="spec.value" />
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
                <v-text-field v-else :label="spec.name" v-model="spec.value" />
              </v-col>
            </v-row>
          </div>
        </v-form>
        <v-col cols="12" class="pa-0">
          <v-subheader class="font-weight-bold pa-0" style="font-size: 18px;"
            >Descreption</v-subheader
          >
          <v-divider class="mb-3" />
          <quill-editor v-model="txtDesc" :options="editorOption" />
        </v-col>
        <div class="d-flex justify-end mt-5" style="width: 100%;">
          <v-btn
            @click.stop="sendProductRequest"
            class="red darken-4 white--text"
            >Send request</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
    <div>
      <div class="grey--text text--darken-2" style="font-size: 14px;">
        Couldn't find your proudct ?
      </div>
      <v-btn
        @click.stop="productReuestDialog = true"
        class="red darken-4 white--text"
        style="width: 100%;"
        >Add new product</v-btn
      >
    </div>
  </v-container>
</template>

<script>
import { sortBy } from 'lodash'
import { v1 as uuid } from 'uuid'
import imageCompression from 'browser-image-compression'
import { quillEditor } from 'vue-quill-editor'
const fb = require('../firebaseConfig')

export default {
  name: 'ProductRequest',
  components: {
    Progress: () => import('../components/Progress'),
    quillEditor,
  },
  data() {
    return {
      productReuestDialog: false,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            ['clean'],
          ],
        },
      },
      modSpecs: [],
      atomizerSpecs: [],
      selectedProduct: '',
      productPhotos: [],
      txtCompany: '',
      txtModel: '',
      txtDesc: '',
      productImagesPreview: [],
      companiesQ: [],
      products: [],
      progressDialog: false,
      selectedFeatures: [],
    }
  },
  firestore() {
    return {
      modSpecs: fb.db.collection('ModSpecs').orderBy('index'),
      atomizerSpecs: fb.db.collection('AtomizerSpecs').orderBy('index'),
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
  },
  methods: {
    productPhotoChange(event) {
      let files = event.target.files
      for (let file of files) {
        this.productPhotos.length = 0
        this.productPhotos.push({ image: file, type: 'product' })
      }
    },
    async sendProductRequest() {
      this.progressDialog = true
      let file = this.productPhotos[0]
      let imageUrls = []
      let specs =
        this.selectedProduct === 'Mod' ? this.modSpecs : this.atomizerSpecs
      specs
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
      this.selectedFeatures = this.selectedFeatures.filter(
        (v) => v !== '' || v !== null,
      )
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
        index: 0,
        image: downloadURL,
        imageName: filename,
        type: file.type,
      })
      fb.db.collection('Products').add({
        type: this.selectedProduct,
        company: this.txtCompany,
        model: this.txtModel,
        desc: this.txtDesc,
        images: imageUrls,
        features: this.selectedFeatures,
        specs: specs.filter((v) => v.value.length !== 0),
        lastScore: 0,
        approved: false,
        date: new Date(),
      })
      this.productPhotos.length = 0
      this.productImagesPreview.length = 0
      this.txtDesc = ''
      this.$refs.form.reset()
      this.progressDialog = false
    },
  },
  watch: {
    productPhotos: {
      handler() {
        this.productImagesPreview = [
          ...this.productPhotos.map((v) => URL.createObjectURL(v.image)),
        ]
      },
    },
  },
}
</script>

<style scoped>
.v-window__prev {
  display: none;
}
.v-window__next {
  display: none;
}
</style>
