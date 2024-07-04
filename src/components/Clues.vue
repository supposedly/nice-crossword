<script setup lang="ts">
import { Reactive } from 'vue';
import { PairSet } from '../utils';

defineProps<{across: Reactive<PairSet<number>>, down: Reactive<PairSet<number>>, highlights: Set<string>}>();
</script>

<template>
    <article>
        <h2>Clues</h2>
        <section>
            <div>
                <h3>Across</h3>
                <ol>
                    <li v-for="_ in across.size"><input></input></li>
                </ol>
            </div>
            <div>
                <h3>Down</h3>
                <ol>
                    <li v-for="_ in down.size"><input></input></li>
                </ol>
            </div>
            <div>
                <h3>Colors</h3>
                <ul>
                    <li v-for="color, i in highlights">
                        <span :style="{color: color, backgroundColor: color, fontWeight: 'bold'}">(Color {{ i + 1 }})</span>
                        &nbsp;<input></input>
                    </li>
                </ul>
            </div>
        </section>
    </article>
</template>

<style scoped>

section {
    display: flex;
    margin-top: -0.5em;
}

h2 {
    margin-bottom: 0;
    padding-left: 1.5em;
}

h3 {
    padding-left: 2em;
}

li {
    margin: 10px;
}

input {
    border: none;
    border-bottom: 1px solid gray;

    &:focus {
        background-color: #eee;
    }
}
</style>
