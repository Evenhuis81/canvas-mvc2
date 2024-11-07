import {Input} from './input';
import {StatisticOptions} from './statistics';

interface Resources {
    id: string | number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    container: HTMLDivElement;
    engine: Engine;
    input: Input;
}

interface CanvasOptions {
    width: number;
    height: number;
    backgroundColor: string;
    contextMenu: boolean;
}

interface LibraryOptions extends CanvasOptions {
    containerID: string;
    center: boolean;
    full: boolean; // full tab (innerWidth, innerHeight)
    clear: boolean;
    flex: boolean;
    statistics?: StatisticOptions;
}

interface DualViewProperties {
    id: number | string;
    canvas1: HTMLCanvasElement;
    canvas2: HTMLCanvasElement;
    container: HTMLDivElement;
    engine: Engine;
    active: boolean;
    transitioning: boolean;
    onActivation: () => void;
    onDeactivation: () => void;
}

// interface CRUD {
//     create: () => {};
//     read: () => {};
//     update: () => {};
//     delete: () => {};
// }
