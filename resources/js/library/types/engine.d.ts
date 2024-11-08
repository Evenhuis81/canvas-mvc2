export type Update = {
    id?: number | string;
    name?: string;
    fn: (deltaTime: number) => void;
};

export type Draw = Omit<Update, 'fn'> & {
    fn: () => void;
};

interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    setUpdate: (update: Update) => void;
    setDraw: (draw: Draw) => void;
    removeUpdate: (id: number | string) => void;
    removeDraw: (id: number | string) => void;
    info: {
        updates: {
            length: () => number;
            ids: () => (string | number | undefined)[];
        };
        draws: {
            length: () => number;
            ids: () => (string | number | undefined)[];
        };
    };
}

type EngineProperties = {
    updates: Update[];
    draws: Draw[];
    requestID: number;
    stop: boolean;
    timePassed: number;
    lastTime: number;
};
