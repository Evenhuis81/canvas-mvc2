<template>
    <form class="form-signin" @submit.prevent="handleSubmit">
        <img class="mb-4" :src="'/logo.svg'" alt="TimeInsight" width="250" height="57" />
        <h1 class="h3 mb-3 fw-normal">Inloggen</h1>
        <div class="form-floating">
            <input
                id="floatingInput"
                v-model="credentials.email"
                required
                type="email"
                class="form-control"
                placeholder="name@example.com"
            />
            <label for="floatingInput">E-mailadres</label>
        </div>
        <div class="form-floating">
            <input
                id="floatingPassword"
                v-model="credentials.password"
                required
                type="password"
                class="form-control"
                placeholder="Wachtwoord"
            />
            <label for="floatingPassword">Wachtwoord</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary mb-3" type="submit">Inloggen</button>

        <router-link :to="{name: 'RequestPasswordReset'}">Wachtwoord vergeten</router-link>
    </form>
</template>

<script setup lang="ts">
import {goToRoute} from 'services/router';
import {login} from 'store/auth';
import {reactive} from 'vue';
import {useToast} from 'vue-toastification';

const credentials = reactive({
    email: '',
    password: '',
});

const handleSubmit = async () => {
    const toast = useToast();

    try {
        await login(credentials);

        toast.success('Inloggen gelukt, je wordt doorgestuurd', {
            timeout: 2000,
        });

        goToRoute('Registrations.Overview');
    } catch (error) {
        toast.error('Inloggen mislukt, controleer je login gegevens, of reset je wachtwoord', {
            timeout: 2000,
        });
    }
};
</script>

<style>
.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
    text-align: center;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type='email'] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type='password'] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
</style>
