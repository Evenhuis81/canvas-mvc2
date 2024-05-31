import {getCanvas, getContext2D} from './canvas';
import {getEngine} from './engine';
import {getTV} from './transformedView';

export const getDefaultResource = () => {
    const canvas = getCanvas();
    const context = getContext2D(canvas);
    const engine = getEngine();
    const tv = getTV(context);

    tv.setDefaults(context);

    return {canvas, context, engine, tv};
};
