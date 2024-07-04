<script setup lang="ts">
import { getCurrentInstance, reactive, Reactive} from 'vue';
import Cell from './Cell.vue'
import { PairMap, PairSet } from '../utils';

const props = defineProps<{width: number, height: number, color: string}>();

let grid: Reactive<PairMap<{value: string, number: number | null, color: string}, number>> = reactive(new PairMap());
let horizontal = true;

let across = defineModel<Reactive<PairSet<number>>>('across', {default: reactive(new PairSet())});
let down = defineModel<Reactive<PairSet<number>>>('down', {default: reactive(new PairSet())});
let highlights = defineModel<Reactive<Set<string>>>('highlights', {default: reactive(new Map())});

const defaultCell = () => ({value: '', number: null, color: 'rgba(0, 0, 0, 0)'});

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
    if (row < 0 || col < 0 || row >= props.height || col >= props.width) {
        across.value.delete(row, col);
    }
    if (!grid.get(row, col)?.value.trim()) {
        across.value.delete(row, col);
        return;
    }
    if (grid.get(row, col - 1)?.value.trim()) {
        across.value.delete(row, col);
        return;
    }
    if (grid.get(row, col + 1)?.value.trim()) {
        across.value.add(row, col);
        return;
    }
    across.value.delete(row, col);
}

function addDown(row: number, col: number) {
    if (row < 0 || col < 0 || row >= props.height || col >= props.width) {
        down.value.delete(row, col);
    }
    if (!grid.get(row, col)?.value.trim()) {
        down.value.delete(row, col);
        return;
    }
    if (grid.get(row - 1, col)?.value.trim()) {
        down.value.delete(row, col);
        return;
    }
    if (grid.get(row + 1, col)?.value.trim()) {
        down.value.add(row, col);
        return;
    }
    down.value.delete(row, col);
}

function updateNumbers() {
    let number = 1;
    for (let row = 0; row < props.height; row++) {
        for (let col = 0; col < props.width; col++) {
            if (across.value.has(row, col) || down.value.has(row, col)) {
                showNumber(number++, row, col);
            } else {
                removeNumber(row, col);
            }
        }
    }
}

function updateLists(row: number, col: number) {
    const value = grid.get(row, col)?.value;
    if (value) {
        across.value.delete(row, col + 1);
        down.value.delete(row + 1, col);
        addAcross(row, col);
        addDown(row, col);
        addAcross(row, col - 1);
        addDown(row - 1, col);
    } else {
        across.value.delete(row, col);
        down.value.delete(row, col);
        addAcross(row, col + 1);
        addDown(row + 1, col);
        addAcross(row, col - 1);
        addDown(row - 1, col);
    }
}

function update(row: number, col: number, key: string) {
    grid.setDefault(row, col, defaultCell()).value = key;
    updateLists(row, col);
    updateNumbers();
}

const getCell = (row: number, col: number) => document.querySelector(`input[data-row="${row}"][data-col="${col}"]`) as HTMLInputElement;

function jump(row: number, col: number, spec: {relative: true, direction: boolean} | {relative: false, direction: string}) {
    if (spec.relative) {
        const offset = spec.direction ? 1 : -1;
        getCell(row + offset * +!horizontal, col + offset * +horizontal)?.focus();
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
        // this is disruptive during editing
        // horizontal = !!x;
        getCell(row + y, col + x).focus();
    }
}

function flip() {
    horizontal = !horizontal;
}

function highlight(row: number, col: number) {
    if (grid.has(row, col)) {
        highlights.value.delete(grid.get(row, col)!.color);
    }
    highlights.value.add(props.color);
    grid.setDefault(row, col, defaultCell()).color = props.color;
}

function left() {
    const shifted = new PairMap<{
        value: string;  
        number: number | null;
        color: string;
    }, number>();
    grid.forEach((row, col, v) => {
        shifted.set(row, col - 1, v!);
        grid.delete(row, col);
        updateLists(row, col);
    });
    shifted.forEach((row, col, v) => {
        grid.set(row, col, v!);
        updateLists(row, col);
    });
    updateNumbers();
}

function right() {
    const shifted = new PairMap<{
        value: string;  
        number: number | null;
        color: string;
    }, number>();
    grid.forEach((row, col, v) => {
        shifted.set(row, col + 1, v!);
        grid.delete(row, col);
        updateLists(row, col);
    });
    shifted.forEach((row, col, v) => {
        grid.set(row, col, v!);
        updateLists(row, col);
    });
    updateNumbers();
}

function up() {
    const shifted = new PairMap<{
        value: string;  
        number: number | null;
        color: string;
    }, number>();
    grid.forEach((row, col, v) => {
        shifted.set(row - 1, col, v!);
        grid.delete(row, col);
        updateLists(row, col);
    });
    shifted.forEach((row, col, v) => {
        grid.set(row, col, v!);
        updateLists(row, col);
    });
    updateNumbers();
}

function goDown() {
    const shifted = new PairMap<{
        value: string;  
        number: number | null;
        color: string;
    }, number>();
    grid.forEach((row, col, v) => {
        shifted.set(row + 1, col, v!);
        grid.delete(row, col);
        updateLists(row, col);
    });
    shifted.forEach((row, col, v) => {
        grid.set(row, col, v!);
        updateLists(row, col);
    });
    updateNumbers();
}

const name = getCurrentInstance()?.uid.toString();
</script>

<template>
    <div class="grid-container">
        <button @click="left">Left</button>
        <button @click="up">Up</button>
        <button @click="goDown">Down</button>
        <button @click="right">Right</button>
        <div class="grid">
            <template v-for="row in height">
                <Cell v-for="col in width"
                    :name
                    :row="row - 1"
                    :col="col - 1"
                    :number="grid.setDefault(row - 1, col - 1, defaultCell()).number"
                    :color="grid.setDefault(row - 1, col - 1, defaultCell()).color"
                    :model-value="grid.setDefault(row - 1, col - 1, defaultCell()).value"
                    @update="update"
                    @jump="jump"
                    @flip="flip"
                    @highlight="highlight"
                />
            </template>
        </div>
    </div>
</template>

<style scoped>
div.grid {
    display: grid;
    grid-template: repeat(v-bind(height), 1fr) / repeat(v-bind(width), 1fr);
}
</style>
