<template>
    <div id="container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import loon from './loon';

onMounted(() => {
    // set store here or in index.ts ??
    loon.setup();

    loon.run();
});
</script>
