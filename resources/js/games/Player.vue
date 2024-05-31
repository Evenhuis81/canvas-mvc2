<template>
    <div id="container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import game from './player';

onMounted(() => {
    game.setup();

    game.run();
});
</script>
