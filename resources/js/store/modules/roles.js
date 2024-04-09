import {computed, reactive} from 'vue';
import {withState} from '../helper.js';
import axios from 'axios';

// state
const state = reactive({
    roles: [],
});

// getters
const getRoles = computed(() => state.roles);

// actions
const getAll = async () => {
    const {data} = await axios.get('roles');
    state.roles = data.roles;
};

export default () => withState({getRoles, getAll}, state);
