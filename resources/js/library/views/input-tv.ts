import type {Engine} from 'library/types/engine';
import type {LibraryInput} from 'library/types/input';
import type {Pos} from 'library/types/shapes';
import type {TVMethods, TVProperties} from 'library/types/views';

export const createInputTV = (properties: TVProperties, methods: TVMethods, input: LibraryInput, engine: Engine) => {
    const inputID = Symbol();

    const mousedown = ({button, offsetX, offsetY}: MouseEvent) => {
        if (button === 0) {
            properties.startPan.x = offsetX;
            properties.startPan.y = offsetY;
        }
    };

    const mousemove = ({offsetX, offsetY}: MouseEvent) => {
        if (input.mouse.buttonHeld[0]) {
            properties.offset.x -= (offsetX - properties.startPan.x) / properties.scale.x;
            properties.offset.y -= (offsetY - properties.startPan.y) / properties.scale.y;

            properties.startPan.x = offsetX;
            properties.startPan.y = offsetY;
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

    const keyboardUpdate = () => {
        if (input.keyboard.keyHeld['KeyQ']) zoom(methods.screenMiddle(), 'out');
        if (input.keyboard.keyHeld['KeyE']) zoom(methods.screenMiddle(), 'in');
    };

    const activateKeyboard = () => {
        engine.setUpdate({
            id: inputID,
            fn: keyboardUpdate,
        });
    };

    const deactivateKeyboard = () => {
        engine.removeUpdate(inputID);
    };

    return {
        mouseInput: {
            activate: activateMouse,
            deactivate: deactivateMouse,
        },
        keyboardInput: {
            activate: activateKeyboard,
            deactivate: deactivateKeyboard,
        },
    };
};

const createZoom = (props: TVProperties, {screen2World}: TVMethods) => {
    const mechanic = {
        in: () => {
            props.scale.x /= props.scaleFactor.x;
            props.scale.y /= props.scaleFactor.y;
        },
        out: () => {
            props.scale.x *= props.scaleFactor.x;
            props.scale.y *= props.scaleFactor.y;
        },
    };

    return (zoomPos: Pos, type: 'in' | 'out') => {
        props.worldBeforeZoom = screen2World(zoomPos.x, zoomPos.y);

        mechanic[type]();

        props.worldAfterZoom = screen2World(zoomPos.x, zoomPos.y);

        props.offset.x += props.worldBeforeZoom.xT - props.worldAfterZoom.xT;
        props.offset.y += props.worldBeforeZoom.yT - props.worldAfterZoom.yT;
    };
};
