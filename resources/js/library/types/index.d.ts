import type {Engine} from './engine';
import type {Input} from './input';
import type {StaticView, TransformedView} from './tv';

interface Resources {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
    sv: StaticView;
    tv: TransformedView;
    input: Input;
}

type CanvasOptions = Partial<{
    containerID: string;
    width: number;
    height: number;
    bg: string;
    center: boolean;
    full: boolean; // full tab (innerWidth, innerHeight)
    clear: boolean;
    ontextMenu: boolean;
    dualView: boolean;
    statistics: boolean;
}>;

type DualViewProperties = {
    canvas1: HTMLCanvasElement;
    canvas2: HTMLCanvasElement;
    container: HTMLDivElement;
    active: boolean;
    transitioning: boolean;
};
