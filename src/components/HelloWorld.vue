<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';

import Grid from './Grid.vue';
import Clues from './Clues.vue'
import { PairMap } from '../utils';

const width = ref(10);
const height = ref(10);
const color = ref();

const across = reactive(new PairMap<number | null, number>());
const down = reactive(new PairMap<number | null, number>());
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


  <div class="container">
    <div class="item grid">
      <Grid :width :height v-model:across="across" v-model:down="down" v-model:highlights="highlights" :color="color"></Grid>
    </div>
    <div class="item clues">
      <Clues :across :down :highlights></Clues>
    </div>
  </div>
</template>

<style scoped>
div.container {
  display: flex;
  gap: 1em;
}

div.grid {
  flex: 1;
}

div.clues {
  flex: 1.5;
}
</style>
