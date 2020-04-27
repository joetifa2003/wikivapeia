<template>
  <v-container fill-height class="" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card width="100%" elevation="20">
          <v-col>
            <v-text-field
              v-model="txtSearch"
              filled
              label="Search"
              @input="search"
            />
            <v-row>
              <v-col
                cols="12"
                sm="6"
                xl="4"
                v-for="product in productList"
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
    <v-dialog width="85%" v-model="arrangeImageDialog" indeterminate>
      <v-card width="100%" class="pa-5">
        <v-row v-for="(image, i) in currentImages" :key="i">
          <v-col class="d-flex align-center">
            <div>
              <v-img width="200px" contain :src="image.image" />
              <v-btn
                v-if="currentImages.length > 1"
                width="100%"
                class="red white--text"
                @click="deleteImage(i)"
                >Delete</v-btn
              >
            </div>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model.number="image.index" label="index" />
          </v-col>
        </v-row>
        <v-col>
          <v-btn class="primary white--text" @click="arrangeImages"
            >Arrange</v-btn
          >
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog width="85%" v-model="updateImageDialog" indeterminate>
      <v-card width="100%" class="pa-5">
        <v-form ref="formRef">
          <v-col>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  @input="productChange"
                  :items="['Mod', 'Atomizer']"
                  :rules="[(v) => !!v || 'Product type is required']"
                  clearable
                  label="Select product type"
                  v-model="product.type"
                />
                <v-combobox
                  :items="companies"
                  :rules="[(v) => !!v || 'Company is required']"
                  label="Company"
                  v-model="product.company"
                />
                <v-combobox
                  :rules="[(v) => !!v || 'Model is required']"
                  v-model="product.model"
                  append-icon=""
                  hide-detailsf
                  clearable
                  :items="products"
                  label="Model"
                  item-text="model"
                  item-value="model"
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
                <v-combobox
                  :items="featureList"
                  :rules="[(v) => !!v || 'Feature is required']"
                  clearable
                  multiple
                  class="multiple"
                  small-chips
                  label="Select features"
                  v-model="product.features"
                />
                <!--- specs -->
                <div v-if="product.type === 'Mod'">
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
                <div v-else>
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
import { sortBy } from 'lodash'
import imageCompression from 'browser-image-compression'
import { orderBy } from 'lodash'
import { v1 as uuid } from 'uuid'
const fb = require('../../firebaseConfig')
import Swal from 'sweetalert2'
import Fuse from 'fuse.js'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'Admin_product_manage',
  components: {
    Progress: () => import('../../components/Progress'),
    ProductItem: () => import('../../components/Items/ProductItem'),
    quillEditor,
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
      product: {},
      currentImages: [],
      featureList: [],
      deleteList: [],
      searchIndex: [],
      modSpecs: [],
      atomizerSpecs: [],
      companiesQ: [],
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
    }
  },
  created() {
    this.companies = orderBy(this.companies)
  },
  firestore: {
    productListQ: fb.db.collection('Products'),
    modSpecs: fb.db.collection('ModSpecs').orderBy('index'),
    atomizerSpecs: fb.db.collection('AtomizerSpecs').orderBy('index'),
    companiesQ: fb.db.collection('Companies'),
  },
  watch: {
    productListQ: {
      handler(productListQ) {
        this.productList = productListQ
        this.productList.map((v) => Object.assign(v, { checked: false }))
        this.buildIndex(this.productList)
      },
    },
  },
  computed: {
    companies: {
      set: function () {},
      get: function () {
        return sortBy(this.companiesQ.map((v) => v.name))
      },
    },
    productListQWithId() {
      if (!this.productListQ) {
        return []
      }
      return this.productListQ.map((product) => ({
        ...product,
        id: product.id,
      }))
    },
    searchedList() {
      if (this.txtSearch === '') {
        return this.productList
      } else {
        return this.searchIndex.search(this.txtSearch).map((v) => v.item)
      }
    },
  },
  methods: {
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
    async arrangeImages() {
      await fb.db
        .collection('Products')
        .doc(this.currentID)
        .update({
          images: sortBy(this.currentImages, 'index'),
        })
      await this.$bind(
        'product',
        fb.db.collection('Products').doc(this.currentID),
      )
      await this.$unbind('product', false)
      this.currentImages = this.product.images
      this.arrangeImageDialog = false
      Swal.fire('Edited!', 'Images has been edited.', 'success')
    },
    async deleteImage(index) {
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
        this.currentImages.splice(index, 1)
        await fb.db.collection('Products').doc(this.product.id).update({
          images: this.currentImages,
        })
        Swal.fire('Deleted!', 'Image has been deleted.', 'success')
      }
    },
    async updateProduct() {
      await fb.db.collection('Products').doc(this.currentID).update({
        type: this.product.type,
        company: this.product.company,
        model: this.product.model,
        features: this.product.features,
        specs: this.product.specs,
        desc: this.product.desc,
      })
      this.updateImageDialog = false
      Swal.fire('Updated!', 'Product has been updated.', 'success')
    },
    async fileChange(event) {
      this.progressDialog = true
      this.progressMsg = 'Uploading images'
      var files = event.target.files
      for (const file of files) {
        var fileCompressed = await imageCompression(file, {
          maxSizeMB: 1,
          useWebWorker: true,
          onProgress: () => {},
        })
        var filename = uuid() + '.' + file.name.split('.').pop()
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
    buildIndex(docs) {
      this.searchIndex = new Fuse(docs, {
        caseSensitive: false,
        includeScore: true,
        keys: ['model', 'company'],
        shouldSort: false,
        threshold: 0.3,
      })
    },
  },
}
</script>

<style></style>
