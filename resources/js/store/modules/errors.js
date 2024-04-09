import {computed, reactive} from 'vue';
import {withState} from '../helper.js';

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

export default () =>
    withState(
        {
            getAll,
            setAll,
            clear,
        },
        state,
    );
