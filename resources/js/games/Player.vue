<template>
    <div id="container" />
</template>

<script setup lang="ts">
// import {getContainer} from './library/canvas';
import {onMounted} from 'vue';
import game from './player';

onMounted(() => {
    // game.setup(getContainer('container'));

    game.run();
});
</script>
