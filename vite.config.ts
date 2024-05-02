import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import vue from '@vitejs/plugin-vue';

const srcPath = path.resolve('./resources/js');

export const resolve = {
    alias: {
        components: path.join(srcPath, 'components'),
        router: path.join(srcPath, 'router'),
        types: path.join(srcPath, 'types'),
        store: path.join(srcPath, 'store/modules'),
        pages: path.join(srcPath, 'pages'),
        services: path.join(srcPath, 'services'),
        library: path.join(srcPath, 'library'),
    },
};

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.ts'],
            refresh: true,
        }),
        vue(),
    ],
    build: {
        target: 'esnext',
    },
    resolve,
});
