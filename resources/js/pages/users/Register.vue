<template>
    <div class="container-fluid content">
        <div class="d-flex justify-content-between align-items-center">
            <h1>Nieuwe gebruiker</h1>
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
                    <router-link
                        type="button"
                        class="btn btn-light"
                        :to="{
                            name: 'Users.Overview',
                        }"
                    >
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
import {goToRoute} from 'services/router';
import {ref} from 'vue';
import {useToast} from 'vue-toastification';
import {userStore} from 'store/users';
import useErrorStore from 'store/errors.js';

const errorStore = useErrorStore();

const userDetails = ref<User>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    roles: [{name: 'role', id: 0}],
});

const submitted = ref(false);

const handleSubmit = async () => {
    submitted.value = true;
    const toast = useToast();

    try {
        await userStore.actions.create(userDetails.value);

        goToRoute('Users.Overview');

        toast.success('Gelukt, de gebruiker is toegevoegd', {
            timeout: 2000,
        });
    } catch (error) {
        toast.error('Er is een fout opgetreden tijdens het toevoegen van de nieuwe gebruiker', {
            timeout: 2000,
        });
    }
};
</script>

<style></style>
