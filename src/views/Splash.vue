<template>
  <v-app fill-height fluid class="primary">
    <v-content>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-col class="d-flex justify-center">
            <div style="width: 200px;">
              <v-img src="~@/assets/WikivapeiaLogo.svg" />
            </div>
          </v-col>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0 mt-5"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Splash',
}
</script>

<style></style>
