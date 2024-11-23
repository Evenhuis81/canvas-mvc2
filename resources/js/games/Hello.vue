<template>
    <div id="hello-container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import hello from './hello';

onMounted(() => {
    hello.setup();

    hello.run();

    hello.start();
});
</script>
