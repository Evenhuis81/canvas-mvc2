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
        name: 'Player',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/demo',
        component: () => import('./library/demo/Demo.vue'),
        name: 'Demo',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/font',
        component: () => import('./library/font/Font.vue'),
        name: 'Font',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/survival',
        component: () => import('./games/survival/Survival.vue'),
        name: 'Survival',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/train',
        component: () => import('./games/train/Train.vue'),
        name: 'Train Game',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/entity',
        component: () => import('./games/entity/Entity.vue'),
        name: 'Entity Demo',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/phaser',
        component: () => import('./games/Phaser.vue'),
        name: 'Phaser',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/reverse',
        component: () => import('./games/reverse/Reverse.vue'),
        name: 'Reverse Gravity',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/dam',
        component: () => import('./games/D/Dam.vue'),
        name: 'Dam',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    // {
    //     path: '/statistics',
    //     component: () => import('./library/Statistics.vue'),
    //     name: 'Stats',
    //     meta: {
    //         shouldBeLoggedIn: false,
    //     },
    // },
];
