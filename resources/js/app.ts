import {addRoutes, mountRouter} from 'services/router';
import {createApp} from 'vue';
import {csrfCookie, verifyAuth} from 'store/auth';
import {routes} from './routes';
import App from './App.vue';
import axi from './axx';

import '../css/app.css';
// import axios from 'axios';

const app = createApp(App);

addRoutes(routes);

// const instance = axios.create({
//     baseURL: 'https://eropics.to/',
//     timeout: 1000,
//     headers: {'Access-Control-Allow-Origin': '*', crossorigin: 'true'},
// });
// const response = await instance.get(
//     '2024/08/25/abbywinters-2024-08-13-ryana-stella-c-big-breasted-blondes-dressing-room-x115',
// );

axi.get('2024/08/25/abbywinters-2024-08-13-ryana-stella-c-big-breasted-blondes-dressing-room-x115').then(response => {
    console.log(response);
});

// console.log(response);

// fetch('2024/08/25/abbywinters-2024-08-13-ryana-stella-c-big-breasted-blondes-dressing-room-x115', {
//     credentials: 'include',
//     headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
//         Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
//         'Accept-Language': 'nl,en-US;q=0.7,en;q=0.3',
//         'Alt-Used': 'eropics.to',
//         'Upgrade-Insecure-Requests': '1',
//         'Sec-Fetch-Dest': 'document',
//         'Sec-Fetch-Mode': 'navigate',
//         'Sec-Fetch-Site': 'cross-site',
//         Priority: 'u=0, i',
//     },
//     method: 'GET',
//     mode: 'cors',
// }).then(ress => {
//     console.log(ress);
// });

// console.log(resss);

try {
    await csrfCookie();

    await verifyAuth();
} catch (_) {
    //
} finally {
    mountRouter(app);
    app.mount('#app');
}
