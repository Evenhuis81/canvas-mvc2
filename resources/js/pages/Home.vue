<template>
    <div v-for="link in links" :key="link.title">
        <a :href="link.href">{{ link.title }}</a>
    </div>
</template>

<script setup lang="ts">
const links = [
    {
        title: 'TombRaid',
        href: '/tr',
    },
    {
        title: 'Loon',
        href: '/loon',
    },
    {
        title: 'Player',
        href: '/player',
    },
];
</script>
