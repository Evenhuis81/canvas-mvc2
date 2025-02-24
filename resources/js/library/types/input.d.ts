import {Circle, Rect} from './shapes';

type InsideRect = (rect: Rect) => boolean;
type InsideCircle = (circle: Circle) => boolean;
type Inside = (shape: InputShape) => boolean | undefined;

export type LibraryInput = {
    mouse: {
        buttonHeld: Record<number, boolean>;
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
    keyboard: {
        keyHeld: Record<string, boolean>;
    };
    addListener: <K extends keyof InputListenerEventMap>(listener: InputListener<K>) => void;
    removeListener: (type: keyof InputListenerEventMap, id: symbol) => boolean;
};

export type InputListenerEventMap = {
    mousedown: MouseEvent;
    mousemove: MouseEvent;
    mouseup: MouseEvent;
    keydown: KeyboardEvent;
    keyup: KeyboardEvent;
    touchstart: TouchEvent;
    touchmove: TouchEvent;
    touchend: TouchEvent;
};

export type InputListenerStore = {
    [K in keyof InputListenerEventMap]: InputListener<K>[];
};

export type InputListener<K extends keyof InputListenerEventMap> = {
    type: K;
    listener: (event: HTMLElementEventMap[K]) => void;
    id: symbol;
    shape: InputShape | undefined;
};

export type InputShape = (Circle & {inputType: 'circle'}) | (Rect & {inputType: 'rect'});
