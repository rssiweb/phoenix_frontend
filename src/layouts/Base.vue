<template>
  <div>
    <slot></slot>
    <footer-component></footer-component>
  </div>
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

<style lang="scss">
body,
html {
  background: $bg-light;
}
</style>