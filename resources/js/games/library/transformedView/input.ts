import {TVProperties} from '../types/tv';
import {keyHeld, mouse} from 'games/tombraid/input';

const mousedownHandler = (tv: TVProperties) => (evt: MouseEvent) => {
    keyHeld[evt.button] = true;
    if (evt.button === 0) {
        tv.startPan.setXY(evt.offsetX, evt.offsetY);

        tv.screen2World(evt.offsetX, evt.offsetY); // = set to world vector
    }
};

const mousemoveHandler = (tv: TVProperties) => (evt: MouseEvent) => {
    if (keyHeld[0]) {
        tv.offset.x -= (evt.offsetX - tv.startPan.x) / tv.scale.x;
        tv.offset.y -= (evt.offsetY - tv.startPan.y) / tv.scale.y;

        tv.startPan.setXY(evt.offsetX, evt.offsetY);
    }
};

const mouseupHandler =
    () =>
    ({button}: MouseEvent) => {
        delete keyHeld[button];
    };
const keydownHandler =
    (tv: TVProperties) =>
    ({code}: KeyboardEvent) => {
        if (code === 'KeyQ') tv.zoom(tv.getMiddleScreen(), 'out');
        else if (code === 'KeyE') tv.zoom(tv.getMiddleScreen(), 'in');
    };
const wheelHandler = (tv: TVProperties) => (evt: WheelEvent) => {
    if (evt.deltaY < 0) {
        tv.zoom(mouse, 'in');

        return;
    }

    tv.zoom(mouse, 'out');
};

export const setTVEvents = (tv: TVProperties) => {
    addEventListener('mousedown', mousedownHandler(tv));
    addEventListener('mousemove', mousemoveHandler(tv));
    addEventListener('mouseup', mouseupHandler());
    addEventListener('keydown', keydownHandler(tv));
    addEventListener('wheel', wheelHandler(tv));
};
