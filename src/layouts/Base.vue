<template>
  <v-app>
    <v-main class="pb-16">
      <slot></slot>
    </v-main>
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
