import {createStore} from 'library/store';
import {getLevel} from './levels';
import {getLibraryOptions, initialize} from 'library/index';
import {getPlayer} from './player';
import {vector} from 'library/vector';
import type {LevelResource} from './types/level';
import type {PlayerResource} from './types/game';
import type {ResourcesAndTV} from 'library/types';
import {setDualView, onResize} from 'library/menu';
import {getContext2D} from 'library/canvas';
import {getStatistics} from 'library/statistics';
// import {loadFont} from 'library/font';
import type {StatisticsResource} from 'library/types/statistics';
import button from 'library/button/button';
import {Button} from 'library/types/button';
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

        // await loadFont('OpenS', 'OpenSans-VariableFont_wdth,wght.ttf');

        // const canvas2 = setDualView(canvas, 'container');
        // const context2 = getContext2D(canvas2);

        // const stats = getStatistics(context2, canvas2);

        // statistics.set(stats);

        // engine.setShow(statistics.state.show);

        const player = getPlayer();
        playerStore.set(player);

        // setMouseInput(canvas);

        const libOptions = getLibraryOptions(context, engine);

        libOptions.setClear();
        libOptions.setDot();

        goToMenu();
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

const createMouseUpForStartButton = (engine: Engine) => (evt: MouseEvent, destruct: Button['destruct']) => {
    engine.removeShow('startButton');
    engine.removeUpdate('startButton');

    destruct();

    startLevel(3);
};

const goToMenu = () => {
    const {context, engine, input} = resources.state;

    const startButton = button.create(context, input, {
        id: 'startButton',
        name: 'startButton',
        text: 'set level 3',
        mouseup: createMouseUpForStartButton(engine),
    });

    engine.setUpdate(startButton.update);
    engine.setShow(startButton.show);
};

const startLevel = (levelNr: number) => {
    const level = getLevel(levelNr);

    levelStore.set(level);

    const {tv, canvas, engine} = resources.state;
    const player = playerStore.state;

    const scale = canvas.width / 24;

    tv.setUnitWeight({x: 1 / scale, y: 1 / scale});

    tv.setScale(vector(scale, scale));
    tv.setScreenSize(vector(canvas.width, canvas.height));

    player.setPosition(level.playerStart);

    tv.setMiddle(vector(level.playerStart.x + 0.5, level.playerStart.y + 0.5));

    const levelShow = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);

    engine.setShow(levelShow);
    engine.setShow(player.show);

    engine.setUpdate(player.update);

    // onResize(() => {
    //     engine.removeShow(4);

    //     const scale = canvas.width / 24;

    //     const unitLength = 1 / scale;
    //     tv.setUnitWeight({x: unitLength, y: unitLength});

    //     tv.setScale(vector(scale, scale));
    //     tv.setScreenSize(vector(canvas.width, canvas.height));
    //     tv.setMiddle(vector(player.middlePos.x, player.middlePos.y));

    //     const levelShow = level.createShow(level.map, level.coins, tv, canvas.width, canvas.height);

    //     engine.setShow(levelShow);
    // });

    // statistics.state.set({
    //     id: 8,
    //     name: 'player (middle) pos',
    //     fn: () => `player.x: ${player.middlePos.x}, player.y: ${player.middlePos.y}`,
    // });

    // statistics.state.setFn(() => `${tv.scale.x}`);
};
