<template>
    <div id="stat-container"></div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {initialize, resources} from '../';
import statistics from '.';

onMounted(() => {
    // statistics.createPopup();
    // const resourceID = 'statistics';
    // initialize(resourceID, settings);
    // const resource = resources[resourceID];
    // resource.tv.strokeRect({x: 0, y: 0, w: 480, h: 320, lw: 2, stroke: 'red'});
});
</script>
