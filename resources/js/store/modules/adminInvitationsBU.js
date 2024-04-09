import {computed, reactive} from 'vue';
import {withState} from '../helper.js';
import axios from 'axios';

// state
const state = reactive({
    adminInvitations: [],
});

// getters
const getAll = computed(() => state.adminInvitations);
const getActive = computed(() => state.adminInvitations.filter(invite => invite.expired === false));
const getByUserId = computed(() => id => state.adminInvitations.filter(invite => invite.invitee_user_id === id));

// actions
const setAll = async () => {
    const {data} = await axios.get('admin_invitations');
    state.adminInvitations = data.adminInvitations;
};

const setByHash = async hash => {
    const {data} = await axios.get(`admin_invitations/${hash}`);
    state.adminInvitations = [data.adminInvitation];
};

const invite = async user => {
    const {data} = await axios.post(`users/${user}/admin_invitations`);
    state.adminInvitations = [data.adminInvitations];
};

const updateToAdmin = async (userDetails, adminInvitation) => {
    await axios.put(`admin_invitations/${adminInvitation}`, userDetails);
};

export default () =>
    withState(
        {
            getAll,
            getActive,
            getByUserId,
            setAll,
            setByHash,
            invite,
            updateToAdmin,
        },
        state,
    );
