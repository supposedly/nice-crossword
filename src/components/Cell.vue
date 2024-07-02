<script setup lang="ts">

const props = withDefaults(defineProps<{name: string, row: number, col: number, number: number | null}>(), {name: 'grid'});
const model = defineModel<string>();
const emit = defineEmits(['update', 'jump']);

function jump(e: KeyboardEvent) {
    switch (e.key.replace(/^Arrow/, '')) {
        case 'Tab':
            emit('jump', props.row, props.col, {relative: true, direction: !e.shiftKey});
            break;
        case 'Up':
        case 'Down':
        case 'Left':
        case 'Right':
            emit('jump', props.row, props.col, {relative: false, direction: e.key.replace(/^Arrow/, '')});
            break;
        default:
            (e.target as HTMLInputElement).value = '';
            emit('jump', props.row, props.col, {relative: true, direction: true});
            break;
    }
}

function update() {
    emit('update', props.row, props.col)
}
</script>

<template>
    <p>
        <span>{{ number }}</span>
        <input
            v-model="model"
            :name="name"
            maxlength="1"
            size="1"
            :data-row="row"
            :data-col="col"
            @input="update"
            @keypress="jump"
            @keydown.tab.prevent="jump"
            @keydown.up.prevent="jump"
            @keydown.down.prevent="jump"
            @keydown.left.prevent="jump"
            @keydown.right.prevent="jump"
        ></input>
    </p>
</template>

<style scoped>
    p {
        position: relative;
    }

    span {
        position: absolute;
        left: 5px;
        top: -5px;
    }

    input {
        display: block;
        width: 100%;
        height: 0;
        padding: none;
        padding-bottom: 50%;
        padding-top: 50%;

        text-align: center;
        text-transform: uppercase;

        &:focus{
            outline: none;
            background-color: #eee;
            caret-color: transparent;
        }
    }
</style>
