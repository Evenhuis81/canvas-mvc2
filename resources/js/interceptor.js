/* eslint-disable complexity */
/* eslint-disable promise/prefer-await-to-callbacks */
import {getCurrentRouteName, goToRoute} from 'services/router';
import {paginationStore} from '../js/store/modules/pagination';
import {useToast} from 'vue-toastification';
import axios from 'axios';
import useErrorStore from '../js/store/modules/errors.js';

const errorStore = useErrorStore();

// Add a request interceptor
axios.interceptors.request.use(
    async config => {
        // Do something before request is sent
        await errorStore.clear();

        config.params = {
            ...config.params,
            page: paginationStore.getters.byId('page').value,
            sortBy: paginationStore.getters.byId('sortBy').value,
            asc: paginationStore.getters.byId('asc').value,
        };

        return config;
    },
    error =>
        // Do something with request error
        Promise.reject(error),
);

// Add a response interceptor
axios.interceptors.response.use(
    response => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (typeof response.data.meta !== 'undefined') {
            paginationStore.setters.by('perPage', response.data.meta.per_page);
            paginationStore.setters.by('lastPage', response.data.meta.last_page);
            response.data = response.data.data;
        }

        return response;
    },
    async error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        const errors = error.response.data.errors || [];

        // skip me route session restore errors
        if (error.config.url !== 'me') await errorStore.setAll(errors);

        const toast = useToast();

        switch (error.response.status) {
            case 401:
                // user tried to access unauthorized resource
                return Promise.reject(error);
            case 404:
                redirect404(getCurrentRouteName());
                break;
            // Laravel validation failed
            case 422:
                return Promise.reject(error);
            // Too many reqeusts
            case 429:
                toast.error('Too many request, please wait', {
                    timeout: 2000,
                });

                return Promise.reject(error);
            default:
                toast.error(error, {
                    timeout: 2000,
                });

                return Promise.reject(error);
        }
    },
);

const redirect404 = routeName => {
    if (routeName !== 'Login' && routeName !== 'NewPassword' && routeName !== 'Users.RegisterAsAdmin')
        goToRoute('Login');
};
