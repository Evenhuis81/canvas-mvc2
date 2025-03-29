import {LibraryInput} from 'library/types/input';
import {MethodsTV, PropertiesTV} from 'library/types/views';

const mousedownHandler =
    ({startPan}: PropertiesTV, methods: MethodsTV) =>
    ({button, offsetX, offsetY}: MouseEvent) => {
        if (button === 0) {
            startPan.x = offsetX;
            startPan.y = offsetY;

            methods.screen2World(offsetX, offsetY); // = set to world vector
        }
    };

const mousemoveHandler =
    (props: PropertiesTV, {mouse}: LibraryInput) =>
    ({offsetX, offsetY}: MouseEvent) => {
        if (mouse.buttonHeld[0]) {
            props.offset.x -= (offsetX - props.startPan.x) / props.scale.x;
            props.offset.y -= (offsetY - props.startPan.y) / props.scale.y;

            props.startPan.x = offsetX;
            props.startPan.y = offsetY;
        }
    };

// TODO::Create zooming update that smoothly scales instead of react on keydown
const keydownHandler =
    ({zoom, getMiddleScreen}: MethodsTV) =>
    ({code}: KeyboardEvent) => {
        if (code === 'KeyQ') zoom(getMiddleScreen(), 'out');
        else if (code === 'KeyE') zoom(getMiddleScreen(), 'in');
    };

const wheelHandler =
    ({zoom}: MethodsTV, {mouse}: LibraryInput) =>
    (evt: WheelEvent) => {
        if (evt.deltaY < 0) {
            zoom(mouse, 'in');

            return;
        }

        zoom(mouse, 'out');
    };

export const setTVEvents = (props: PropertiesTV, methods: MethodsTV, input: LibraryInput) => {
    addEventListener('mousedown', mousedownHandler(props, methods));
    addEventListener('mousemove', mousemoveHandler(props, input));
    addEventListener('keydown', keydownHandler(methods));
    addEventListener('wheel', wheelHandler(methods, input));
};
