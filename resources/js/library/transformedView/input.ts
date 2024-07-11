import {Input} from 'library/types';
import type {MethodsTV, PropertiesTV} from '../types/tv';

const mousedownHandler =
    ({startPan}: PropertiesTV, methods: MethodsTV) =>
    (evt: MouseEvent) => {
        if (evt.button === 0) {
            startPan.x = evt.offsetX;
            startPan.y = evt.offsetY;

            methods.screen2World(evt.offsetX, evt.offsetY); // = set to world vector
        }
    };

const mousemoveHandler = (props: PropertiesTV) => (evt: MouseEvent) => {
    props.offset.x -= (evt.offsetX - props.startPan.x) / props.scale.x;
    props.offset.y -= (evt.offsetY - props.startPan.y) / props.scale.y;

    props.startPan.x = evt.offsetX;
    props.startPan.y = evt.offsetY;
};

// TODO::Create zooming update that smoothly scales instead of react on keydown
const keydownHandler =
    ({zoom, getMiddleScreen}: MethodsTV) =>
    ({code}: KeyboardEvent) => {
        if (code === 'KeyQ') zoom(getMiddleScreen(), 'out');
        else if (code === 'KeyE') zoom(getMiddleScreen(), 'in');
    };

const wheelHandler =
    ({zoom}: MethodsTV, {mouse}: Input) =>
    (evt: WheelEvent) => {
        if (evt.deltaY < 0) {
            zoom(mouse, 'in');

            return;
        }

        zoom(mouse, 'out');
    };

export const setTVEvents = (props: PropertiesTV, methods: MethodsTV, input: Input) => {
    addEventListener('mousedown', mousedownHandler(props, methods));
    addEventListener('mousemove', mousemoveHandler(props));
    addEventListener('keydown', keydownHandler(methods));
    addEventListener('wheel', wheelHandler(methods, input));
};
