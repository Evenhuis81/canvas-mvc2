<template>
    <div v-for="link in links" :key="link.title">
        <a :href="link.href">{{ link.title }}</a>
    </div>
    <div style="display: flex; justify-content: center; align-items: center">
        <button style="font-size: 2rem; position: absolute; bottom: 200px" @click="openWindowCustom()">
            Statistics
        </button>
    </div>
    <div style="display: flex; justify-content: center; align-items: center">
        <button style="font-size: 2rem; position: absolute; bottom: 50px" @click="goTo('Demo')">Demo</button>
    </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue';
import {routes} from '../routes';
import {goToRoute} from 'services/router';
import {RouteRecordRaw} from 'vue-router';
import {createWindowOpener} from './window-open';

const noLinkRoutes = ['Home', 'Demo', 'Stats'];
const condition = ({name}: RouteRecordRaw) => noLinkRoutes.find(route => route === name);

const {openWindowCenter} = createWindowOpener('statistics', {width: 480, height: 320});

const openWindowCustom = () => openWindowCenter();

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

const goTo = (routeName: string) => goToRoute(routeName);

const links = reactive(createLinksFromRoutes());
</script>
