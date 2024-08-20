export type Update = {
    id?: number | string;
    name?: string;
    fn: (deltaTime: number) => void;
};

export type Show = Omit<Update, 'fn'> & {
    fn: () => void;
};

export interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    setUpdate: (update: Update) => void;
    setShow: (show: Show) => void;
    removeUpdate: (id: number | string) => void;
    removeShow: (id: number | string) => void;
    info: () => void;
}

type EngineProperties = {
    updates: Update[];
    shows: Show[];
    requestID: number;
    stop: boolean;
    timePassed: number;
    lastTime: number;
};
