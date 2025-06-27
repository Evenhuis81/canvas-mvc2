<template>
    <div id="demo2d-container" />
</template>

<script lang="ts" setup>
import {initialize} from 'library/index';
import {onMounted} from 'vue';
import type {LibraryOptions} from 'library/types';

const libraryID = 'demo2d';

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
};

onMounted(async () => {
    const library = await initialize(libraryID, libraryOptions);

    const {demo2d} = library;

    demo2d.start();

    const stopTimer = 5000;

    setTimeout(() => {
        demo2d.stop();
    }, stopTimer);
});
</script>
