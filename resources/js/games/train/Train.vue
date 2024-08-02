<template>
    <div>Train</div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import train from './train';

onMounted(() => {
    train.setup();

    train.run();
});
</script>
