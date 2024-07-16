import {createStore} from 'library/store';
import {getLevel} from './levels';
import {getLibraryOptions, initialize} from 'library/index';
import {getPlayer} from './player';
import {vector} from 'library/vector';
import type {LevelResource} from './types/level';
import type {PlayerResource} from './types/game';
import type {ResourcesAndTV} from 'library/types';
// import {setDualView, onResize} from 'library/menu';
// import {getContext2D} from 'library/canvas';
// import {getStatistics} from 'library/statistics';
import type {StatisticsResource} from 'library/types/statistics';
import button from 'library/button/button';
import {Engine} from 'library/types/engine';

export const resources = createStore<ResourcesAndTV>();
export const levelStore = createStore<LevelResource>();
export const playerStore = createStore<PlayerResource>();
export const statistics = createStore<StatisticsResource>();

const options = {
    full: true,
    backgroundColor: '#000',
};

export default {
    setup: async () => {
        const {canvas, context, engine, tv, input} = initialize('container', options);

        resources.set({canvas, context, engine, tv, input});

        const player = getPlayer();
        playerStore.set(player);

        const libOptions = getLibraryOptions(context, engine);

        libOptions.setClear();
        libOptions.setDot();

        goToMenu();
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

const createMouseUpForStartButton = () => () => {
    button.destruct(['startButton', 'editorButton']);

    startLevel(3);
};

const createMouseUpForEditorButton = () => () => {
    button.destruct(['startButton', 'editorButton']);

    startEditor();
};

const startEditor = () => {
    console.log('start editor');
};

const goToMenu = () => {
    const {context, engine, input} = resources.state;

    button.create(context, engine, input, {
        x: innerWidth * 0.1,
        y: innerHeight * 0.1,
        id: 'startButton',
        name: 'startButton',
        text: 'set level 3',
        mouseup: createMouseUpForStartButton(),
    });

    button.create(context, engine, input, {
        x: innerWidth * 0.1,
        y: innerHeight * 0.25,
        id: 'editorButton',
        name: 'editorButton',
        text: 'edit a level',
        mouseup: createMouseUpForEditorButton(),
    });
};

const startLevel = (levelNr: number) => {
    console.log(`start level: ${levelNr}`);
};
