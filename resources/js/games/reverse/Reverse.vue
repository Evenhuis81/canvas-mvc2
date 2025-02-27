<template>
    <div>DD</div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import createReverse from './index';

onMounted(() => {
    const reverse = createReverse();
});
</script>
