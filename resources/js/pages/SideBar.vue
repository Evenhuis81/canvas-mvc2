<template>
    <div class="d-flex flex-column flex-shrink-0 p-3 bg-light shadow sidebar">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
            <img class="logo mb-4" :src="'/logo.svg'" alt="TimeInsight" />
        </a>
        <hr />
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item">
                <router-link
                    :class="$route.name == 'Users.Overview' ? 'nav-link active' : 'nav-link link-dark'"
                    aria-current="page"
                    :to="{name: 'Users.Overview'}"
                >
                    <i class="bi bi-people" />
                    <span class="menu-text">Gebruikers</span>
                </router-link>
            </li>
            <li>
                <router-link
                    :class="$route.name == 'Registrations.Overview' ? 'nav-link active' : 'nav-link link-dark'"
                    :to="{name: 'Registrations.Overview'}"
                >
                    <i class="bi bi-stopwatch" />
                    <span class="menu-text">Tijdregistraties</span>
                </router-link>
            </li>
            <li>
                <router-link
                    :class="$route.name == 'Users.Invitations' ? 'nav-link active' : 'nav-link link-dark'"
                    :to="{name: 'Users.Invitations'}"
                >
                    <i class="bi bi-envelope" />
                    <span class="menu-text">Uitnodigingen</span>
                </router-link>
            </li>
        </ul>
        <hr />
        <div class="dropdown">
            <a
                id="dropdownUser2"
                href=""
                class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <strong>{{ user.first_name }}</strong>
            </a>
            <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                <li>
                    <router-link
                        class="dropdown-item"
                        :to="{
                            name: 'Users.Detail',
                            params: {userId: user.id},
                        }"
                    >
                        Mijn Profiel
                    </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                    <a class="dropdown-item" href="" @click.prevent="handleSubmit">Log uit</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import {goToRoute} from 'services/router';
import {logout, getLoggedInUser as user} from 'store/auth';
import {useToast} from 'vue-toastification';

const handleSubmit = async () => {
    await logout();

    const toast = useToast();

    toast.success('Je bent uitgelogd', {
        timeout: 2000,
    });

    goToRoute('Login');
};
</script>

<style>
.sidebar {
    min-height: 100vh;
    width: 80px;
}
.logo {
    width: 100%;
    width: 180px;
}
.menu-text {
    display: none;
    position: absolute;
}
.nav-link {
    position: relative;
}
.nav-link:hover .menu-text {
    display: inline;
    background-color: #f8f9fa;
    padding: 0.5rem;
    font-size: 0.85rem;
    color: #333;
    left: calc(100% + 20px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    border-radius: 0.5rem;
    top: 50%;
    margin-top: -18px;
}

@media (min-width: 768px) {
    .menu-text {
        display: inline;
        margin-left: 0.5rem;
    }
    .sidebar {
        width: auto;
    }
    .nav-link:hover .menu-text {
        background-color: transparent;
        padding: 0;
        font-size: 1rem;
        color: inherit;
        left: initial;
        box-shadow: none;
        border-radius: 0;
        top: initial;
        margin-top: 0;
    }
}
</style>
