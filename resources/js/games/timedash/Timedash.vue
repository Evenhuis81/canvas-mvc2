<template>
    <div id="timedash-container" />
</template>

<script setup lang="ts">
import timedash from './timedash';
import {onMounted} from 'vue';
import axios from 'axios';

onMounted(() => {
    timedash.setup();

    timedash.run();
});
</script>
