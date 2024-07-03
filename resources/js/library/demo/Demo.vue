<template>
    <div id="demo-container" />
</template>

<script setup lang="ts">
import demo from 'library/demo';
import {onMounted} from 'vue';

onMounted(() => {
    demo.setup();

    demo.run();
});
</script>
