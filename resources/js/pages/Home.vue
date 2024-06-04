<template>
    <div v-for="link in links" :key="link.title">
        <a :href="link.href">{{ link.title }}</a>
    </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue';
import {routes} from '../routes';

const createLinksFromRoutes = () => {
    const routeToLinks = [];
    for (const route of routes) {
        if (route.name === 'Home') continue;

        routeToLinks.push({
            title: route.name,
            href: route.path,
        });
    }

    return routeToLinks;
};

const links = reactive(createLinksFromRoutes());
</script>
