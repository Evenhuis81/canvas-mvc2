import {LibraryInput} from 'library/types/input';
import {Pos} from 'library/types/shapes';
import {TVMethods, TVProperties} from 'library/types/views';

export const tvInput = ({startPan, offset, scale}: TVProperties, {s2W}: TVMethods, input: LibraryInput) => {
    const inputID = Symbol();

    const mousedown = ({button, offsetX, offsetY}: MouseEvent) => {
        if (button === 0) {
            startPan.x = offsetX;
            startPan.y = offsetY;
        }
    };

    const mousemove = ({offsetX, offsetY}: MouseEvent) => {
        if (input.mouse.buttonHeld[0]) {
            offset.x -= (offsetX - startPan.x) / scale.x;
            offset.y -= (offsetY - startPan.y) / scale.y;

            startPan.x = offsetX;
            startPan.y = offsetY;
        }
    };

    const zoom = createZoom(properties);

    const wheelZoom = (evt: WheelEvent) => {
        if (evt.deltaY < 0) return zoom(input.mouse, 'in');

        zoom(input.mouse, 'out');
    };

    const activate = () => {
        input.addListener({
            id: inputID,
            type: 'mousedown',
            listener: mousedown,
        });
        input.addListener({
            id: inputID,
            type: 'mousemove',
            listener: mousemove,
        });
        input.addListener({
            id: inputID,
            type: 'wheel',
            listener: wheel,
        });
    };

    const deactivate = () => {
        input.removeListener('mousedown', inputID);
        input.removeListener('mousemove', inputID);
    };

    return {activate, deactivate};
};

const createZoom = (
    {offset, worldBeforeZoom, worldAfterZoom, scale, scaleFactor}: TVProperties,
    methods: TVMethods,
) => {
    const mechanic = {
        in: () => {
            scale.x /= scaleFactor.x;
            scale.y /= scaleFactor.y;
        },
        out: () => {
            scale.x *= scaleFactor.x;
            scale.y *= scaleFactor.y;
        },
    };

    return {
        zoom: (zoomPos: Pos, type: 'in' | 'out') => {
            worldBeforeZoom = methods.s2W(zoomPos.x, zoomPos.y);

            mechanic[type]();

            worldAfterZoom = methods.s2W(zoomPos.x, zoomPos.y);

            offset.x += worldBeforeZoom.xT - worldAfterZoom.xT;
            offset.y += worldBeforeZoom.yT - worldAfterZoom.yT;
        },
    };
};

// TODO::Create zooming update that smoothly scales instead of react on keydown
// const keydownHandler =
//     ({zoom, getMiddleScreen}: TVMethods) =>
//     ({code}: KeyboardEvent) => {
//         if (code === 'KeyQ') zoom(getMiddleScreen(), 'out');
//         else if (code === 'KeyE') zoom(getMiddleScreen(), 'in');
//     };

// const wheelHandler =
//     ({zoom}: TVMethods, {mouse}: LibraryInput) =>
//     (evt: WheelEvent) => {
//         if (evt.deltaY < 0) {
//             zoom(mouse, 'in');

//             return;
//         }

//         zoom(mouse, 'out');
//     };

// export const setTVEvents = (props: TVProperties, methods: TVMethods, input: LibraryInput) => {
//     addEventListener('mousedown', mousedownHandler(props, methods));
//     addEventListener('mousemove', mousemoveHandler(props, input));
//     addEventListener('keydown', keydownHandler(methods));
//     addEventListener('wheel', wheelHandler(methods, input));
// };
