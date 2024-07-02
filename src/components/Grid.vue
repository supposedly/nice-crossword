<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import Cell from './Cell.vue'

defineProps<{width: number, height: number}>();

const uid = getCurrentInstance()?.uid.toString();
</script>

<template>
    <div>
        <template v-for="_ in height">
            <Cell v-for="_ in width" :name="uid"/>
        </template>
    </div>
</template>

<style scoped>
div {
    display: grid;
    grid-template: repeat(v-bind(height), 1fr) / repeat(v-bind(width), 1fr);
}
</style>
