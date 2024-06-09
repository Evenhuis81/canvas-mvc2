export type Square = {
    id: number;
    x: number;
    y: number;
    s: number;
    r: number;
    alpha: number;
    alphaVel: number;
    angle: number;
    angleVel: number;
    red: number;
    green: number;
    blue: number;
    minAlpha: number;
    maxAlpha: number;
    vX: number;
    vY: number;
    blinked: number;
    paused: boolean;
};

export type Side = 'top' | 'bottom' | 'left' | 'right';
