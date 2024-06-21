import type {Engine} from './engine';
import type {TransformedView} from './tv';

export interface Resources {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
}

export interface ResourcesAndTV extends Resources {
    tv: TransformedView;
}
