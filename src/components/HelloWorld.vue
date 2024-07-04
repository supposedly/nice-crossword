<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';

import Grid from './Grid.vue';
import Clues from './Clues.vue'
import { PairSet } from '../utils';

const width = ref(10);
const height = ref(10);
const color = ref();

const across = reactive(new PairSet<number>());
const down = reactive(new PairSet<number>());
const highlights = reactive(new Set<string>());

watchEffect(() => console.log(across))
</script>

<template>
  Width
  <input placeholder="Width" type="number" v-model.number="width">
  Height
  <input placeholder="Height" type="number" v-model.number="height">
  Color
  <color-picker v-model:pureColor="color" format="rgb" shape="circle"></color-picker>


  <div>
    <Grid :width :height v-model:across="across" v-model:down="down" v-model:highlights="highlights" :color="color"></Grid>
    <Clues :across :down :highlights></Clues>
  </div>
</template>

<style scoped>
div {
  display: flex;
  gap: 1em;
}
</style>
