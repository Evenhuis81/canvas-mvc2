import {Phaser} from 'games/phaser/types';
import {Engine} from './engine';
import {Entity, EntityConfig} from './entity';

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};

// Complete 'T &' keeps discriminated union (type), test with MakeOptional instead of Omit
export type WithRequired<T, K extends keyof T> = T & {[P in K]-?: T[P]};

export interface LibraryResources {
    // id: string | number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
    // container: HTMLDivElement;
    // sv: StaticView; // empty
    // input: LibraryInput;
    runEngine: () => void;
    runEngineOnce: () => void;
    createPhaser: () => Phaser;
    createEntity: (options?: EntityConfig) => Entity;
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
