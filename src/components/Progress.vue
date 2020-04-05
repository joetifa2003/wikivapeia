<template>
  <v-dialog persistent width="300" v-model="progressDialog" indeterminate>
    <v-card>
      <v-card-title class="justify-center">{{ msg }}</v-card-title>
      <v-progress-linear
        indeterminate
        color="primary"
        class="mb-0"
      ></v-progress-linear>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Progress',
  props: ['progressDialog', 'msg'],
}
</script>

<style></style>
