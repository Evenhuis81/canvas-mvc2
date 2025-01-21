import {BaseCircle, BaseRect, Shapes} from './shapes';

type MouseDown = 'mousedown';
type MouseMove = 'mousemove';
type MouseUp = 'mouseup';
type KeyDown = 'keydown';
type KeyUp = 'keyup';
type Wheel = 'wheel';

interface Events {
    mousedown: MouseDown;
    mousemove: MouseMove;
    mouseup: MouseUp;
    keydown: KeyDown;
    keyup: KeyUp;
    wheel: Wheel;
}

type InsideRect = (rect: BaseRect) => boolean;
type InsideCircle = (circle: BaseCircle) => boolean;
type Inside = (shape: Shapes) => boolean | undefined;

export type LibraryInput = {
    mouse: {
        x: number;
        y: number;
        inside: Inside;
        insideRect: InsideRect;
        insideCircle: InsideCircle;
    };
    touch: {
        x: number;
        y: number;
        insideRect: InsideRect;
        insideCircle: InsideCircle;
        ended: boolean;
    };
    buttonHeld: Record<number, boolean>;
    keyHeld: Record<string, boolean>;
    addListener: <K extends InputListenerType>(listener: InputListener<K>) => void;
    removeListener: (type: InputListenerType, id: symbol) => boolean;
};

export type InputListenerType =
    | 'mousedown'
    | 'mousemove'
    | 'mouseup'
    | 'keydown'
    | 'keyup'
    | 'touchstart'
    | 'touchmove'
    | 'touchend';

export type InputListenersConfig = {
    [K in InputListenerType]: InputListenerConfig<K>[];
};

export type InputListeners<T extends InputListenerType> = {
    [K in T]: (evt: HTMLElementEventMap[K]) => void;
};

export type InputListenerConfig<K extends InputListenerType> = {
    type: K;
    listener: (evt: HTMLElementEventMap[K]) => void;
    id: symbol;
    shape: Shapes;
};
