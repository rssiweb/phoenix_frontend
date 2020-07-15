<template>
  <v-app>
    <slot></slot>
    <footer-component></footer-component>
  </v-app>
</template>

<script>
import FooterComponent from "@/components/Footer";
export default {
  name: "baselayout",
  components: {
    FooterComponent
  }
};
</script>
