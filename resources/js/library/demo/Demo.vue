<template>
    <div id="demo-container" />
</template>

<script setup lang="ts">
import library from 'library/demo';
import {onMounted} from 'vue';

onMounted(() => {
    library.setup();
});
</script>
