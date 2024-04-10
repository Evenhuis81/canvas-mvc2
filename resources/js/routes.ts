import type {RouteRecordRaw} from 'vue-router';

// import Home from 'pages/Home.vue';
import Test from 'pages/Test.vue';

export const routes: RouteRecordRaw[] = [
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Home',
    //     meta: {
    //         shouldBeLoggedIn: false,
    //     },
    // },
    {
        path: '/',
        component: Test,
        name: 'Test',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
];
