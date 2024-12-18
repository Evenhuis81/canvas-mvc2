import {Engine} from './engine';
import {LibraryInput} from './input';
import {StaticView} from './views';

export interface LibraryResources {
    id: string | number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    container: HTMLDivElement;
    engine: Engine;
    sv: StaticView; // empty
    input: LibraryInput;
}

export interface StatisticOptions {
    popup: boolean;
    overlay: boolean;
    tab: boolean;
    dualView: boolean;
    toggleKey: string;
}

interface CanvasOptions {
    width: number;
    height: number;
    backgroundColor: string;
    contextMenu: boolean;
}

export interface LibraryOptions extends CanvasOptions {
    containerID: string;
    center: boolean;
    full: boolean; // full tab (innerWidth, innerHeight)
    clear: boolean;
    dotMiddle: boolean;
    dualView: boolean;
    // statistics: Partial<StatisticOptions>;
    engineStats: boolean;
}

export interface DualViewProperties {
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

interface CRUD {
    create: () => {};
    read: () => {};
    update: () => {};
    delete: () => {};
}
