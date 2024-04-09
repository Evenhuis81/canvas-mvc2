<template>
    <form class="form-signin" @submit.prevent="handleSubmit">
        <img class="mb-4" :src="'/logo.svg'" alt="TimeInsight" width="250" height="57" />
        <h1 class="h3 mb-3 fw-normal">Nieuw wachtwoord</h1>

        <div class="form-floating">
            <input
                id="floatingInput"
                v-model="resetDetails.password"
                required
                type="password"
                class="form-control"
                :class="{
                    'is-invalid': submitted && errorStore.errors.value.hasOwnProperty('password'),
                }"
                placeholder="Nieuw wachtwoord"
            />
            <div v-if="submitted && errorStore.errors.value.hasOwnProperty('password')" class="invalid-feedback">
                {{ errorStore.errors.value.password.join(' ') }}
            </div>
            <label for="floatingInput">Nieuw wachtwoord</label>
        </div>
        <div class="form-floating">
            <input
                id="floatingPassword"
                v-model="resetDetails.password_confirmation"
                required
                type="password"
                class="form-control"
                :class="{
                    'is-invalid': submitted && errorStore.errors.value.hasOwnProperty('password'),
                }"
                placeholder="Herhaling nieuw wachtwoord"
            />
            <div v-if="submitted && errorStore.errors.value.hasOwnProperty('password')" class="invalid-feedback">
                {{ errorStore.errors.value.password.join(' ') }}
            </div>
            <label for="floatingPassword">Herhaling nieuw wachtwoord</label>
        </div>

        <div v-if="passwordsNotEqual && submitted" class="alert alert-warning" role="alert">
            De door u ingevoerde wachtwoorden komen niet overeen
        </div>

        <button class="w-100 btn btn-lg btn-primary mb-3" type="submit">Wachtwoord wijzigen</button>

        <router-link :to="{name: 'Login'}">Terug naar login pagina</router-link>
    </form>
</template>

<script setup>
import {computed, ref} from 'vue';
import {goToRoute} from 'services/router';
import {saveNewPassword} from 'store/auth';
import {useRoute} from 'vue-router';
import {useToast} from 'vue-toastification';
import useErrorStore from 'store/errors.js';

const errorStore = useErrorStore();

const route = useRoute();

const resetDetails = ref({
    password: '',
    password_confirmation: '',
    token: route.params.token,
});

const submitted = ref(false);

const handleSubmit = async () => {
    submitted.value = true;
    if (passwordsNotEqual.value) return;

    const toast = useToast();

    try {
        await saveNewPassword(resetDetails.value);

        toast.success('Het wachtwoord is succesvol gewijzigd', {
            timeout: 2000,
        });

        goToRoute('Login');
    } catch (error) {
        toast.error('Er is iets misgegaan tijdens het wijzigen van het wachtwoord', {
            timeout: 2000,
        });
    }
};

const passwordsNotEqual = computed(() => resetDetails.value.password !== resetDetails.value.password_confirmation);
</script>

<style></style>
