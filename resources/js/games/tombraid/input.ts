import {vector} from '../library/canvas';

export const setEvent = <EventType extends keyof Partial<WindowEventMap>>(
    type: EventType,
    listener: (evt: WindowEventMap[EventType]) => void,
) => addEventListener<EventType>(type, listener);

export const mouse = vector();

export const keyHeld: boolean[] = [];

export const setMouseInput = (canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();

    addEventListener('mousemove', evt => {
        // mouse.setXY(+evt.offsetX.toFixed(0), +evt.offsetY.toFixed(0));
        mouse.x = +(evt.clientX - rect.left).toFixed(0);
        mouse.y = +(evt.clientY - rect.top).toFixed(0);
    });
};
