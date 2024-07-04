<script setup lang="ts">

const props = withDefaults(defineProps<{name: string, row: number, col: number, number: number | null}>(), {name: 'grid'});
const model = defineModel<string>();
const emit = defineEmits(['update', 'jump']);

function jump(e: KeyboardEvent) {
    let key = e.key.replace(/^Arrow/, '');
    switch (key) {
        case 'Tab':
            emit('jump', props.row, props.col, {relative: true, direction: !e.shiftKey});
            break;
        case 'Backspace':
            emit('jump', props.row, props.col, {relative: true, direction: false});
            break;
        case 'Up':
        case 'Down':
        case 'Left':
        case 'Right':
            emit('jump', props.row, props.col, {relative: false, direction: key});
            break;
        default:
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
            maxlength="1"
            size="1"
            :name="name"
            :data-row="row"
            :data-col="col"
            @input="update"
            @keypress="jump"
            @keydown.tab.prevent="jump"
            @keydown.up.prevent="jump"
            @keydown.down.prevent="jump"
            @keydown.left.prevent="jump"
            @keydown.right.prevent="jump"
            @keydown.backspace="e => (e.target as HTMLInputElement).setSelectionRange(1, 1)"
            @keydown.delete="e => e.key === 'Backspace' ? jump(e) : (e.target as HTMLInputElement).setSelectionRange(0, 0)"
            @mouseup="e => (e.target as HTMLInputElement).setSelectionRange(1, 1)"
        ></input>
    </p>
</template>

<style scoped>
    p {
        position: relative;
        margin: 0;
    }

    span {
        position: absolute;
        left: 1px;
        top: -4px;
        font-size: small;
    }

    input {
        display: block;
        width: 100%;
        height: 0;
        padding: none;
        padding-bottom: 50%;
        padding-top: 50%;
        font-size: x-large;

        text-align: center;
        text-transform: uppercase;

        &:focus{
            outline: none;
            background-color: #eee;
            /*caret-color: transparent;*/
        }
    }
</style>
