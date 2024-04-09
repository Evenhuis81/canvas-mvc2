import {addRoutes, mountRouter} from 'services/router';
import {createApp} from 'vue';
import {csrfCookie, verifyAuth} from 'store/auth';
import {routes} from './routes';
import App from './App.vue';

import '../css/app.css';

const app = createApp(App);

addRoutes(routes);
mountRouter(app);

try {
    await csrfCookie();

    await verifyAuth();
} catch (_) {
    //
} finally {
    app.mount('#app');
}
