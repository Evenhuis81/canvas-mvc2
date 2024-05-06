import {gameStore} from '../store';
import {getButton} from './button';
import {getCanvas, getContext2D, vector, vector2} from 'library/canvas';
import {getEngine} from 'library/engine';
import {getTV} from 'library/transformedView';
import type {TVOptions} from 'library/types/tv';

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

        const tvOptions: TVOptions = {
            context,
            screenSize: vector(canvas.width, canvas.height),
            offset: vector(-6.5, -6.5),
            scale: vector(canvas.width / 13, canvas.height / 13),
            worldBorders: vector2(-6.5, -6.5, 19.5, 19.5),
        };

        const tv = getTV(tvOptions);

        engine.setUpdate(() => context.clearRect(0, 0, canvas.width, canvas.height));

        gameStore.set({canvas, context, engine, tv});

        const button = getButton('create level');

        engine.setShow(button.show);
    },
    run: () => gameStore.state.engine.run(),
    runOnce: () => gameStore.state.engine.runOnce(),
};
