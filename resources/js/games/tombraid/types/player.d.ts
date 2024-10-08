type PlayerProperties = {
    posMiddle: Vector; // middle of rect
    pos: Vector;
    vel: Vector;
    acc: Vector;
    w: number;
    h: number;
    accSpeed: number;
    maxSpeed: number;
    friction: number;
    direction: 'none' | 'up' | 'down' | 'left' | 'right';
    lastPos: Vector;
    topLeft: string;
    bottomLeft: string;
    topRight: string;
    bottomRight: string;
    xInt: number;
    yInt: number;
    movement: 'free' | 'strict';
};

type TRPlayer = {
    update: {
        id: number;
        name: string;
        fn: () => void;
    };
    draw: {
        id: number;
        name: string;
        fn: () => void;
    };
    setPosition: (pos: Vector) => void;
    middlePos: Vector;
};
