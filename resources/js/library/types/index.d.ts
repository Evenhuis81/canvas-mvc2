import type {Engine} from './engine';
import type {TransformedView} from './tv';
import {Vector} from './vector';

interface Resources {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
}

interface ResourcesAndTV extends Resources {
    tv: TransformedView;
    input: Input;
}

type CanvasOptions = {
    width?: number;
    height?: number;
    backgroundColor?: string;
    center?: boolean;
    full?: boolean; // full tab (innerWidth, innerHeight)
};

type Input = {
    mouse: Vector;
    buttonHeld: Record<number, boolean>;
    keyHeld: Record<string, boolean>;
};
