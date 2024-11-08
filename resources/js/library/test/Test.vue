<template>
    <div id="test-container"></div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import test from './index';

onMounted(() => {
    test.setup();

    test.run();
});
</script>
