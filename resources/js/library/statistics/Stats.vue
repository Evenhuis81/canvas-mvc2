<template>
    <div id="stat-container"></div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {initialize, resources} from '../';
import statistics from '.';

// containerID: string;
// full: boolean; // full tab (innerWidth, innerHeight)
const settings = {
    width: 480,
    height: 320,
    backgroundColor: 'black',
    center: true,
    clear: true,
    containerID: 'stat-container',
};

onMounted(() => {
    const resourceID = 'statistics';

    initialize(resourceID, settings);

    const resource = resources[resourceID];

    console.log(resources);
});
</script>
