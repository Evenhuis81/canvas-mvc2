<template>
    <div id="container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import tombraid from './tombraid';

onMounted(() => {
    tombraid.setup();

    tombraid.runOnce();
});
</script>
