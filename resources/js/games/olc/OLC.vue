<template>
    <div id="shmup-container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import shmup from './shmup';

onMounted(() => {
    shmup().run();
});
</script>
