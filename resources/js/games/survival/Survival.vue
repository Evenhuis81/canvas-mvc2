<template>
    <div id="survival-container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import survival from './survival';

onMounted(() => {
    survival.setup();

    survival.run();
});
</script>
