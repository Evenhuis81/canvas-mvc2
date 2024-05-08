import type {RouteRecordRaw} from 'vue-router';

import Home from 'pages/Home.vue';
import TR from 'games/TR.vue';

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
        component: TR,
        name: 'TombRaid',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
];
