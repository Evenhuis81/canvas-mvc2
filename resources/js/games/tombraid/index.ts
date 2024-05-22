/* eslint-disable max-lines-per-function */
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

export default {
    setup: () => {
        const canvas = getCanvas(canvasOptions);
        const context = getContext2D(canvas);
        const engine = getEngine();
        const tv = getTV(context);

        gameStore.set({canvas, context, engine, tv});
        setMouseInput(canvas);

        // Hmm
        engine.setUpdate(() => context.clearRect(0, 0, canvas.width, canvas.height));

        const tvUpdate = tv.createTVUpdateSetWorldClamp(context);
        engine.setUpdate(tvUpdate);

        // Abstract this
        const startButton = getStartButton(context);
        engine.setShow(startButton.show);

        addEventListener('mouseup', () => {
            if (startButton.inside()) startLevel(2);
        });

        // dot in middle of screen
        const s = () => {
            context.beginPath();
            context.fillStyle = 'white';
            context.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2);
            context.fill();
        };
        engine.setShow(s);

        // Make this a hidden option inside the canvas
        enableStatistics();

        const startLevel = (levelNr: number) => {
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
        };
    },
    run: () => gameStore.state.engine.run(),
    runOnce: () => gameStore.state.engine.runOnce(),
};
