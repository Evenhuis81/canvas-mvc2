import {EngineDraw} from 'library/types/engine';

export type PhaserProperties = {
    id: string;
    phase: PhaserPhase; // current or active phase
    timer: number;
    totalTime: number;
    active: boolean; // = phase.duration = 0?
    event: PhaserUpdateEvent;
};

export type PhaserUpdateEvent = {
    phasePercentage: number;
    phasePercentageReverse: number;
};

export type PhaserMethods = {
    startDraw: () => void;
    stopDraw: () => void;
    setPhase: (phaseNr?: number) => boolean;
    endPhase: () => void;
    endPhaser: () => void;
    resetPhaseProperties: () => void;
};

export type PhaserUpdate = (evt: PhaserUpdateEvent) => void;

export type PhaserDraw = {
    draw: EngineDraw['fn'];
    pre?: () => void;
    post?: () => void;
    remove?: boolean;
};

export type PhaserPhase = {
    id: number;
    duration: number;
    update?: PhaserUpdate;
    pre?: () => void;
    post?: () => void;
};
