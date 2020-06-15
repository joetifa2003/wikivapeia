<template>
  <v-container fill-height fluid class="">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="20">
          <v-col>
            <v-row>
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
                <v-combobox
                  v-model="selectedWindow"
                  @change="windowChange"
                  :items="['Main', 'Left', 'Center', 'Right']"
                  label="Banner"
                />
              </v-col>
            </v-row>
            <v-row v-for="(image, i) in images" :key="i">
              <v-col class="d-flex align-center">
                <div>
                  <v-img width="200px" contain :src="image.image" />
                  <v-text-field v-model.number="image.index" label="Index" />
                  <v-btn
                    width="100%"
                    class="red white--text"
                    @click="deleteBanner(i)"
                    >Delete</v-btn
                  >
                </div>
              </v-col>
              <v-col class="d-flex align-center">
                <v-checkbox v-model="image.btn" label="Add button" />
              </v-col>
              <v-col v-if="image.btn" class="d-flex align-center flex-column">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="image.caption"
                      label="Button caption"
                      style="width: 100%;"
                    />
                    <v-combobox
                      v-model="image.route"
                      style="width: 100%;"
                      clearable
                      label="Route"
                      :items="['/ranks', '/product', '/signup', '/stores']"
                    />
                  </v-col>
                  <v-col>
                    <v-combobox
                      v-model="image.justify"
                      style="width: 100%;"
                      clearable
                      label="Justify"
                      :items="[
                        'justify-start',
                        'justify-center',
                        'justify-end',
                      ]"
                    />
                    <v-combobox
                      v-model="image.align"
                      style="width: 100%;"
                      clearable
                      label="Align"
                      :items="['align-start', 'align-center', 'align-end']"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-col class="pa-0 mt-5">
              <v-btn class="primary white--text" @click.stop="addBanner"
                >Add banners</v-btn
              >
            </v-col>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog persistent width="300" v-model="progressDialog" indeterminate>
      <v-card>
        <v-card-title class="justify-center">{{ progressMsg }}</v-card-title>
        <v-progress-linear
          indeterminate
          color="primary"
          class="mb-0"
        ></v-progress-linear>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2'
import imageCompression from 'browser-image-compression'
import { v1 as uuid } from 'uuid'
const fb = require('../../firebaseConfig')

export default {
  name: 'Admin_banner_add',
  data() {
    return {
      images: [],
      progressDialog: false,
      progressMsg: 'Uploading images',
      direction: 0,
      banners: [],
      selectedWindow: 'Main',
    }
  },
  methods: {
    async fileChange(event) {
      var files = event.target.files
      this.progressDialog = true
      for (const file of files) {
        var fileCompressed = await imageCompression(file, {
          maxSizeMB: 1,
          useWebWorker: true,
          onProgress: () => {},
        })
        var filename = uuid() + '.' + file.name.split('.').pop()
        const snapshot = await fb.st
          .ref()
          .child('Banners')
          .child('images')
          .child(filename)
          .put(fileCompressed)
        const downloadURL = await snapshot.ref.getDownloadURL()
        this.images.push({
          index: 0,
          image: downloadURL,
          imageName: filename,
          window: this.selectedWindow,
          btn: false,
          caption: '',
          route: '',
          justify: 'justify-center',
          align: 'align-end',
        })
      }
      this.progressDialog = false
    },
    windowChange() {
      for (var i = 0; i < this.images.length; i++) {
        var image = this.images[i]
        image.window = this.selectedWindow
        this.images[i] = image
      }
    },
    async addBanner() {
      this.progressMsg = 'Uploading to database'
      this.progressDialog = true
      await this.$bind(
        'banners',
        fb.db.collection('Banners').where('window', '==', this.selectedWindow),
      )
      await this.$unbind('banners', false)
      switch (this.direction) {
        case 0:
          for (var index = 0; index < this.images.length; index++) {
            this.images[index].index += this.banners.length
          }
          for (const image of this.images) {
            await fb.db.collection('Banners').add(image)
          }
          break
        case 1:
          for (var index2 = 0; index2 < this.banners.length; index2++) {
            await fb.db
              .collection('Banners')
              .doc(this.banners[index2].id)
              .update({
                index: this.banners[index2].index + this.images.length,
              })
          }
          for (const image of this.images) {
            await fb.db.collection('Banners').add(image)
          }
          break
      }
      this.images = []
      this.progressDialog = false
    },
    async deleteBanner(i) {
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
        await fb.st
          .ref('Banners/images')
          .child(this.images[i].imageName)
          .delete()
        this.images.splice(i, 1)
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
      }
    },
  },
}
</script>

<style></style>
