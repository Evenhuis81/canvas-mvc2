export type Update = {
    id: number;
    name: string;
    fn: () => void;
};

export type Show = Update;

export interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    setUpdate: (update: Update) => void;
    setShow: (show: Show) => void;
    removeUpdate: (id: number) => void;
    removeShow: (id: number) => void;
}

type EngineProperties = {
    updates: Update[];
    shows: Show[];
    requestID: number;
    stop: boolean;
};
