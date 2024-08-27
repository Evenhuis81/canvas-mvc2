import type {Engine} from './engine';
import type {Input} from './input';
import type {StaticView, TransformedView} from './tv';

interface Resources {
    id: string | number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    container: HTMLDivElement;
    engine: Engine;
    sv: StaticView;
    tv: TransformedView;
    input: Input;
}

type StatisticCanvasOptions = {
    overlay: boolean;
    dualView: boolean;
    toggleKey: string;
};

type StatisticInitializeResource = Omit<Resources, 'sv' | 'tv' | 'input'> & {
    toggleKey: string;
};

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
    statistics: Partial<StatisticCanvasOptions>;
}>;

type DualViewProperties = {
    id: number | string;
    canvas1: HTMLCanvasElement;
    canvas2: HTMLCanvasElement;
    container: HTMLDivElement;
    engine: Engine;
    active: boolean;
    transitioning: boolean;
    onActivation: () => void;
    onDeactivation: () => void;
};
