<template>
    <div id="tr-container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import tombraid from './tombraid';

onMounted(() => {
    tombraid();
});
</script>
