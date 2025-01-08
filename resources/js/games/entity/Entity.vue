<template>
    <div id="entity-demo-container"></div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import entityDemo from '../../library/entity/demo';

onMounted(() => entityDemo().runEngine());
</script>
