<template>
    <div id="timedash-container" />
</template>

<script setup lang="ts">
import timedash from './timedash';
import {onMounted} from 'vue';

onMounted(() => {
    timedash.setup();

    timedash.run();
});
</script>
