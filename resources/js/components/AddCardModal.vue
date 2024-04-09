<template>
    <div
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
                    <h5 id="linkCardLabel" class="modal-title mx-auto">Kaart koppelen</h5>
                </div>
                <div class="modal-body text-center">
                    <p class="text-center mb-4">{{ modalMessage }}</p>
                    <circle-timer
                        v-model="timer.isRunning"
                        :duration="timer.duration"
                        :stroke-width="timer.strokeWidth"
                        :radius="timer.radius"
                        :stroke-color="timer.strokeColor"
                    />
                </div>
                <div class="modal-footer border-0">
                    <button :disabled="!timer.isRunning" type="button" class="btn btn-light" data-bs-dismiss="modal">
                        Annuleren
                    </button>
                    <button :disabled="timer.isRunning" type="button" data-bs-dismiss="modal" class="btn btn-primary">
                        Ok
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {Modal} from 'bootstrap';
import {cardStore} from 'store/cards';
import {onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {useToast} from 'vue-toastification';
import CircleTimer from './CircleTimer.vue';
import useCardLinkStore from '../store/modules/activeCardLinks.js';

const cardLinkStore = useCardLinkStore();

const route = useRoute();
const userId = ref(route.params.userId);
const modalMessage = ref('');
const linkCardModal = ref(null);
const emit = defineEmits(['update:modelValue']);

const activeCardLink = {};

const timer = ref({
    duration: 60,
    strokeWidth: 10,
    radius: 96,
    strokeColor: '#ffc107',
    isRunning: false,
});

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

watch(
    () => props.modelValue,
    async value => {
        if (value === true) await handleSubmit();
    },
);

const modal = ref(null);

onMounted(() => {
    modal.value = new Modal(linkCardModal.value, {
        keyboard: false,
    });

    linkCardModal.value.addEventListener('hidden.bs.modal', () => {
        stopTimer();
        emit('update:modelValue', false);
    });
});

const toggleModal = () => {
    modal.value.toggle();
};

const startTimer = () => {
    timer.value.strokeColor = '#ffc107';
    timer.value.isRunning = true;
    pollCardLink();
};

const pollCardLink = async () => {
    if (timer.value.isRunning) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        cardLinkStore.setOne(activeCardLink.value.id);

        if (cardLinkStore.getLinkedCardLinks.value.length === 1) {
            stopTimer();
            // eslint-disable-next-line require-atomic-updates
            timer.value.strokeColor = 'green';
            modalMessage.value = 'De kaart is gekoppeld'; // success

            cardStore.actions.getAllByUserId(userId.value);

            return;
        }

        pollCardLink();
    } else {
        modalMessage.value = 'De kaart is niet gekoppeld'; // error
        timer.value.strokeColor = 'red';
    }
};

const stopTimer = () => {
    timer.value.isRunning = false;
};

const handleSubmit = async () => {
    await cardLinkStore.setAll();

    if (cardLinkStore.getAll.value.length === 0) {
        modalMessage.value = 'Houd de kaart bij de kaartlezer om de kaart te koppelen';
        toggleModal();

        activeCardLink.value = await cardLinkStore.createOne({
            user_id: userId.value,
        });

        startTimer();
    } else {
        const toast = useToast();

        toast.error('Er is al een koppel actie bezig probeer het over één minuut opnieuw', {
            timeout: 2000,
        });

        emit('update:modelValue', false);
    }
};
</script>

<style>
svg {
    width: 300px;
    height: 300px;
    text-align: center;
}

.modal-title {
    text-align: center;
}
</style>
