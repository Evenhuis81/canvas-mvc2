import {BaseID} from '.';
import {Engine} from './engine';
import {Circle, Pos, Rect} from './shapes';

type InsideRect = (rect: Rect) => boolean;
type InsideCircle = (circle: Circle) => boolean;
type Inside = (shape: InputShape) => boolean | undefined;

export type LibraryInput = {
    mouse: {
        buttonHeld: Record<number, boolean>;
        x: number;
        y: number;
        insideShape: Inside;
    };
    touch: {
        x: number;
        y: number;
        insideShape: Inside;
        ended: boolean;
    };
    keyboard: {
        keyHeld: Record<string, boolean>;
    };
    addMovement: AddMovement;
    removeMovement: RemoveMovement;
    addListener: <K extends keyof InputListenerEventMap>(listener: InputListener<K>) => void;
    removeListener: (type: keyof InputListenerEventMap, id: symbol) => boolean;
};

export type AddMovement = (id: BaseID, keys: string[], handlers: (() => void)[]) => void;

export type RemoveMovement = (id: BaseID) => void;

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
    shape?: InputShape;
};

export type InputShape = (Circle & {inputType: 'circle'}) | (Rect & {inputType: 'rect'});
