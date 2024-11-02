<template>
    <div id="stat-container" />
</template>

<script setup lang="ts">
import statistics from 'library/statistics';
import {onMounted} from 'vue';
// import tombraid from './tombraid';

onMounted(() => {
    statistics.createPopup('keyF');
    // tombraid.setup();

    // tombraid.run();
});
</script>
