import {AdminInvitation} from 'types/index';
import {computed, reactive} from 'vue';
import {withState} from '../helper';
import axios from 'axios';

// state
const state = reactive<{adminInvitations: AdminInvitation[]}>({
    adminInvitations: [],
});

// getters
const getAll = computed(() => state.adminInvitations);
const getActive = computed(() => state.adminInvitations.filter((invite: AdminInvitation) => invite.expired === false));
const getByUserId = computed(
    () => (id: number) => state.adminInvitations.filter((invite: AdminInvitation) => invite.invitee_user_id === id),
);

// actions
const setAll = async () => {
    const {data} = await axios.get<{adminInvitations: AdminInvitation[]}>('admin_invitations');
    state.adminInvitations = data.adminInvitations;
};

const setByHash = async (hash: string) => {
    const {data} = await axios.get<{adminInvitation: AdminInvitation}>(`admin_invitations/${hash}`);
    state.adminInvitations = [data.adminInvitation];
};

const invite = async (user: number) => {
    const {data} = await axios.post<{adminInvitations: AdminInvitation}>(`users/${user}/admin_invitations`);
    state.adminInvitations = [data.adminInvitations];
};

const updateToAdmin = async (userDetails: object, adminInvitation: number) => {
    await axios.put<{adminInvitation: AdminInvitation}>(`admin_invitations/${adminInvitation}`, userDetails);
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
