<template>
    <div id="reverse-container" />
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import reverse from './index';

onMounted(() => reverse());
</script>
