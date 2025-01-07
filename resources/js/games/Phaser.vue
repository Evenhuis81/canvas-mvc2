<template>
    <div id="phaser-container" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import phaser from './phaser';

onMounted(() => phaser().runEngine());
</script>
