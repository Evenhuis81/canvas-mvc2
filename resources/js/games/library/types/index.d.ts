import type {Engine} from './engine';
import type {TransformedView} from './tv';

export interface Vector {
    x: number;
    y: number;
}

export interface Vector2 {
    x: number;
    y: number;
    x2: number;
    y2: number;
}
// add: (vector: Vector2) => void;
// set: (vector: Vector2) => void;
// setManual: (x: number, y: number, x2: number, y2: number) => void;
// add: (vector: Vector) => void;
// set: (vector: Vector) => void;
// setXY: (xInc: number, yInc: number) => void;
// limit: (max: number) => void;
// mult: (num: number) => void;
// div: (num: number) => void;

export interface Resources {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
    tv: TransformedView;
}

export type Update = {
    id: number;
    name: string;
    fn: () => void;
};

export type Show = Update;
