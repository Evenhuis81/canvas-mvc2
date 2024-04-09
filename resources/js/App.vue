<template>
    <main>
        <SideBar v-if="isLoggedIn" />
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import {isLoggedIn} from 'store/auth';
import SideBar from './pages/SideBar.vue';
</script>

<style>
html,
body {
    height: 100%;
    background-color: #f5f5f5;
    align-items: center;
}
main {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    height: 100vh;
    height: -webkit-fill-available;
    max-height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
}
button {
    margin: 4px;
}
.invalid-feedback {
    width: 100%;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
    font-size: 80%;
    color: #e3342f;
}
</style>
