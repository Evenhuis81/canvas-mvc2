<template>
    <div id="container"></div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import statisticResrouce from '.';

onMounted(() => {
    statisticResrouce.setup();
    statisticResrouce.run();

    console.log('stats.vue mounted');
});
</script>
