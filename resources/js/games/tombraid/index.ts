import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import {getPlayer} from './player';
import type {LevelResource} from './types/level';
import type {PlayerResource} from './types/game';
import type {ResourcesAndTV} from 'library/types';
import type {StatisticsResource} from 'library/types/statistics';
import button from 'library/button/button';
import {Engine} from 'library/types/engine';

export const resources = createStore<ResourcesAndTV>();
export const levelStore = createStore<LevelResource>();
export const playerStore = createStore<PlayerResource>();
export const statistics = createStore<StatisticsResource>();

export default {
    setup: async () => {
        const {canvas, context, engine, tv, input} = initialize('container', {full: true, bg: '#000'});

        resources.set({canvas, context, engine, tv, input});

        const player = getPlayer();
        playerStore.set(player);

        const libOptions = getLibraryOptions(context, engine);

        libOptions.setClear();
        // libOptions.setDot();

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

    button.create(context, engine, input, editorButton);

    button.create(context, engine, input, startButton);
};

const startLevel = (levelNr: number) => {
    console.log(`start level: ${levelNr}`);
};

const startButton = {
    x: innerWidth * 0.1,
    y: innerHeight * 0.25,
    id: 'editorButton',
    name: 'editorButton',
    text: 'edit a level',
    mouseup: createMouseUpForEditorButton(),
};

const editorButton = {
    x: innerWidth * 0.1,
    y: innerHeight * 0.1,
    id: 'startButton',
    name: 'startButton',
    text: 'start level 3',
    mouseup: createMouseUpForStartButton(),
};
