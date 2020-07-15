<template>
  <v-app>
    <main-menu></main-menu>
    <v-main>
      <slot></slot>
    </v-main>
    <footer-component></footer-component>
  </v-app>
</template>

<script>
import FooterComponent from "@/components/Footer";
import MainMenu from "@/components/MainMenu";
export default {
  name: "authbaselayout",
  components: {
    FooterComponent,
    MainMenu
  }
};
</script>
