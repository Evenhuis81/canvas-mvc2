import {resources} from 'library/index';
import type {TransformedView} from 'library/types/views';

export const levelScreen = () => {
    const {tv, engine} = resources.survival;

    const show = createLevelScreenShow(tv);

    engine.setShow(show);
};

const levels = [];

const createLevelScreenShow = (tv: TransformedView) => ({
    id: 'levelScreen',
    name: 'Level Screen',
    fn: () => {
        tv.line(line);
    },
});

const line = {
    x: 5,
    y: 5,
    x2: 10,
    y2: 10,
    stroke: 'gray',
    lw: 1,
};
