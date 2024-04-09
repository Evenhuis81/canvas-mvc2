<template>
    <div v-if="user" class="container-fluid content">
        <div class="d-flex justify-content-between align-items-center">
            <h1>Profiel {{ user.first_name + ' ' + user.last_name }}</h1>
        </div>
        <div class="row">
            <div class="col-md-8">
                <form class="w-75" @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="firstName" class="form-label">Voornaam</label>
                        <input
                            id="firstName"
                            v-model="userDetails.first_name"
                            required
                            type="text"
                            class="form-control"
                            :class="{
                                'is-invalid': submitted && errorStore.errors.value.hasOwnProperty('first_name'),
                            }"
                        />
                        <div
                            v-if="submitted && errorStore.errors.value.hasOwnProperty('first_name')"
                            class="invalid-feedback"
                        >
                            {{ errorStore.errors.value.first_name.join(' ') }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Achternaam</label>
                        <input
                            id="lastName"
                            v-model="userDetails.last_name"
                            required
                            type="text"
                            class="form-control"
                            :class="{
                                'is-invalid': submitted && errorStore.errors.value.hasOwnProperty('last_name'),
                            }"
                        />
                        <div
                            v-if="submitted && errorStore.errors.value.hasOwnProperty('last_name')"
                            class="invalid-feedback"
                        >
                            {{ errorStore.errors.value.last_name.join(' ') }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">E-mailadres</label>
                        <input
                            id="email"
                            v-model="userDetails.email"
                            required
                            type="email"
                            class="form-control"
                            :class="{
                                'is-invalid': submitted && errorStore.errors.value.hasOwnProperty('email'),
                            }"
                        />
                        <div
                            v-if="submitted && errorStore.errors.value.hasOwnProperty('email')"
                            class="invalid-feedback"
                        >
                            {{ errorStore.errors.value.email.join(' ') }}
                        </div>
                    </div>
                    <router-link type="button" class="btn btn-light" :to="{name: 'Users.Overview'}">
                        Annuleren
                    </router-link>
                    <button type="button" class="btn btn-primary" @click="handleSubmit()">Opslaan</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {User} from 'types/index';
import {computed, onBeforeMount, ref} from 'vue';
import {goToRoute} from 'services/router';
import {useRoute} from 'vue-router';
import {useToast} from 'vue-toastification';
import {userStore} from 'store/users';
import useErrorStore from 'store/errors.js';

const errorStore = useErrorStore();

const route = useRoute();
const userId = ref(+route.params.userId);

const userDetails = ref<User>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    roles: [{name: 'role', id: 0}],
});
const submitted = ref(false);
const user = computed(() => userStore.getters.byId(userId.value).value);

onBeforeMount(async () => {
    await userStore.actions.getById(userId.value);
    userDetails.value = JSON.parse(JSON.stringify(user.value));
});

const handleSubmit = async () => {
    const toast = useToast();

    try {
        submitted.value = true;
        await userStore.actions.update(userDetails.value.id, userDetails.value);

        goToRoute('Users.Overview');

        toast.success('Het bewerken van de gebruiker is gelukt', {
            timeout: 2000,
        });
    } catch (error) {
        toast.error('Het bewerken van de gebruiker is niet gelukt', {
            timeout: 2000,
        });
    }
};
</script>

<style></style>
