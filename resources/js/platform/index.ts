/* eslint-disable complexity */
import {RectangleCollisionObject} from 'types/platform';
import {gameStore} from './store';
import {getCanvas, getContext2D} from '../library/canvas';
import {getEngine} from '../library/engine';
import {getPlatform} from './platform';
import {getPlayer} from './player';

export default {
    setup: () => {
        const canvas = getCanvas(canvasOptions);
        const context = getContext2D(canvas);
        const player = getPlayer(context, canvas);
        const platform = getPlatform(context, canvas);
        const engine = getEngine();

        engine.setUpdate(player.update);
        engine.setShow(player.show);
        engine.setShow(platform.show);

        gameStore.set({canvas, context, engine});

        engine.setUpdate(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        });

        engine.setUpdate(collisions.checkRectangleCollisions);

        rectangleCollisionObjects.push(player);
        rectangleCollisionObjects.push(platform);
    },
    run: () => {
        gameStore.state.engine.run();
    },
};

const rectangleCollisionObjects: RectangleCollisionObject[] = [];

const collisions = {
    checkRectangleCollisions: () => {
        const p1 = rectangleCollisionObjects[0];
        const p2 = rectangleCollisionObjects[1];

        // 1st: bottom1 vs top2, 2nd: top1 vs bottom2, 3rd: right1 vs left2, 4th: left1 vs right2
        if (
            p1.pos.y + p1.size.y > p2.pos.y &&
            p1.pos.y < p2.pos.y + p2.size.y &&
            p1.pos.x + p1.size.x > p2.pos.x &&
            p1.pos.x < p2.pos.x + p2.size.x
        ) {
            if (p1.vel.y > 0) {
                p1.pos.y = p2.pos.y - p1.size.y;
                p1.vel.y = 0;
            } else if (p1.vel.y < 0) {
                p1.pos.y = p2.pos.y + p2.size.y;
                p1.vel.y = 0;
            }

            if (p1.vel.x > 0) {
                p1.pos.x = p2.pos.x - p1.size.x;
                p1.vel.x = 0;
            } else if (p1.vel.x < 0) {
                p1.pos.x = p2.pos.x + p2.size.x;
                p1.vel.x = 0;
            }
        }
    },
};

const canvasOptions = {
    width: 640,
    height: 480,
    backgroundColor: '#000',
};
