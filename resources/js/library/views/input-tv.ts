import type {Engine} from 'library/types/engine';
import type {LibraryInput} from 'library/types/input';
import type {Pos} from 'library/types/shapes';
import type {TVMethods, TVProperties} from 'library/types/views';

export const createInputTV = (
    properties: TVProperties,
    methods: TVMethods,
    input: LibraryInput,
    engine: Engine,
    canvasWidth: number,
    canvasHeight: number,
) => {
    const inputID = Symbol();

    const mousedown = ({button, offsetX, offsetY}: MouseEvent) => {
        if (button === 0) {
            properties.startPan.x = offsetX;
            properties.startPan.y = offsetY;

            // clamp world to draw only if in screen
            const worldTL = methods.screen2World(0, 0);
            const worldBR = methods.screen2World(canvasWidth, canvasHeight);

            // console.log(worldTL.xT, worldTL.yT, worldBR.xT, worldBR.yT);)
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
        if (evt.deltaY < 0) return zoom('in', input.mouse, properties.scaleMouse);

        zoom('out', input.mouse, properties.scaleMouse);
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
        if (input.keyboard.keyHeld['KeyQ']) zoom('out', methods.screenMiddle(), properties.scaleKeyboard);
        if (input.keyboard.keyHeld['KeyE']) zoom('in', methods.screenMiddle(), properties.scaleKeyboard);
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

    // input.addListener({
    //     type: 'keyup',
    //     listener: ({code}) => {
    //         console.log(code);
    //     },
    //     id: Symbol(),
    // });

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
        in: (scaleFactor: number) => {
            props.scale.x /= scaleFactor;
            props.scale.y /= scaleFactor;
        },
        out: (scaleFactor: number) => {
            props.scale.x *= scaleFactor;
            props.scale.y *= scaleFactor;
        },
    };

    return (type: 'in' | 'out', zoomPos: Pos, scaleFactor: number) => {
        props.worldBeforeZoom = screen2World(zoomPos.x, zoomPos.y);

        mechanic[type](scaleFactor);

        props.worldAfterZoom = screen2World(zoomPos.x, zoomPos.y);

        props.offset.x += props.worldBeforeZoom.xT - props.worldAfterZoom.xT;
        props.offset.y += props.worldBeforeZoom.yT - props.worldAfterZoom.yT;
    };
};
