<script setup lang="ts">
import { ref } from 'vue';

import Grid from './Grid.vue';

let width = ref(10);
let height = ref(10);
</script>

<template>
  Width
  <input placeholder="Width" type="number" v-model.number="width">
  Height
  <input placeholder="Height" type="number" v-model.number="height">


  <Grid :width :height></Grid>
</template>

<style scoped>
</style>
