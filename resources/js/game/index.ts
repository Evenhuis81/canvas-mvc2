import {gameStore} from './store';
import {getContext2d, setCanvas} from './canvas';
import {getEngine} from './engine';
import {getPlatform} from './platform';
import {getPlayer} from './player';

export default {
    setup: () => {
        const canvas = setCanvas(canvasOptions);
        const context = getContext2d(canvas);
        const player = getPlayer(context, canvas);
        const platform = getPlatform(context, canvas);
        const engine = getEngine();

        engine.setUpdate(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        });

        engine.setUpdate(player.update);
        engine.setShow(player.show);
        engine.setShow(platform.show);

        gameStore.set({canvas, context, player, platform, engine});
    },
    run: () => {
        gameStore.state.engine.run();
    },
};

const canvasOptions = {
    width: 640,
    height: 480,
    backgroundColor: '#000',
    position: 'center',
};

// const collisions = (p1: RectangleCollisionObject, p2: RectangleCollisionObject) => p1 === p2;
