<template>
    <div ref="deleteCardModal" class="modal fade" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title">Kaart ontkoppelen</h5>
                </div>

                <div class="modal-body">
                    <p>Weet je zeker dat je deze kaart wilt ontkoppelen?</p>
                </div>

                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-primary" @click="deleteCard()">Ja</button>

                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuleren</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {Modal} from 'bootstrap';
import {cardStore} from '../store/modules/cards';
import {onMounted, ref, watchEffect} from 'vue';
import {useToast} from 'vue-toastification';

const modal = ref(null);
const deleteCardModal = ref(null); // the DOM element will be assigned to the ref after initial render
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    card: {type: Number, default: 0},
    modelValue: {
        // display
        type: Boolean,
        value: false,
    },
});

watchEffect(() => (props.modelValue ? modal.value.toggle() : false));

onMounted(() => {
    modal.value = new Modal(deleteCardModal.value, {});

    deleteCardModal.value.addEventListener('hidden.bs.modal', () => {
        emit('update:modelValue', false);
    });
});

const deleteCard = async () => {
    const toast = useToast();

    try {
        await cardStore.actions.delete(props.card.card_number);

        toast.success('Het verwijderen van de kaart is gelukt', {
            timeout: 2000,
        });
    } catch (error) {
        toast.error('Het verwijderen van de kaart is niet gelukt', {
            timeout: 2000,
        });
    }

    modal.value.toggle();
};
</script>
