import type {InputEventMap} from './entity';
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
        touchEnded: boolean;
    };
    touch: {
        x: number;
        y: number;
        insideRect: InsideRect;
        insideCircle: InsideCircle;
    };
    buttonHeld: Record<number, boolean>;
    keyHeld: Record<string, boolean>;
    addListener: <T extends InputMap>(
        type: T,
        input: (evt: HTMLElementEventMap[T]) => void,
        props: InputEventMap[T],
        // This needs to be adjusted in time to fit all kind of shapes and extract the right one based on input type given
        shape?: Shapes,
    ) => void;
    removeListener: <T extends InputMap>(type: T) => void;
};

// return {
//     mouse: Object.assign(mouse, {
//         insideRect: insideMouseRect,
//         insideCircle: insideMouseCircle,
//         inside: insideMouse,
//     }),
//     touch: Object.assign(touch, {insideRect: insideTouchRect, insideCircle: insideTouchCircle}),
//     buttonHeld,
//     keyHeld,
//     addListener,
//     removeListener,
// };

type InputMap = 'mousedown' | 'mousemove' | 'mouseup' | 'keydown' | 'keyup' | 'touchstart' | 'touchmove' | 'touchend';

export type InputListenersMap = {
    [K in InputMap]: {
        type: K;
        listener: (evt: HTMLElementEventMap[K]) => void;
        props: InputEventMap[K];
        shape?: Shapes;
    }[];
};
