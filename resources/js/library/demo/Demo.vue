<template>
    <div id="demo-container" />
</template>

<script setup lang="ts">
import demo from 'library/demo';
import {onMounted} from 'vue';

window.log = (param1: any) => {
    console.log(param1);
};

onMounted(() => {
    // console.log(window.devicePixelRatio);

    demo.setup();

    demo.run();
});
</script>
