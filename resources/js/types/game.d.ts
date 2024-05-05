import {TransformedView} from 'library/types/tv';

export interface Engine {
    setUpdate: (update: Update) => void;
    setShow: (show: Show) => void;
    run: () => void;
    runOnce: () => void;
    halt: () => void;
}

export interface Vector {
    x: number;
    y: number;
    add: (vector: Vector) => void;
    set: (vector: Vector) => void;
    setXY: (xInc: number, yInc: number) => void;
    limit: (max: number) => void;
    mult: (num: number) => void;
    div: (num: number) => void;
}

export interface Vector2 {
    x: number;
    y: number;
    x2: number;
    y2: number;
    add: (vector: Vector2) => void;
    set: (vector: Vector2) => void;
    setManual: (x: number, y: number, x2: number, y2: number) => void;
}

export interface GameResource {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
    tv: TransformedView;
}

export interface CanvasOptions {
    width: number;
    height: number;
    backgroundColor: string;
}

export type Update = () => void;
export type Show = () => void;

export interface Events {
    mousedown: MouseDown;
    mousemove: MouseMove;
    mouseup: MouseUp;
    keydown: KeyDown;
    keyup: KeyUp;
    wheel: Wheel;
}

export type MouseDown = 'mousedown';
export type MouseMove = 'mousemove';
export type MouseUp = 'mouseup';
export type KeyDown = 'keydown';
export type KeyUp = 'keyup';
export type Wheel = 'wheel';
