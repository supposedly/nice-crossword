<script setup lang="ts">


const props = withDefaults(defineProps<{
    name: string,
    row: number,
    color: string | null,
    col: number,
    number: number | null
}>(), {name: 'grid', color: null});
const model = defineModel<string>();
const emit = defineEmits(['update', 'jump', 'flip', 'highlight']);

let alreadyFocused = false;

function jump(e: KeyboardEvent) {
    let key = e.key.replace(/^Arrow/, '').trim();
    switch (key) {
        case '':
            emit('highlight', props.row, props.col);
            break;
        case 'Tab':
            emit('flip');
            break;
        // @ts-expect-error (intentional fallthrough)
        case 'Backspace': 
            emit('jump', props.row, props.col, {relative: true, direction: false});
        case 'Delete':
            emit('update', props.row, props.col, '');
            break;
        case 'Up':
        case 'Down':
        case 'Left':
        case 'Right':
            emit('jump', props.row, props.col, {relative: false, direction: key});
            break;
        default:
            if (e.key.length === 1) {
                emit('update', props.row, props.col, key);
                emit('jump', props.row, props.col, {relative: true, direction: true});
            }
            break;
    }
}

function flip() {
    if (alreadyFocused) {
        emit('flip');
    }
}
</script>

<template>
    <p>
        <span>{{ number }}</span>
        <input
            v-model="model"
            maxlength="1"
            :name="name"
            :data-row="row"
            :data-col="col"
            @keydown.prevent="jump"
            @mousedown="flip"
            @focusin="() => { alreadyFocused = true; }"
            @focusout="() => { alreadyFocused = false; }"
        />
    </p>
</template>

<style scoped>
    p {
        position: relative;
        margin: 0;
        padding: 0;
        aspect-ratio: 1;
    }

    span {
        position: absolute;
        font-size: x-small;
        font-weight: bold;
        top: -2px;
        z-index: 1;
    }

    input {
        outline: none;
        border: 1px solid black;
        display: inline-block;
        background-color: v-bind('$props.color');

        position: relative;
        aspect-ratio: 1;
        box-sizing: border-box;
        width: 100%;
        height: 100%;

        text-align: center;
        text-transform: uppercase;
        font-size: x-large;

        &:focus{
            outline: none;
            box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
            caret-color: transparent;
        }
    }
</style>
