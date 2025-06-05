<template>
    <div id="dam-container" />
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import dam from './index';

onMounted(() => dam());
</script>
