<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import Cell from './Cell.vue'
import { PairSet } from '../utils';

const props = defineProps<{width: number, height: number}>();

let grid: Array<Array<string>> = Array.from(
    {length: props.height},
    () => Array.from({length: props.width}, () => '')
);

let across = new PairSet<number>();
let down = new PairSet<number>();

function update(row: number, col: number) {
    const value = grid[row]?.[col].trim();
    if (value) {
        across.delete(row, col + 1);
        down.delete(row + 1, col);
        if (!grid[row][col - 1]) {
            across.add(row, col);
        }
        if (!grid[row - 1]?.[col]) {
            down.add(row, col);
        }
    } else {
        across.delete(row, col);
        down.delete(row, col);
        if (grid[row][col + 1]) {
            across.add(row, col + 1);
        }
        if (grid[row + 1]?.[col]) {
            down.add(row + 1, col);
        }
    }
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
