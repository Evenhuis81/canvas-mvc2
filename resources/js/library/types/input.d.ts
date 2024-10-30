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

type InsideRect = (rect: TVRect) => boolean;

type Input = {
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
    setInput: <T extends InputMap>(type: T, input: (evt: HTMLElementEventMap[T]) => void) => void;
};

type InputMap = 'mousedown' | 'mousemove' | 'mouseup' | 'keydown' | 'keyup' | 'touchstart' | 'touchmove' | 'touchend';

export type InputListenersMap = {[K in InputMap]: ((evt: HTMLElementEventMap[K]) => void)[]};
