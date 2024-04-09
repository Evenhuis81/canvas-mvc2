<template>
    <div class="container-fluid content">
        <h1>Uitnodigingen</h1>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th class="col-1" @click="sortBy('invited_user.full_name')">
                        Naam
                        {{ sortBy === 'invited_user.full_name' ? ' &#8597;' : '' }}
                    </th>
                    <th class="col-1" @click="sortBy('invited_user.email')">
                        E-mail
                        {{ sortBy === 'invited_user.email ' ? ' &#8597;' : '' }}
                    </th>
                    <th class="col-1" @click="sortBy('expiration_date')">
                        Verloop datum
                        {{ sortBy === 'expiration_date' ? ' &#8597;' : '' }}
                    </th>
                    <th class="col-1" @click="sortBy('expired')">
                        Verlopen {{ sortBy === 'expired' ? ' &#8597;' : '' }}
                    </th>
                    <th class="col-1" @click="sortBy('accepted')">
                        Geaccepteerd
                        {{ sortBy === 'accepted' ? ' &#8597;' : '' }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(invitation, index) in invitations" :key="index">
                    <td class="col-1">
                        {{ invitation.invited_user.full_name }}
                    </td>
                    <td class="col-1">
                        {{ invitation.invited_user.email }}
                    </td>
                    <td>{{ invitation.expiration_date }}</td>
                    <td :class="[invitation.expired === 1 ? 'table-danger' : 'table-success']">
                        {{ invitation.expired === 1 ? 'ja' : 'nee' }}
                    </td>
                    <td :class="[invitation.accepted === 1 ? 'table-success' : 'table-danger']">
                        {{ invitation.accepted === 1 ? 'ja' : 'nee' }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import {onMounted, ref, watchEffect} from 'vue';
import useAdminInvitationStore from 'store/adminInvitations';

const adminInvitationStore = useAdminInvitationStore();

const invitations = ref({});
const sort = ref({
    by: 'id',
    ascending: true,
});

watchEffect(() => {
    invitations.value = [...adminInvitationStore.getAll.value].sort((a, b) => {
        if (sort.value.ascending) {
            return sort.value.by.split('.').reduce((previous, current) => (previous && previous[current]) || null, a) >=
                sort.value.by.split('.').reduce((previous, current) => (previous && previous[current]) || null, b)
                ? 1
                : -1;
        }

        return sort.value.by.split('.').reduce((previous, current) => (previous && previous[current]) || null, a) <=
            sort.value.by.split('.').reduce((previous, current) => (previous && previous[current]) || null, b)
            ? 1
            : -1;
    });
});

const sortBy = by => {
    sort.value.ascending = !sort.value.ascending.lue;
    sort.value.by = by;
};

onMounted(() => {
    adminInvitationStore.setAll();
});
</script>

<style scoped>
.center {
    margin: 0 auto;

    max-width: 50em;
}

table {
    border: 2px solid lightgray;

    text-align: left;
}

th,
td {
    padding: 1em 1em;

    border: 1px solid lightgray;

    text-align: left;
}

.align-right {
    text-align: right;
}
</style>
