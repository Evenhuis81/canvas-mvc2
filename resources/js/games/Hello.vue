<template>
    <div id="hello-container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import hello from './hello';

onMounted(() => {
    hello.setup();

    hello.runEngine();

    hello.startPhase(1);
});
</script>
