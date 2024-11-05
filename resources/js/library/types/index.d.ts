import {Input} from './input';

interface Resources {
    id: string | number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    container: HTMLDivElement;
    engine: Engine;
    sv: StaticView;
    input: Input;
}

interface ResourcesAndTV extends Resources {
    tv: TransformedView;
}

type StatisticViewType = 'popup' | 'overlay' | 'tab' | 'dual';

interface StatisticOptions {
    type: StatisticViewType;
    toggleKey: string; // create default when no toggleKey or button is provided and log/warning to user
    button: boolean; // expand with options (position, ...)
    width: number; // width & height | top & left -> autoset type to popup
    height: number;
    top: number;
    left: number;
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
    statistics: Partial<StatisticOptions>;
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

interface CRUD {
    create: () => {};
    read: () => {};
    update: () => {};
    delete: () => {};
}
