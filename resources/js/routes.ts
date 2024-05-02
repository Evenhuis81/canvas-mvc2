import type {RouteRecordRaw} from 'vue-router';

import Editor from 'pages/Editor.vue';
import Home from 'pages/Home.vue';

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
        path: '/editor',
        component: Editor,
        name: 'Editor',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
];
