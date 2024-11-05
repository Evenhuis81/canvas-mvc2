<template>
    <div id="stat-container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import tombraid from './tombraid';

onMounted(() => {
    tombraid.setup();

    tombraid.run();
});
</script>
