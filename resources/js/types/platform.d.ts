export interface Player {
    update: () => void;
    show: () => void;
    pos: {x: number; y: number};
    size: {x: number; y: number};
}

export interface Platform {
    // update: () => void;
    show: () => void;
    pos: {x: number; y: number};
    size: {x: number; y: number};
}

export type RectangleCollisionObject = {
    pos: {x: number; y: number};
    vel: {x: number; y: number};
    acc: {x: number; y: number};
    size: {x: number; y: number};
};
