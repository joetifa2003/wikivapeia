<template>
  <v-container fill-height class="pt-12" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card width="100%" elevation="20">
          <v-col>
            <v-text-field
              v-model="txtSearch"
              filled
              label="Search"
              @input="search"
              :loading="searchLoading"
            />
            <v-switch
              :loading="reqOnlyLoading"
              color="black"
              label="Requests only"
              v-model="reqOnly"
            />
            <v-row>
              <v-col
                cols="12"
                sm="6"
                xl="4"
                v-for="product in products"
                :key="product.id"
              >
                <ProductItem
                  :product="product"
                  page="Admin"
                  @addImage="addImageClick(product)"
                  @editImages="arrangeImageClick(product)"
                  @updateProduct="updateProductClick(product)"
                  @deleteProduct="deleteProductClick(product)"
                />
              </v-col>
              <infinite-loading @infinite="infiniteHandler"></infinite-loading>
            </v-row>
            <v-btn @click.stop="deletedSelected" class="red white--text mt-5"
              >Delete selected</v-btn
            >
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <Progress :progressDialog="progressDialog" :msg="progressMsg" />
    <v-dialog width="85%" v-model="addImageDialog" indeterminate>
      <v-card width="100%" class="pa-5">
        <v-row class="pa-0">
          <v-col>
            <input
              :rules="[(v) => !!v || 'Image is required']"
              type="file"
              multiple
              @change="fileChange"
            />
          </v-col>
          <v-col>
            <v-btn-toggle v-model="direction">
              <v-btn>
                Add to end
                <v-icon>arrow_downward</v-icon>
              </v-btn>
              <v-btn>
                Add to start
                <v-icon>arrow_upward</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row v-for="(image, i) in images" :key="i">
          <v-col class="d-flex align-center">
            <div>
              <v-img width="200px" contain :src="image.image" />
              <v-btn width="100%" class="red white--text">Delete</v-btn>
            </div>
          </v-col>
          <v-col cols="3" class="d-flex justify-center align-center">
            <v-text-field v-model.number="image.index" label="Index" />
          </v-col>
        </v-row>
        <v-col>
          <v-btn class="primary white--text" @click="addImages"
            >Add images</v-btn
          >
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="product"
      :width="$vuetify.breakpoint.mdAndUp ? '20%' : '100%'"
      v-model="arrangeImageDialog"
      persistent
    >
      <v-card class="pa-5">
        <v-card v-for="(image, i) in product.images" :key="i" class="my-2">
          <v-img contain :src="image.image" width="auto" height="144px">
            <div
              v-if="image.type === 'facebook'"
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
              :disabled="image.type === 'facebook'"
              color="indigo"
              @click="makeFBImage(i)"
              ><v-icon>share</v-icon> Sharing image</v-btn
            >
            <v-btn @click="product.images.splice(i, 1)" text color="grey" icon
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
          @click="exitEditImage"
          class="black white--text mt-3"
          style="width: 100%;"
          ><v-icon>exit_to_app</v-icon>Exit</v-btn
        >
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="product"
      width="85%"
      v-model="updateImageDialog"
      indeterminate
    >
      <v-card width="100%" class="pa-5">
        <v-form ref="formRef">
          <v-col>
            <v-row>
              <v-col cols="12">
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
                      v-model="product.type"
                    />
                  </v-col>
                  <v-col>
                    <v-combobox
                      :disabled="
                        !(
                          typeSubTypes[product.type] &&
                          typeSubTypes[product.type].length > 0
                        )
                      "
                      :items="typeSubTypes[product.type]"
                      :rules="[(v) => !!v || 'Product type is required']"
                      clearable
                      label="Select product sub type"
                      v-model="product.subType"
                    />
                  </v-col>
                </v-row>
                <v-combobox
                  :items="companies"
                  :rules="[(v) => !!v || 'Company is required']"
                  label="Company"
                  v-model="product.company"
                />
                <v-text-field
                  :rules="[(v) => !!v || 'Model is required']"
                  v-model="product.model"
                  clearable
                  label="Model"
                  item-text="model"
                  item-value="model"
                />
                <div>
                  <v-row>
                    <v-col
                      v-for="spec in product.specs"
                      :key="spec.id"
                      cols="6"
                    >
                      <div v-if="spec.isCombo">
                        <v-combobox
                          v-if="spec.multi"
                          :items="spec.values"
                          :label="spec.name"
                          v-model="spec.value"
                          multiple
                        />
                        <v-combobox
                          v-else
                          :items="spec.values"
                          :label="spec.name"
                          v-model="spec.value"
                        />
                      </div>
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
                <quill-editor v-model="product.desc" :options="editorOption" />
              </v-col>
            </v-row>
          </v-col>
        </v-form>
        <v-col cols="12">
          <v-btn @click="updateProduct" class="primary white--text"
            >Update</v-btn
          >
        </v-col>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { debounce, sortBy } from 'lodash'
import imageCompression from 'browser-image-compression'
import { orderBy } from 'lodash'
import { v1 as uuid } from 'uuid'
import Swal from 'sweetalert2'
import Product from '../../classes/Product'
import { plainToClass } from 'class-transformer'
import InfiniteLoading from 'vue-infinite-loading'
const fb = require('../../firebaseConfig')

export default {
  name: 'Admin_product_manage',
  components: {
    Progress: () => import('../../components/Progress'),
    ProductItem: () => import('../../components/Items/ProductItem'),
    quillEditor: async () => {
      let editor = await import('vue-quill-editor')
      return editor.quillEditor
    },
    InfiniteLoading,
  },
  data() {
    return {
      currentID: '',
      productListQ: [],
      productList: [],
      txtSearch: '',
      addImageDialog: false,
      arrangeImageDialog: false,
      updateImageDialog: false,
      delteProductDialog: false,
      direction: undefined,
      images: [],
      progressDialog: false,
      progressMsg: '',
      product: null,
      productQ: {},
      currentImages: [],
      featureList: [],
      deleteList: [],
      searchIndex: [],
      companiesQ: [],
      lastProduct: {},
      products: {},
      productsQ: {},
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
      reqOnly: false,
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
      searchLoading: false,
      reqOnlyLoading: false,
    }
  },
  created() {
    this.companies = orderBy(this.companies)
    this.searchQuery.onSnapshot((query) => {
      this.lastProduct = query.docs[query.docs.length - 1]
      for (let i = 0; i < query.docs.length; i++) {
        let doc = query.docs[i]
        this.$set(this.productsQ, doc.id, { id: doc.id, ...doc.data() })
      }
      this.updateProducts()
    })
  },
  firestore: {
    productListQ: fb.db.collection('Products').orderBy('date', 'desc'),
    companiesQ: fb.db.collection('Companies'),
  },
  watch: {
    txtSearch: {
      handler() {
        this.searchLoading = true
        this.updateProductItems()
      },
    },
    reqOnly: {
      handler() {
        this.reqOnlyLoading = true
        this.updateProductItems()
      },
    },
  },
  computed: {
    searchQuery() {
      let query = fb.db.collection('Products').limit(9)
      if (this.txtSearch) {
        query = query.where(
          'modelSRC',
          'array-contains',
          this.txtSearch.toLowerCase(),
        )
      }
      if (this.reqOnly) {
        query = query.where('approved', '==', false)
      }
      if (!(this.txtSearch || this.reqOnly)) {
        query = query.orderBy('type', 'asc')
      }
      return query
    },
    companies: {
      set: function () {},
      get: function () {
        return sortBy(this.companiesQ.map((v) => v.name))
      },
    },
  },
  methods: {
    updateProductItems: debounce(function () {
      this.searchQuery.get().then((query) => {
        this.lastProduct = query.docs[query.docs.length - 1]
        this.productsQ = {}
        for (let i = 0; i < query.docs.length; i++) {
          let doc = query.docs[i]
          this.$set(this.productsQ, doc.id, { id: doc.id, ...doc.data() })
        }
        this.updateProducts()
        this.searchLoading = false
        this.reqOnlyLoading = false
      })
    }, 500),
    infiniteHandler($state) {
      if (this.lastProduct) {
        this.searchQuery
          .startAfter(this.lastProduct)
          .get()
          .then((query) => {
            this.lastProduct = query.docs[query.docs.length - 1]
            for (let i = 0; i < query.docs.length; i++) {
              let doc = query.docs[i]
              this.$set(this.productsQ, doc.id, { id: doc.id, ...doc.data() })
            }
            this.updateProducts()
            $state.loaded()
          })
      } else {
        $state.complete()
      }
    },
    updateProducts() {
      this.products = plainToClass(Product, Object.values(this.productsQ))
    },
    makeFBImage(index) {
      for (let i = 0; i < this.product.images.length; i++) {
        this.product.images[i].type = 'product'
      }
      this.product.images[index].type = 'facebook'
    },
    reIndex(index, upDown) {
      if (this.product.images.length === 0 && upDown === 'up') return
      if (this.product.images.length === index + 1 && upDown === 'down') return
      if (index === 0 && upDown === 'up') return
      if (upDown === 'up') {
        let tmp = this.product.images[index - 1]
        this.product.images[index - 1] = this.product.images[index]
        this.product.images[index] = tmp
      } else {
        let tmp = this.product.images[index + 1]
        this.product.images[index + 1] = this.product.images[index]
        this.product.images[index] = tmp
      }
      this.$forceUpdate()
    },
    exitEditImage() {
      fb.db.collection('Products').doc(this.currentID).update({
        images: this.product.images,
      })
      this.arrangeImageDialog = false
    },
    async search() {
      this.productList = this.searchedList
    },
    async addImageClick(product) {
      this.currentID = product.id
      this.images = []
      this.product = product
      this.currentImages = this.product.images
      this.addImageDialog = !this.addImageDialog
    },
    async arrangeImageClick(product) {
      this.currentID = product.id
      this.product = product
      this.currentImages = this.product.images
      this.arrangeImageDialog = !this.arrangeImageDialog
    },
    async updateProductClick(product) {
      this.currentID = product.id
      this.product = product
      this.productQ = Object.assign({}, product)
      this.updateImageDialog = !this.updateImageDialog
      this.featureListFill()
    },
    async deleteProduct(product) {
      for (const image of product.images) {
        await fb.st
          .ref()
          .child('Products')
          .child(product.type + 's')
          .child('images')
          .child(image.imageName)
          .delete()
      }
      await fb.db.collection('Products').doc(product.id).delete()
    },
    async deleteProductClick(product) {
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
        await this.deleteProduct(product)
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
      }
    },
    async deletedSelected() {
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
        this.productList
          .filter((v) => v.checked === true)
          .forEach((product) => {
            this.deleteProduct(product)
          })
        Swal.fire('Deleted!', 'Your files has been deleted.', 'success')
      }
    },
    async addImages() {
      this.progressDialog = true
      this.progressMsg = 'Adding images'
      switch (this.direction) {
        case 0:
          for (var index = 0; index < this.images.length; index++) {
            this.images[index].index += this.currentImages.length
          }
          await fb.db
            .collection('Products')
            .doc(this.currentID)
            .update({
              images: sortBy([...this.currentImages, ...this.images], 'index'),
            })
          break
        case 1:
          for (var index2 = 0; index2 < this.currentImages.length; index2++) {
            this.currentImages[index2].index += this.images.length
          }
          await fb.db
            .collection('Products')
            .doc(this.currentID)
            .update({
              images: sortBy([...this.images, ...this.currentImages], 'index'),
            })
          break
      }
      this.progressDialog = false
      this.addImageDialog = false
      Swal.fire('Added!', 'Images has been added!.', 'success')
    },
    getModelSRC(model) {
      let modelSRCList = []
      for (let i = 0; i < model.length; i++) {
        modelSRCList.push(model.toLowerCase().substr(0, i + 1))
      }
      return modelSRCList
    },
    async updateProduct() {
      await fb.db
        .collection('Products')
        .doc(this.currentID)
        .update({
          type: this.product.type,
          subType: this.product.subType,
          company: this.product.company,
          model: this.product.model,
          features: Product.getFeatures(this.product.specs),
          specs: this.product.specs
            .filter((v) => v.value.length !== 0)
            .map((v) => ({ name: v.name, value: v.value, unit: v.unit })),
          desc: this.product.desc,
          modelSRC: this.getModelSRC(this.product.model),
        })
      this.updateImageDialog = false
      Swal.fire('Updated!', 'Product has been updated.', 'success')
    },
    async fileChange(event) {
      this.progressDialog = true
      this.progressMsg = 'Uploading images'
      let files = event.target.files
      for (const file of files) {
        let fileCompressed = await imageCompression(file, {
          maxSizeMB: 1,
          useWebWorker: true,
          onProgress: () => {},
        })
        let filename = uuid() + '.' + file.name.split('.').pop()
        const snapshot = await fb.st
          .ref()
          .child('Products')
          .child(this.product.type + 's')
          .child('images')
          .child(filename)
          .put(fileCompressed)
        const downloadURL = await snapshot.ref.getDownloadURL()
        this.images.push({
          index: 0,
          image: downloadURL,
          imageName: filename,
          type: 'product',
        })
      }
      this.progressDialog = false
    },
    productChange() {
      this.product.features = []
      this.featureListFill()
    },
    featureListFill() {
      if (this.product.type === 'Mod') {
        this.featureList = ['Box', 'Squonk', 'Mechanical', 'Regulated']
      } else if (this.product.type === 'Atomizer') {
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
  },
}
</script>

<style></style>
