<template>
    <div id="container" />
</template>

<script setup lang="ts">
import {initialize} from 'library/index';
import {onMounted} from 'vue';

onMounted(() => {
    initialize('container');

    // runDemo();
});
</script>
