/* eslint-disable max-lines-per-function */
import {Engine} from './types/game';
import {TransformedView} from 'games/library/types/tv';
import {enableStatistics} from 'library/statistics';
import {gameStore, levelStore, playerStore} from './store';
import {getCanvas, getContext2D, vector, vector2} from 'library/canvas';
import {getEngine} from 'library/engine';
import {getLevel} from './levels';
import {getPlayer} from './player';
import {getStartButton} from './button';
import {getTV} from 'games/library/transformedView';
import {setMouseInput} from './input';

const canvasOptions = {
    width: 500,
    height: 500,
    backgroundColor: '#000',
};

const goToMenu = (
    context: CanvasRenderingContext2D,
    engine: Engine,
    tv: TransformedView,
    canvas: HTMLCanvasElement,
) => {
    // buttons:
    // 1. start
    // 2. settings
    // 3. exit
    // 4. admin options
    // 5. show statistics
    // 6. level editor
    // 7. login
    // 8. create account
    // 9. load game
    // 10. save game

    // const button = getButton(buttonObj);

    const startButton = getStartButton(context);
    engine.setShow(startButton.show);

    addEventListener('mouseup', () => {
        if (startButton.inside()) startLevel(2, tv, context, canvas, engine);
    });
};

export default {
    setup: () => {
        const canvas = getCanvas(canvasOptions);
        const context = getContext2D(canvas);
        const engine = getEngine();
        const tv = getTV(context);

        // Make globally available
        gameStore.set({canvas, context, engine, tv});
        setMouseInput(canvas);

        // Engine Updates
        const clearScreen = {
            id: 0,
            name: 'clear screen',
            fn: () => context.clearRect(0, 0, canvas.width, canvas.height),
        };

        engine.setUpdate(clearScreen);

        const tvUpdate = tv.createTVUpdateSetWorldClamp(canvas);
        engine.setUpdate(tvUpdate);

        // Menu Screen
        goToMenu(context, engine, tv, canvas);

        // dot in middle of screen
        const s = {
            id: 99,
            name: 'dot in middle',
            fn: () => {
                context.beginPath();
                context.fillStyle = 'white';
                context.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2);
                context.fill();
            },
        };

        // Engine Shows
        engine.setShow(s);

        // Make this a hidden option inside the canvas
        enableStatistics();

        // StartLevel = here

        engine.showsOverview();
        engine.updatesOverview();
    },
    run: () => gameStore.state.engine.run(),
    runOnce: () => gameStore.state.engine.runOnce(),
};

const startLevel = (
    levelNr: number,
    tv: TransformedView,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    engine: Engine,
) => {
    const level = getLevel(levelNr);
    levelStore.set(level);
    tv.setScale(vector(context.canvas.width / 13, canvas.height / 13));
    tv.setScaleFactor(0.99);
    tv.setScreenSize(vector(context.canvas.width, context.canvas.height));
    tv.setWorldBorders(vector2(0, 0, level.width, level.height));
    tv.setOffset(vector(-6 + level.playerStart.x, -6 + level.playerStart.y));
    const player = getPlayer(level.playerStart);
    playerStore.set(player);
    // bunch up all updates and shows and set them in order somewhere else (expand setUpdate/Show)
    engine.setUpdate(player.update);
    // when a component use the gamestore, make create functions so they can be used at a later point
    const levelShow = level.createShow(level.map, level.coins, tv);
    engine.setShow(levelShow);
    engine.setShow(player.show);

    engine.showsOverview();
    engine.updatesOverview();
};
