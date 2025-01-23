import {BaseCircle, BaseRect, Shape} from './shapes';

// type MouseDown = 'mousedown';
// type MouseMove = 'mousemove';
// type MouseUp = 'mouseup';
// type KeyDown = 'keydown';
// type KeyUp = 'keyup';
// type Wheel = 'wheel';

// interface Events {
//     mousedown: MouseDown;
//     mousemove: MouseMove;
//     mouseup: MouseUp;
//     keydown: KeyDown;
//     keyup: KeyUp;
//     wheel: Wheel;
// }

type InsideRect = (rect: BaseRect) => boolean;
type InsideCircle = (circle: BaseCircle) => boolean;
type Inside = (shape: Shape) => boolean | undefined;

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

export type InputListenerStorage = {
    [K in InputListenerType]: InputListener<K>[];
};

export type InputListenerEventMap = {
    [K in InputListenerType]: HTMLElementEventMap[K];
};

export type InputListener<K extends InputListenerType> = {
    type: K;
    listener: (evt: HTMLElementEventMap[K]) => void;
    id: symbol;
    shape: Shape;
};

// Used by Library Entity
export type InputListenerMap<T extends InputListenerType> = {
    [K in T]: (evt: InputListenerEventMap[K]) => void;
};

export type InputListenerExternal<K extends InputListenerType> = (evt: HTMLElementEventMap[K]) => void;
