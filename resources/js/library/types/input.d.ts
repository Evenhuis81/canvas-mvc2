import type {InputEventMap} from './entity';
import {Rect} from './paint';

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

type InsideRect = (rect: Rect) => boolean;

export type Input = {
    mouse: {
        x: number;
        y: number;
        insideRect: InsideRect;
        touchEnded: boolean;
    };
    touch: {
        x: number;
        y: number;
        insideRect: InsideRect;
    };
    buttonHeld: Record<number, boolean>;
    keyHeld: Record<string, boolean>;
    addListener: <T extends InputMap>(
        type: T,
        input: (evt: HTMLElementEventMap[T]) => void,
        props?: InputEventMap[T], // entity specific?
        rect?: Rect, // entity specific?
    ) => void;
    removeListener: <T extends InputMap>(type: T) => void;
};

type InputMap = 'mousedown' | 'mousemove' | 'mouseup' | 'keydown' | 'keyup' | 'touchstart' | 'touchmove' | 'touchend';

export type InputListenersMap = {
    [K in InputMap]: {
        type: K;
        listener: (evt: HTMLElementEventMap[K]) => void;
        props?: InputEventMap[K];
        rect?: Rect;
    }[];
};
