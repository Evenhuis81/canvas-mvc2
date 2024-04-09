<template>
    <div
        v-if="user"
        ref="linkCardModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="linkCardLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title">Uitnodigen als beheerder</h5>
                </div>

                <div class="modal-body">
                    Weet je zeker dat je
                    {{ user.first_name + ' ' + user.last_name }} wilt uitnodigen als beheerder?
                </div>

                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-primary" @click="inviteAsAdmin()">Ja</button>

                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuleren</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {Modal} from 'bootstrap';
import {onMounted, ref, watch} from 'vue';
import {useToast} from 'vue-toastification';
import useAdminInvitationStore from '../store/modules/adminInvitations';

const adminInvitationStore = useAdminInvitationStore();

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    modelValue: {
        // display
        type: Boolean,
        value: false,
    },
});

const emit = defineEmits(['update:modelValue']);

const linkCardModal = ref(null);
const modal = ref(null);

watch(
    () => props.modelValue,
    value => {
        if (value === true) toggleModal();
    },
);

onMounted(() => {
    modal.value = new Modal(linkCardModal.value, {
        keyboard: false,
    });

    linkCardModal.value.addEventListener('hidden.bs.modal', () => {
        emit('update:modelValue', false);
    });
});

const toggleModal = () => {
    modal.value.toggle();
};

const inviteAsAdmin = async () => {
    const toast = useToast();

    try {
        await adminInvitationStore.invite(props.user.id);

        toast.success('Deze gebruiker is uitgenodigd als beheerder', {
            timeout: 2000,
        });
    } catch (error) {
        toast.error('Uitnodigen van gebruiker als beheerder mislukt', {
            timeout: 2000,
        });
    }

    toggleModal();
};
</script>
