<template>
    <div v-if="user" class="container-fluid content">
        <div class="d-flex justify-content-between align-items-center">
            <h1>Profiel {{ user.first_name + ' ' + user.last_name }}</h1>
        </div>

        <div class="row">
            <div class="col-md-8">
                <dl>
                    <dt>Voornaam</dt>
                    <dd>{{ user.first_name }}</dd>
                    <dt>Achternaam</dt>
                    <dd>{{ user.last_name }}</dd>
                    <dt>E-mailadres</dt>
                    <dd>{{ user.email }}</dd>
                </dl>
                <div>
                    <router-link
                        class="btn btn-primary"
                        :to="{
                            name: 'Users.Edit',
                            params: {userId: userId},
                        }"
                    >
                        Bewerken
                    </router-link>
                    <button
                        v-if="!userIsAdmin && !userIsInvited"
                        type="button"
                        class="btn btn-primary"
                        @click="showInviteAdminModal"
                    >
                        Uitnodigen als beheerder
                    </button>
                    <button v-if="userIsInvited || userIsAdmin" type="button" class="btn btn-primary" disabled>
                        Uitgenodigd als beheerder
                    </button>
                    <button
                        v-if="userIsInvited && !userIsAdmin"
                        type="button"
                        class="btn btn-primary"
                        @click="showInviteAdminModal"
                    >
                        Opnieuw uitnodigen als beheerder
                    </button>
                </div>
            </div>
            <div class="col-md-4">
                <h4>Kaarten</h4>
                <div v-for="(card, index) in cards" :key="index" class="card access-card shadow-sm mt-3">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">{{ card.card_number }}</h5>
                        <div class="buttons text-end">
                            <button class="btn btn-secondary btn-sm" @click="showDeleteCardModal(card)">
                                Ontkoppelen
                            </button>
                        </div>
                    </div>
                </div>

                <hr />

                <div class="card access-card add-card bg-light" @click="showAddCardModal">
                    <div class="card-body d-flex align-items-center justify-content-center">
                        <div class="text-center">
                            <i class="bi bi-plus-circle" />
                            <h5 class="card-title text-center">nieuwe kaart koppelen</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <add-card-modal v-model="displayAddCardModal" :user="user" />
        <InviteAdminModal v-model="displayInviteAdminModal" :user="user" />
        <DeleteCardModal v-model="displayDeleteCardModal" :card="clickedCard" />
    </div>
</template>

<script setup lang="ts">
import AddCardModal from 'components/AddCardModal.vue';
import DeleteCardModal from 'components/DeleteCardModal.vue';
import InviteAdminModal from 'components/InviteAdminModal.vue';

import {computed, onBeforeMount, ref} from 'vue';
import {useRoute} from 'vue-router';

import {Card} from 'types/index';
import {cardStore} from 'store/cards';
import {userStore} from 'store/users';
import useAdminInvitationStore from 'store/adminInvitations.js';

const adminInvitationStore = useAdminInvitationStore();

const route = useRoute();

const userId = ref(+route.params.userId);
const displayAddCardModal = ref(false); // don't show addCardModal on page load
const displayInviteAdminModal = ref(false); // don't show InviteAdminModal on page load
const displayDeleteCardModal = ref(false);

const cards = computed(() => cardStore.getters.all.value);
const user = computed(() => userStore.getters.byId(userId.value).value);
const clickedCard = ref();

const userIsInvited = computed(() => adminInvitationStore.getByUserId.value(userId.value).length > 0);

const userIsAdmin = computed(() => {
    if (user.value && user.value.roles) return user.value.roles.some(role => role.name === 'Admin');

    return null;
});

const showAddCardModal = () => {
    displayAddCardModal.value = true;
};

const showInviteAdminModal = () => {
    displayInviteAdminModal.value = true;
};

const showDeleteCardModal = (card: Card) => {
    clickedCard.value = card;
    displayDeleteCardModal.value = true;
};

onBeforeMount(async () => {
    cardStore.setters.deleteAll();
    await cardStore.actions.getAllByUserId(userId.value);
    await userStore.actions.getById(userId.value);
    adminInvitationStore.setAll();
});
</script>

<style>
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

.btn {
    margin: 2px;
}

.access-card {
    min-height: 180px;
}
.add-card {
    cursor: pointer;
}

.add-card:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
