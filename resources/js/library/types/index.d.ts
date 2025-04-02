import {Engine} from './engine';
import {Phaser} from 'games/phaser/types';
import {LibraryInput} from './input';
import {CreateElement} from 'library/entity';
import {ShapeMap} from 'library/entity/defaults/shapes';
import {TransformedView} from './views';

/**
 * Removes undefined from tuples
 */
export type FilterUndefined<T extends unknown[]> = T extends []
    ? []
    : T extends [infer H, ...infer R]
    ? H extends undefined
        ? FilterUndefined<R>
        : [H, ...FilterUndefined<R>]
    : T;

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type KeyWithCallback<A extends object> = {
    [K in keyof A]: [K, (evt: A[K]) => void];
}[keyof A];

export type WithOptional<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};

// Full 'T &' keeps discriminated union (type), test with MakeOptional instead of Omit
export type WithRequired<T, K extends keyof T> = T & {[P in K]-?: T[P]};

export type BaseID = string | number | symbol;

export interface LibraryResources {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
    input: LibraryInput;
    runEngine: () => void;
    runEngineOnce: () => void;
    createPhaser: () => Phaser;
    createElement: CreateElement<ShapeMap>; // TODO::Make generic
    views: {
        tv: TransformedView;
        // sv: StaticView;
    };
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
    engineStats: boolean;
    // statistics: Partial<StatisticOptions>;
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
