// import {enableStatistics} from '../library/statistics';
// import {gameStore, playerStore} from './store';
// import {getCanvas, getContext2D, vector, vector2} from '../library/canvas';
// import {getEngine} from '../library/engine';
// import {getLevel} from './levels';
// import {getPlayer} from './player';
// import {getTv} from '../library/transformedView';

import {gameStore} from '../store';
import {getButton} from './button';
import {getCanvas, getContext2D, vector, vector2} from 'library/canvas';
import {getEngine} from 'library/engine';
import {getTv} from 'library/transformedView';

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
        const tv = getTv(
            context,
            vector(canvas.width, canvas.height),
            vector2(0, 0, canvas.width, canvas.height), // TODO::make large world and show bounds
            vector(),
            vector(canvas.width / 13, canvas.height / 13), // TODO::make dynamic
        );

        engine.setUpdate(() => context.clearRect(0, 0, canvas.width, canvas.height));
        engine.setUpdate(tv.update);

        // const showGrid = grid(levelProperties.width);
        // engine.setShow(showGrid.show);

        gameStore.set({canvas, context, engine, tv});

        const button = getButton('create level');

        engine.setShow(button.show);

        // const player = getPlayer(level.playerStart);

        // engine.setUpdate(player.update);

        // engine.setShow(level.show);
        // engine.setShow(player.show);

        // playerStore.set({player});

        // enableStatistics();
    },
    run: () => gameStore.state.engine.run(),
    runOnce: () => gameStore.state.engine.runOnce(),
};
