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
import FooterComponent from "@/components/FooterComponent";
import MainMenu from "@/components/MainMenu";
export default {
  name: "auth-base",
  components: {
    FooterComponent,
    MainMenu
  }
};
</script>
