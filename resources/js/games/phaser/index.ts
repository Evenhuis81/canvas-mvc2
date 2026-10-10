import {libPhaser} from 'library/index';
import {onMounted} from 'vue';
// import {startDotDemoPhaser} from './demo/dot';
// import {startDotDemoPhaser2} from './demo/dot2';
// import type {LibraryOptions} from 'library/types';

// const libraryID = 'phaser';

export const phaser = () => {
    const library = libPhaser();

    // onMounted(() => phaser().runEngine());
    onMounted(() => library.runEngine());

    console.log(library);

    // startDotDemoPhaser2(library);

    return library;
};

// const libraryOptions: Partial<LibraryOptions> = {
//     containerID: `${libraryID}-container`,
//     full: true,
//     clear: true,
//     backgroundColor: '#000',
//     engineStats: true,
// };
