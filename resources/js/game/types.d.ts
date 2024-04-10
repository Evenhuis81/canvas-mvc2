export interface Engine {
    setUpdate: (update: Update) => void;
    setShow: (show: Show) => void;
    run: () => void;
    halt: () => void;
}

export interface GameResource {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    player: Player;
    platform: Platform;
    engine: Engine;
}

export interface CanvasOptions {
    width: number;
    height: number;
    backgroundColor: string;
    position: string;
}

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

export type Update = () => void;
export type Show = () => void;
export type Updates = Update[];
export type Shows = Show[];

export type RectangleCollisionObject = {
    pos: {x: number; y: number};
    size: {x: number; y: number};
};
