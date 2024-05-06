import {TVOptions} from 'library/types/tv';
import {enableStatistics} from '../library/statistics';
import {gameStore, playerStore} from './store';
import {getCanvas, getContext2D, vector, vector2} from '../library/canvas';
import {getEngine} from '../library/engine';
import {getLevel} from './levels';
import {getPlayer} from './player';
import {getTV} from '../library/transformedView';

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
        const level = getLevel(3);

        const tvOptions: TVOptions = {
            context,
            screenSize: vector(canvas.width, canvas.height),
            worldBorders: vector2(0, 0, level.width, level.height),
            scale: vector(canvas.width / 13, canvas.height / 13),
        };

        // externally used in player & levels & ...
        const tv = getTV(tvOptions);

        engine.setUpdate(() => context.clearRect(0, 0, canvas.width, canvas.height));

        gameStore.set({canvas, context, engine, tv});
        engine.setUpdate(tv.update);

        const player = getPlayer(level.playerStart);

        engine.setUpdate(player.update);

        engine.setShow(level.show);
        engine.setShow(player.show);

        playerStore.set({player});

        enableStatistics();
    },
    run: () => gameStore.state.engine.run(),
    runOnce: () => gameStore.state.engine.runOnce(),
};
