import type {Engine} from './engine';
import type {Input} from './input';
import type {TransformedView} from './tv';

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
    bg?: string;
    center?: boolean;
    full?: boolean; // full tab (innerWidth, innerHeight)
};
