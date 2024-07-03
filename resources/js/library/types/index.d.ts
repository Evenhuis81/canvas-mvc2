import type {Engine} from './engine';
import type {TransformedView} from './tv';

interface Resources {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
}

interface ResourcesAndTV extends Resources {
    tv: TransformedView;
}

type CanvasOptions = {
    width?: number;
    height?: number;
    backgroundColor?: string;
    center?: boolean;
    full?: boolean; // full tab (innerWidth, innerHeight)
};
