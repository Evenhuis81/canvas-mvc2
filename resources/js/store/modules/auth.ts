import {computed, ref} from 'vue';
import axios from 'axios';
import type {Credentials, ResetDetails} from 'types/auth';
import type {User} from 'types/index';

const loggedInUser = ref<Readonly<User> | null>(null);

export const isLoggedIn = computed(() => loggedInUser.value !== null);
export const getLoggedInUser = computed(() => loggedInUser.value);
export const getLoggedInUserId = () => loggedInUser.value?.id;
export const deleteUserClientSide = () => (loggedInUser.value = null);

export const login = async (credentials: Credentials) => {
    const {data} = await axios.post('login', credentials);

    loggedInUser.value = data;
};

export const logout = async () => {
    await axios.post('/logout');

    deleteUserClientSide();
};

// Set an XSRF-TOKEN cookie containing the current CSRF token.
export const csrfCookie = async () => {
    // This is the only route that doesn't start with '/api' (= default baseURL)
    await axios({
        method: 'get',
        url: '/sanctum/csrf-cookie',
        baseURL: '/',
    });
};

// Verify if user is still logged in on refresh or new session
export const verifyAuth = async () => {
    const {data} = await axios.get('me');

    loggedInUser.value = data;
};

export const saveNewPassword = async (resetDetails: ResetDetails) => {
    await axios.post('/reset-password', resetDetails);
};

export const requestNewPassword = async (email: string) => {
    await axios.post('/forgot-password', {email});
};

// registerAfterMiddleware(({meta}) => {
//     if (!isLoggedIn.value && meta.shouldBeLoggedIn) return {name: 'Login'};

//     if (isLoggedIn.value && !meta.shouldBeLoggedIn) return {name: 'Registrations.Overview'};

//     return true; // isLoggedIn && shouldBeLoggedIn    ||    !isLoggedIn && !shouldBeLoggedIn
// });
