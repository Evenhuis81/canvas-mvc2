<template>
    <div id="timedash-container" />
    <!-- <button @click="asdf" /> -->
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import timedash from './timedash';

// const asdf = () => {
//     console.log(localStorage.test);
// };

// localStorage.setItem('test', 'test');

onMounted(() => {
    timedash.setup();

    timedash.run();
});
</script>
