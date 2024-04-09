<template>
    <svg>
        <circle
            :cx="cx"
            :cy="cy"
            :r="radius"
            fill="none"
            :stroke="strokeColor"
            :stroke-width="strokeWidth"
            :stroke-dasharray="strokeDashArray"
            transform="rotate(-90,100,100)"
        />
    </svg>
</template>

<script setup>
import {computed, ref, watch} from 'vue';

const cx = ref('20%');
const cy = ref('50%');
const timer = ref({
    counter: 0,
    interval: 100,
    percent: 0,
});
const emit = defineEmits(['hideCircleTimer', 'update:modelValue']);
const props = defineProps({
    duration: {
        type: Number,
        required: true,
    },
    strokeWidth: {
        type: Number,
        required: true,
    },
    radius: {
        type: Number,
        required: true,
    },
    strokeColor: {
        type: String,
        required: false,
        default: '#ffc107',
    },
    modelValue: {
        // isRunning
        type: Boolean,
        required: true,
    },
});

const strokeDashArray = computed(() => `${(timer.value.percent / 100) * 603}, 20000`);

const resetTimer = () => {
    timer.value.counter = 0;
    timer.value.percent = 0;
};

const startTimer = () => {
    window.circleTimer = setInterval(() => {
        if (timer.value.counter >= (props.duration * 1000) / timer.value.interval) {
            window.clearInterval(window.circleTimer);
            emit('update:modelValue', false);
        } else {
            timer.value.counter++;
            timer.value.percent = (
                ((timer.value.counter * timer.value.interval) / (props.duration * 1000)) *
                100
            ).toFixed(2);
        }
    }, timer.value.interval);
};

watch(
    () => props.modelValue,
    value => {
        if (value === true) {
            // start timer
            resetTimer();
            startTimer();
        } else {
            // stop timer
            window.clearInterval(window.circleTimer);
        }
    },
    {deep: true},
    {immediate: true},
);
</script>

<style>
svg {
    width: 300px;
    height: 300px;
    text-align: center;
}
</style>
