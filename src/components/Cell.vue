<script setup lang="ts">

withDefaults(defineProps<{name: string}>(), {name: 'grid'});
</script>

<template>
    <input type="radio" :name="name"></input>
</template>

<style scoped>
    input {
        display: block;
    }
</style>
