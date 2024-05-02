import {vector} from '../library/canvas';

export const setEvent = <EventType extends keyof Partial<WindowEventMap>>(
    type: EventType,
    listener: (evt: WindowEventMap[EventType]) => void,
) => addEventListener<EventType>(type, listener);

export const mouse = vector();

setEvent('mousemove', evt => {
    //
    // mouse.x = +(evt.clientX - rect.left).toFixed(0);
    // mouse.y = +(evt.clientY - rect.top).toFixed(0);

    mouse.setXY(evt.offsetX, evt.offsetY);
});
