<template>
    <div id="timedash-container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import timedash from './timedash';

onMounted(() => {
    timedash.setup();

    timedash.run();
});
</script>
