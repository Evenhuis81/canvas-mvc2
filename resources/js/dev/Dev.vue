<template>
    <div id="container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import dev from './index';

onMounted(() => {
    dev.setup();

    dev.run();
});
</script>
