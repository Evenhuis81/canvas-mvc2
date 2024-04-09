<template>
    <div v-if="user" class="container-fluid content">
        <div class="d-flex justify-content-between align-items-center">
            <h1>Profiel {{ user.first_name + ' ' + userDetails.last_name }}</h1>
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
                        <label for="password" class="form-label">Wachtwoord</label>
                        <input
                            id="password"
                            v-model="userDetails.password"
                            required
                            type="password"
                            class="form-control"
                            :class="{
                                'is-invalid': submitted && errorStore.errors.value.hasOwnProperty('password'),
                            }"
                        />
                        <p class="form-text text-muted">
                            Het wachtwoord moet minimaal uit 8 karakters bestaan waarvan minimaal één cijfer, één
                            hoofdletter en één kleine letter.
                        </p>
                        <div
                            v-if="submitted && errorStore.errors.value.hasOwnProperty('password')"
                            class="invalid-feedback"
                        >
                            {{ errorStore.errors.value.password.join(' ') }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="passwordConfirmation" class="form-label">Herhaling wachtwoord</label>
                        <input
                            id="passwordConfirmation"
                            v-model="userDetails.password_confirmation"
                            required
                            type="password"
                            class="form-control"
                            :class="{
                                'is-invalid': submitted && errorStore.errors.value.hasOwnProperty('password'),
                            }"
                        />
                        <div v-if="passwordsNotEqual && submitted" class="alert alert-warning" role="alert">
                            De door u ingevoerde wachtwoorden komen niet overeen
                        </div>
                        <div
                            v-if="submitted && errorStore.errors.value.hasOwnProperty('password')"
                            class="invalid-feedback"
                        >
                            {{ errorStore.errors.value.password.join(' ') }}
                        </div>
                    </div>

                    <button type="button" class="btn btn-primary" @click="handleSubmit()">
                        Registratie bevestigen
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, onBeforeMount, ref} from 'vue';
import {goToRoute} from 'services/router';
import {useRoute} from 'vue-router';
import {useToast} from 'vue-toastification';
import {verifyAuth} from 'store/auth';
import useAdminInvitationStore from 'store/adminInvitations';
import useErrorStore from 'store/errors.js';

const errorStore = useErrorStore();
const adminInvitationStore = useAdminInvitationStore();

const route = useRoute();
const hash = ref(route.params.hash);

const userDetails = ref({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submitted = ref(false);

const user = computed(() => {
    const invitation = adminInvitationStore.getActive.value;

    if (!invitation[0]?.invited_user) return [];

    userDetails.value = JSON.parse(JSON.stringify(invitation[0].invited_user));

    return invitation[0].invited_user;
});

onBeforeMount(() => {
    adminInvitationStore.setByHash(hash.value);
});

const passwordsNotEqual = computed(() => userDetails.value.password !== userDetails.value.password_confirmation);

const handleSubmit = async () => {
    const toast = useToast();
    submitted.value = true;
    if (passwordsNotEqual.value) return;

    try {
        await adminInvitationStore.updateToAdmin(userDetails.value, hash.value);
        await verifyAuth();

        toast.success('Het toekennen van beheerdersrechten is gelukt, je wordt nu automatisch ingelogd', {
            timeout: 2000,
        });
        goToRoute('Registrations.Overview');
    } catch (error) {
        toast.error('Het toekennen van beheerdersrechten is mislukt', {
            timeout: 2000,
        });
    }
};
</script>

<style></style>
