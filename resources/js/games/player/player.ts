import {TransformedView} from 'games/library/types/tv';
import {vector} from 'games/library/vector';

export const getPlayer = () => {
    const pos = vector(3, 3);
    const vel = vector();
    const acc = vector();
    const w = 1;
    const h = 1;

    const createShow = (tv: TransformedView) => ({
        id: 4,
        name: 'player',
        fn: () => {
            tv.fillRect({x: pos.x, y: pos.y, w, h, fill: '#f00'});
        },
    });

    const createUpdate = () => ({
        id: 4,
        name: 'player',
        fn: () => {
            vel.x += acc.x;
            vel.y += acc.y;

            pos.x += vel.x;
            pos.y += vel.y;

            acc.x = 0;
            acc.y = 0;
        },
    });

    return {createShow, createUpdate};
};
