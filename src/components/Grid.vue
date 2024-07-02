<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import Cell from './Cell.vue'

const props = defineProps<{width: number, height: number}>();

let grid: Array<Array<string>> = Array.from(
    {length: props.height},
    () => Array.from({length: props.width}, () => '')
);

let across = new Set<{row: number, col: number}>();
let down = new Set<{row: number, col: number}>();

function update(row: number, col: number) {
    console.log('hi');
    // const value = grid[row]?.[col];
    // console.log(value);
    // if (grid[row - 1]) {
    //     return;
    // }
}

const cell = (row: number, col: number) => document.querySelector(`input[data-row="${row}"][data-col="${col}"]`) as HTMLInputElement;

function jump(row: number, col: number, spec: {relative: true, direction: boolean} | {relative: false, direction: string}) {
    if (spec.relative) {
        const offset = spec.direction ? 1 : -1;
        cell(row, col + offset).focus();
    } else {
        let x: number = 0;
        let y: number = 0;
        switch (spec.direction) {
            case 'Up':
                y = -1;
                break;
            case 'Down':
                y = 1;
                break;
            case 'Left':
                x = -1;
                break;
            case 'Right':
                x = 1;
                break;
        }
        cell(row + y, col + x).focus()
    }
}

const name = getCurrentInstance()?.uid.toString();
</script>

<template>
    <div>
        <template v-for="row in height" v-if="grid">
            <Cell v-for="col in width" v-if="grid[row]"
                :name
                :row
                :col
                v-model="grid[row][col]"
                @update="update"
                @jump="jump"
            />
        </template>
    </div>
</template>

<style scoped>
div {
    display: grid;
    grid-template: repeat(v-bind(height), 1fr) / repeat(v-bind(width), 1fr);
}
</style>
