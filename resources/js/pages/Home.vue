<template>
    <div v-for="link in links" :key="link.title">
        <a :href="link.href">{{ link.title }}</a>
    </div>
    <div style="display: flex; justify-content: center; align-items: center">
        <button id="hello-button" @click="goToRoute('Hello')">Hello</button>
        <button style="font-size: 2rem; position: absolute; bottom: 50px" @click="goToRoute('Demo')">Demo</button>
    </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from 'vue';
import {routes} from '../routes';
import {goToRoute} from 'services/router';
import {RouteRecordRaw} from 'vue-router';
import {loadFont} from 'library/font/font';

const noLinkRoutes = ['Home', 'Demo', 'Stats'];
const condition = ({name}: RouteRecordRaw) => noLinkRoutes.find(route => route === name);

const createLinksFromRoutes = () => {
    const routeToLinks = [];
    for (const route of routes) {
        if (condition(route)) continue;

        routeToLinks.push({
            title: route.name,
            href: route.path,
        });
    }

    return routeToLinks;
};

onMounted(async () => {
    await loadFont('Harmond', 'Harmond-SemiBoldCondensed.otf');
});
// const goTo = (routeName: string) => goToRoute(routeName);

const links = reactive(createLinksFromRoutes());
</script>

<style>
#hello-button {
    position: absolute;
    bottom: 150px;
    font-weight: 900;
    font-size: 4rem;
    font-family: Harmond;
    border-radius: 10%;
    border: 3px solid black;
    background-color: lightyellow;
}
</style>
