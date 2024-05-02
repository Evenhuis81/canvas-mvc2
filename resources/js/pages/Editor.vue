<template>
    <div id="container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import editor from '../tombraid/editor';

onMounted(() => {
    editor.setup();

    editor.run();
});
</script>
