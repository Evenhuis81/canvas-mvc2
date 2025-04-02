import {LibraryInput} from 'library/types/input';
import {Pos} from 'library/types/shapes';
import {TVMethods, TVProperties} from 'library/types/views';

export const createInputTV = (properties: TVProperties, methods: TVMethods, input: LibraryInput) => {
    const {startPan, offset, scale} = properties;
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

    const zoom = createZoom(properties, methods);

    const wheelZoom = (evt: WheelEvent) => {
        if (evt.deltaY < 0) return zoom(input.mouse, 'in');

        zoom(input.mouse, 'out');
    };

    const activateMouse = () => {
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
            listener: wheelZoom,
        });
    };

    const deactivateMouse = () => {
        input.removeListener('mousedown', inputID);
        input.removeListener('mousemove', inputID);
    };

    // TODO::Create zooming update that smoothly scales instead of react on keydown
    // const keydownHandler =
    //     ({zoom, getMiddleScreen}: TVMethods) =>
    //     ({code}: KeyboardEvent) => {
    //         if (code === 'KeyQ') zoom(getMiddleScreen(), 'out');
    //         else if (code === 'KeyE') zoom(getMiddleScreen(), 'in');
    //     };

    return {
        mouseInput: {
            activate: activateMouse,
            deactivate: deactivateMouse,
        },
        keyboardInput: {
            //
        },
    };
};

const createZoom = ({offset, worldBeforeZoom, worldAfterZoom, scale, scaleFactor}: TVProperties, {s2W}: TVMethods) => {
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

    return (zoomPos: Pos, type: 'in' | 'out') => {
        worldBeforeZoom = s2W(zoomPos.x, zoomPos.y);

        mechanic[type]();

        worldAfterZoom = s2W(zoomPos.x, zoomPos.y);

        offset.x += worldBeforeZoom.xT - worldAfterZoom.xT;
        offset.y += worldBeforeZoom.yT - worldAfterZoom.yT;
    };
};
