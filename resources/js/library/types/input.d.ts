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
    addListener: <T extends InputMap>(type: T, input: (evt: HTMLElementEventMap[T]) => void, rect: TVRect) => void;
    removeListener: <T extends InputMap>(type: T) => void;
};

type InputMap = 'mousedown' | 'mousemove' | 'mouseup' | 'keydown' | 'keyup' | 'touchstart' | 'touchmove' | 'touchend';

export type InputListenersMap = {
    [K in InputMap]: {type: K; listener: (evt: HTMLElementEventMap[K]) => void; rect?: TVRect}[];
};
