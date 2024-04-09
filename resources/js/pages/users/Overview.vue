<template>
    <div class="container-fluid content">
        <div class="d-flex justify-content-between align-items-center">
            <h1>Gebruikers</h1>
            <pagination
                :current-page="currentPage"
                :last-page="lastPage"
                :per-page="perPage"
                :max-visible-buttons="3"
                @page-changed="onPageChange"
            />
            <router-link class="btn btn-primary" :to="{name: 'Users.Register'}">Gebruiker toevoegen</router-link>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th @click="sortBy('id')">Id {{ sort.by === 'id' ? ' &#8597;' : '' }}</th>
                    <th @click="sortBy('first_name')">Naam {{ sort.by === 'first_name' ? ' &#8597;' : '' }}</th>
                    <th @click="sortBy('email')">E-mailadres {{ sort.by === 'email' ? ' &#8597;' : '' }}</th>
                    <th />
                    <th />
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users" :key="index">
                    <td>{{ user.id }}</td>
                    <td>
                        {{ user.first_name }}
                        <span v-if="user.roles.some(role => role.name === 'Admin')" class="badge bg-secondary">
                            beheerder
                        </span>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>
                        <router-link
                            class="btn btn-secondary btn-sm"
                            title="Bekijken"
                            :to="{
                                name: 'Users.Detail',
                                params: {userId: user.id},
                            }"
                        >
                            <i class="bi bi-arrow-up-right-circle" />
                            Bekijken
                        </router-link>
                    </td>
                    <td>
                        <button
                            class="btn btn-danger btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-user-confirmation"
                            @click="userDataForModal(user)"
                        >
                            <i class="bi bi-trash" />
                            Verwijderen
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="delete-user-confirmation" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">Gebruiker verwijderen</h5>
                    </div>
                    <div class="modal-body">
                        <p>Weet je zeker dat je gebruiker '{{ userData.first_name }}' wilt verwijderen?</p>
                    </div>
                    <div class="modal-footer border-0">
                        <form @submit.prevent="deleteUser(userData.id)">
                            <button
                                type="button"
                                class="btn btn-primary"
                                data-bs-dismiss="modal"
                                @click="deleteUser(userData.id)"
                            >
                                Ja
                            </button>
                        </form>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuleren</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {User} from 'types/index';
import {computed, ref, watchEffect} from 'vue';
import {deleteUserClientSide, getLoggedInUserId} from 'store/auth';
import {goToRoute} from 'services/router';
import {paginationStore} from 'store/pagination';
import {useToast} from 'vue-toastification';
import {userStore} from 'store/users';
import Pagination from 'components/Paginator.vue';

const userData = ref<User>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    roles: [{name: 'role', id: 0}],
});

const sort = ref({
    by: 'id',
    asc: true,
});

const currentPage = ref(1);
const lastPage = computed(() => paginationStore.getters.byId('lastPage').value);
const perPage = computed(() => paginationStore.getters.byId('perPage').value);

watchEffect(async () => {
    paginationStore.setters.by('sortBy', sort.value.by);
    paginationStore.setters.by('asc', sort.value.asc);
    paginationStore.setters.by('page', currentPage.value);
    userStore.setters.deleteAll();
    await userStore.actions.getAll();
});

const users = computed(() => userStore.getters.all.value);

const sortBy = (by: string) => {
    if (by === sort.value.by) {
        sort.value.asc = !sort.value.asc;
        currentPage.value = 1;
    } else {
        sort.value.by = by;
        currentPage.value = 1;
        sort.value.asc = true;
    }
};

const onPageChange = (page: number) => {
    currentPage.value = page;
};

const userDataForModal = (user: User) => {
    userData.value = user;
};

const deleteUser = async (id: number) => {
    const toast = useToast();

    try {
        await userStore.actions.delete(id);

        if (id === getLoggedInUserId()) {
            deleteUserClientSide();

            goToRoute('Login');
        }

        toast.success('Het verwijderen van de gebruiker is gelukt', {
            timeout: 2000,
        });
    } catch (error) {
        toast.error('Het verwijderen van de gebruiker is niet gelukt', {
            timeout: 2000,
        });
    }
};
</script>

<style>
.pagination {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
table {
    table-layout: fixed;
}
.content {
    overflow-y: scroll;
}
tr .btn {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}
tr:hover .btn {
    opacity: 1;
}
th:hover {
    cursor: pointer;
}
</style>
