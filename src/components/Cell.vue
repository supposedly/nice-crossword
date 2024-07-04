<script setup lang="ts">


const props = withDefaults(defineProps<{name: string, row: number, col: number, number: number | null}>(), {name: 'grid'});
const model = defineModel<string>();
const emit = defineEmits(['update', 'jump', 'flip']);

let alreadyFocused = false;

function jump(e: KeyboardEvent) {
    let key = e.key.replace(/^Arrow/, '').trim();
    switch (key) {
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
        left: 1px;
        top: -4px;
        font-size: small;
        margin: 0;
        padding: 0;
    }

    input {
        display: block;
        position:relative;
        aspect-ratio: 1;
        margin: 0;
        width: 100%;
        height: 100%;

        text-align: center;
        text-transform: uppercase;

        &:focus{
            outline: none;
            background-color: #eee;
            caret-color: transparent;
        }
    }
</style>
