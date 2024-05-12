import {enableStatistics} from 'library/statistics';
import {gameStore, playerStore} from './store';
import {getCanvas, getContext2D, vector, vector2} from 'library/canvas';
import {getEngine} from 'library/engine';
import {getLevel} from './levels';
import {getMenuButton} from './button';
import {getPlayer} from './player';
import {getTV} from 'library/transformedView';
import {setMouseInput} from './input';
import type {Level} from './types/level';

const canvasOptions = {
    width: 500,
    height: 500,
    backgroundColor: '#000',
};

const getTVOptions = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, level: Level) => ({
    context,
    screenSize: vector(context.canvas.width, context.canvas.height),
    worldBorders: vector2(0, 0, level.width, level.height),
    scale: vector(context.canvas.width / 13, canvas.height / 13),
});

export default {
    setup: () => {
        const canvas = getCanvas(canvasOptions);
        const context = getContext2D(canvas);
        const engine = getEngine();
        const level = getLevel(3);

        setMouseInput(canvas);

        const tVOptions = getTVOptions(context, canvas, level);
        const tv = getTV(tVOptions);

        gameStore.set({canvas, context, engine, tv}); // set gameStore at the earliest convenience

        const player = getPlayer(level.playerStart);
        playerStore.set({player});

        // 1. refresh to blank screen in engine loop (has to be first in)
        // 2. bunch up all updates and shows and set them in order somewhere else (expand setUpdate/Show)
        engine.setUpdate(() => context.clearRect(0, 0, canvas.width, canvas.height));
        engine.setUpdate(tv.update);
        engine.setUpdate(player.update);

        // when a component use the gamestore, make create functions so they can be used at a later point
        const levelShow = level.createShow(level.map, tv);

        engine.setShow(levelShow);
        engine.setShow(player.show);

        // temporary button
        const button = getMenuButton(context);
        engine.setUpdate(button.update);
        engine.setShow(button.show);

        // Make this a hidden option inside the canvas
        enableStatistics();
    },
    run: () => gameStore.state.engine.run(),
    runOnce: () => gameStore.state.engine.runOnce(),
};
