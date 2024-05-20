import {computed, reactive} from 'vue';

// state
const state = reactive({
    errors: [],
});

// getters
const getAll = computed(() => state.errors);

// actions
const setAll = errors => {
    state.errors = errors;
};

const clear = () => {
    state.errors = [];
};

export default () => ({getAll, setAll, clear});
