<template>
  <v-container fill-height class="" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card width="100%" elevation="20">
          <v-col>
            <v-row v-for="(banner, i) in banners" :key="i">
              <v-col class="d-flex align-center">
                <div>
                  <v-img width="200px" contain :src="banner.image" />
                  <v-text-field
                    v-model.number="banner.index"
                    label="Index"
                    style="width: 100%;"
                  />
                  <v-btn
                    width="100%"
                    @click.stop="deleteBanner(banner)"
                    class="red white--text"
                    >Delete</v-btn
                  >
                </div>
              </v-col>
              <v-col class="d-flex align-center">
                <v-checkbox v-model="banner.btn" label="Add button" />
              </v-col>
              <v-col class="d-flex align-center flex-column">
                <v-row v-if="banner.btn">
                  <v-col>
                    <v-text-field
                      v-model="banner.caption"
                      label="Button caption"
                      style="width: 100%;"
                    />
                    <v-combobox
                      v-model="banner.route"
                      style="width: 100%;"
                      clearable
                      label="Route"
                      :items="['/ranks', '/product', '/signup', '/stores']"
                    />
                  </v-col>
                  <v-col>
                    <v-combobox
                      v-model="banner.justify"
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
                      v-model="banner.align"
                      style="width: 100%;"
                      clearable
                      label="Align"
                      :items="['align-start', 'align-center', 'align-end']"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-btn
              width="100%"
              @click.stop="updateBanner()"
              class="yellow white--text"
              >Update</v-btn
            >
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2'
const fb = require('../../firebaseConfig')

export default {
  name: 'Banner_manage',
  data() {
    return {
      banners: [],
    }
  },
  firestore: {
    banners: fb.db.collection('Banners').orderBy('index'),
  },
  methods: {
    async updateBanner() {
      for (const banner of this.banners) {
        await fb.db.collection('Banners').doc(banner.id).update(banner)
      }
      Swal.fire('Updated!', 'Your files has been updated.', 'success')
    },
    async deleteBanner(banner) {
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
        await fb.db.collection('Banners').doc(banner.id).delete()
        await fb.st.ref('Banners/images').child(banner.imageName).delete()
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
      }
    },
  },
}
</script>

<style></style>
