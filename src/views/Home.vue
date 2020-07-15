<template>
  <auth-base-layout>
    <v-container fluid>
      <h1>This is an home page</h1>
    </v-container>
  </auth-base-layout>
</template>
<script>
import AuthBaseLayout from "@/layouts/AuthBase";
export default {
  name: "home-page",
  components: {
    AuthBaseLayout
  }
};
</script>