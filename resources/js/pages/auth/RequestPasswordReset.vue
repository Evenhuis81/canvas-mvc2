<template>
    <form class="form-forgot-password" @submit.prevent="handleSubmit">
        <img class="mb-4" :src="'/logo.svg'" alt="TimeInsight" width="250" height="57" />
        <h1 class="h3 mb-3 fw-normal">Wachtwoord vergeten</h1>

        <div class="form-floating">
            <input
                id="floatingInput"
                v-model="email"
                required
                type="email"
                class="form-control"
                :class="{
                    'is-invalid': submitted && errorStore.errors.value.hasOwnProperty('email'),
                }"
                placeholder="name@example.com"
            />
            <label for="floatingInput">E-mailadres</label>
            <div v-if="submitted && errorStore.errors.value.hasOwnProperty('email')" class="invalid-feedback">
                {{ errorStore.errors.value.email.join(' ') }}
            </div>
        </div>

        <button class="w-100 btn btn-lg btn-primary mb-3" type="submit">Wachtwoord resetten</button>
        <router-link :to="{name: 'Login'}">Terug naar inloggen</router-link>
    </form>
</template>

<script setup>
import {goToRoute} from 'services/router';
import {ref} from 'vue';
import {requestNewPassword} from 'store/auth';
import {useToast} from 'vue-toastification';
import useErrorStore from 'store/errors.js';

const errorStore = useErrorStore();

const email = ref();
const submitted = ref(false);

const handleSubmit = async () => {
    const toast = useToast();

    try {
        submitted.value = true;

        await requestNewPassword(email.value);

        toast.success('Er is een mail verstuurd met instructies om uw wachtwoord opnieuw in te stellen', {
            timeout: 2000,
        });

        goToRoute('Login');
    } catch (error) {
        toast.error('Het versturen van de e-mail is niet gelukt', {
            timeout: 2000,
        });
    }
};
</script>

<style>
.body {
    height: 100%;
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
}

.form-forgot-password {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
    text-align: center;
}

.form-forgot-password .form-floating:focus-within {
    z-index: 2;
}

.form-forgot-password input[type='email'] {
    margin-bottom: 10px;
}
</style>
