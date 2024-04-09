import type {RouteRecordRaw} from 'vue-router';

import Detail from 'pages/users/Detail.vue';
import Edit from 'pages/users/Edit.vue';
import Index from 'pages/registrations/Overview.vue';
import Invitations from 'pages/invitations/Overview.vue';
import Login from 'pages/auth/Login.vue';
import NewPassword from 'pages/auth/NewPassword.vue';
import Overview from 'pages/users/Overview.vue';
import Register from 'pages/users/Register.vue';
import RegisterAsAdmin from 'pages/users/RegisterAsAdmin.vue';
import RequestPasswordReset from 'pages/auth/RequestPasswordReset.vue';

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Login,
        name: 'Login',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/request-password-reset',
        component: RequestPasswordReset,
        name: 'RequestPasswordReset',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/reset-password/:token',
        component: NewPassword,
        name: 'NewPassword',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/user-overview',
        component: Overview,
        name: 'Users.Overview',
        meta: {
            shouldBeLoggedIn: true,
        },
    },
    {
        path: '/registrations',
        component: Index,
        name: 'Registrations.Overview',
        meta: {
            shouldBeLoggedIn: true,
        },
    },
    {
        path: '/edit-user/:userId',
        component: Edit,
        name: 'Users.Edit',
        meta: {
            shouldBeLoggedIn: true,
        },
    },
    {
        path: '/register-admin/:hash',
        component: RegisterAsAdmin,
        name: 'Users.RegisterAsAdmin',
        meta: {
            shouldBeLoggedIn: false,
        },
    },
    {
        path: '/show-user/:userId',
        component: Detail,
        name: 'Users.Detail',
        meta: {
            shouldBeLoggedIn: true,
        },
    },
    {
        path: '/register-user',
        component: Register,
        name: 'Users.Register',
        meta: {
            shouldBeLoggedIn: true,
        },
    },
    {
        path: '/invitations',
        component: Invitations,
        name: 'Users.Invitations',
        meta: {
            shouldBeLoggedIn: true,
        },
    },
];
