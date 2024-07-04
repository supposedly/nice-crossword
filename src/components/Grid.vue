<script setup lang="ts">
import { getCurrentInstance, reactive, Reactive} from 'vue';
import Cell from './Cell.vue'
import { PairMap, PairSet } from '../utils';

const props = defineProps<{width: number, height: number}>();

let grid: Reactive<PairMap<{value: string, number: number | null}, number>> = reactive(new PairMap());
let horizontal = true;

let across = new PairSet<number>();
let down = new PairSet<number>();

function showNumber(number: number, row: number, col: number) {
    const value = grid.get(row, col);
    if (value !== undefined) {
        value.number = number;
    }
}

function removeNumber(row: number, col: number) {
    const value = grid.get(row, col);
    if (value !== undefined) {
        value.number = null;
    }
}

function addAcross(row: number, col: number) {
    if (!grid.get(row, col)?.value.trim()) {
        across.delete(row, col);
        return;
    }
    if (grid.get(row, col - 1)?.value.trim()) {
        across.delete(row, col);
        return;
    }
    if (grid.get(row, col + 1)?.value.trim()) {
        across.add(row, col);
        return;
    }
    across.delete(row, col);
}

function addDown(row: number, col: number) {
    if (!grid.get(row, col)?.value.trim()) {
        across.delete(row, col);
        return;
    }
    if (grid.get(row - 1, col)?.value.trim()) {
        down.delete(row, col);
        return;
    }
    if (grid.get(row + 1, col)?.value.trim()) {
        down.add(row, col);
        return;
    }
    down.delete(row, col);
}

function update(row: number, col: number) {
    const value = grid.get(row, col)?.value.trim();
    console.log(row, col, value)
    if (value) {
        across.delete(row, col + 1);
        down.delete(row + 1, col);
        addAcross(row, col);
        addDown(row, col);
        addAcross(row, col - 1);
        addDown(row - 1, col);
    } else {
        across.delete(row, col);
        down.delete(row, col);
        addAcross(row, col + 1);
        addDown(row + 1, col);
        addAcross(row, col - 1);
        addDown(row - 1, col);
    }

    let number = 1;
    for (let row = 0; row < props.height; row++) {
        for (let col = 0; col < props.width; col++) {
            if (across.has(row, col) || down.has(row, col)) {
                showNumber(number++, row, col);
            } else {
                removeNumber(row, col);
            }
        }
    }
}

const getCell = (row: number, col: number) => document.querySelector(`input[data-row="${row}"][data-col="${col}"]`) as HTMLInputElement;

function jump(row: number, col: number, spec: {relative: true, direction: boolean} | {relative: false, direction: string}) {
    if (spec.relative) {
        const offset = spec.direction ? 1 : -1;
        getCell(row + offset * +!horizontal, col + offset * +horizontal).focus();
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
        horizontal = !!x;
        const cellInput = getCell(row + y, col + x);
        cellInput.focus();
        cellInput.setSelectionRange(1, 1);
    }
}

const name = getCurrentInstance()?.uid.toString();
</script>

<template>
    <div>
        <template v-for="row in height">
            <Cell v-for="col in width"
                :name
                :row="row - 1"
                :col="col - 1"
                :number="grid.setDefault(row - 1, col - 1, {value: '', number: null}).number"
                v-model="grid.setDefault(row - 1, col - 1, {value: '', number: null}).value"
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
