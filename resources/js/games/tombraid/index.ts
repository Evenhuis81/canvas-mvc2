import {createStore} from 'library/store';
import {getLevel} from './levels';
import {getLibraryOptions, initialize} from 'library/index';
import {getPlayer} from './player';
import {setMouseInput} from 'library/input';
import {vector} from 'library/vector';
import type {LevelResource} from './types/level';
import type {PlayerResource} from './types/game';
import type {ResourcesAndTV} from 'library/types';
import {setDualView} from 'library/menu';
import {getContext2D} from 'library/canvas';
import {getStatistics} from 'library/statistics';
import {loadFont} from 'library/font';
import {getDetector} from 'library/font/font';
import {StatisticsResource} from 'library/types/statistics';

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
        const {canvas, context, engine, tv} = initialize('container', options);

        resources.set({canvas, context, engine, tv});

        const canvas2 = setDualView(canvas, 'container');
        const context2 = getContext2D(canvas2);

        const stats = getStatistics(context2, canvas2);

        await loadFont('OpenS', 'OpenSans-VariableFont_wdth,wght.ttf');

        const detector = getDetector();

        console.log(detector.detect('OpenS'));

        statistics.set(stats);

        engine.setShow(statistics.state.show);

        const player = getPlayer();
        playerStore.set(player);

        setMouseInput(canvas);

        const libOptions = getLibraryOptions(context, engine);

        libOptions.setClear();
        libOptions.setDot();

        goToMenu();
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

const goToMenu = () => startLevel(3);

const startLevel = (levelNr: number) => {
    const level = getLevel(levelNr);
    levelStore.set(level);

    const {tv, canvas, engine} = resources.state;
    const player = playerStore.state;
    const scale = canvas.width / 24;

    tv.setScale(vector(scale, scale));
    tv.setScaleFactor(0.99);
    tv.setScreenSize(vector(canvas.width, canvas.height));

    player.setPosition(level.playerStart);

    const tvUpdate = tv.moveTo(player.middlePos);
    engine.setUpdate(tvUpdate);

    tv.setMiddle(vector(level.playerStart.x + 0.5, level.playerStart.y + 0.5));

    const levelShow = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);

    engine.setShow(levelShow);
    engine.setShow(player.show);

    engine.setUpdate(player.update);
};
