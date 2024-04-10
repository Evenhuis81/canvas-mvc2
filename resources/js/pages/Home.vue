<template>
    <div id="container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {setCanvas} from './canvas';

const canvasOptions = {
    width: 640,
    height: 480,
    backgroundColor: '#000',
    position: 'center',
};

onMounted(() => {
    const {context: ctx} = setCanvas(canvasOptions);

    const animate = () => {
        ctx.clearRect(0, 0, 649, 480);

        ctx.fillStyle = 'red';
        ctx.fillRect(310, 230, 20, 20);

        requestAnimationFrame(animate);
    };

    animate();
});
</script>
