import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import vue from '@vitejs/plugin-vue';

const srcPath = path.resolve('./resources/js');

export const resolve = {
    alias: {
        games: path.join(srcPath, 'games'),
        library: path.join(srcPath, 'games/library'),
        tombraid: path.join(srcPath, 'games/tombraid'),
        store: path.join(srcPath, 'store/modules'),
        pages: path.join(srcPath, 'pages'),
        services: path.join(srcPath, 'services'),
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
