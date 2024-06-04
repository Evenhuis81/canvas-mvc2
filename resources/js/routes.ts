import Home from 'pages/Home.vue';
import type {RouteRecordRaw} from 'vue-router';

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home,
        name: 'Home',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/tr',
        component: () => import('./games/TR.vue'),
        name: 'TombRaid',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/loon',
        component: () => import('./games/Loon.vue'),
        name: 'Loon',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/player',
        component: () => import('./games/Player.vue'),
        name: 'player',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/dev',
        component: () => import('./Dev.vue'),
        name: 'dev',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
];
