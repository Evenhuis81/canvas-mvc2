<template>
    <div>Fonts</div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {getDetector, loadFont} from './font';

onMounted(async () => {
    await loadFont('OpenS', 'OpenSans-VariableFont_wdth,wght.ttf');

    const detector = getDetector();

    // console.log(detector.detect('monospace'));
});
</script>
