<template>
  <v-row>
    <template v-for="(color, index) in colors">
      <v-btn x-small class="ml-4 mr-1" :color="colors[index]" :key="color">{{
        texts[index]
      }}</v-btn
      >{{ descriptions[index] }}
    </template>
  </v-row>
</template>

<script>
export default {
  name: "attendance-legends",
  props: ["colors", "texts", "descriptions"],
};
</script>