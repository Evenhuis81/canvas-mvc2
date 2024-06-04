export type MouseDown = 'mousedown';
export type MouseMove = 'mousemove';
export type MouseUp = 'mouseup';
export type KeyDown = 'keydown';
export type KeyUp = 'keyup';
export type Wheel = 'wheel';

export interface Events {
    mousedown: MouseDown;
    mousemove: MouseMove;
    mouseup: MouseUp;
    keydown: KeyDown;
    keyup: KeyUp;
    wheel: Wheel;
}
