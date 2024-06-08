<template>
    <div id="container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import library from 'library/index';

onMounted(() => {
    const {initialize, runDemo} = library;

    initialize('demo', 'container');

    runDemo('demo');
});
</script>
