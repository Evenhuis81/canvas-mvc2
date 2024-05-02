import {gameStore} from '../store';
import {vector} from 'library/canvas';

const properties = {
    type: 'strokeRoundRect',
    x: 1,
    y: 1,
    sX: 3,
    sY: 1,
    r: 10,
    color: 'purple',
};

export const getButton = (txt: string) => {
    const {tv} = gameStore.state;

    const show = () => {
        tv.strokeRoundRect(properties);
        tv.text(txt, vector(2, 2));
    };

    return {show};
};
