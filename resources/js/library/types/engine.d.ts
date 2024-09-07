type Update = {
    id?: number | string;
    name?: string;
    fn: (deltaTime: number) => void;
};

type Show = Omit<Update, 'fn'> & {
    fn: () => void;
};

type Draw = Show;

interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    setUpdate: (update: Update) => void;
    setShow: (show: Show) => void;
    removeUpdate: (id: number | string) => void;
    removeShow: (id: number | string) => void;
    info: {
        updates: {
            length: () => number;
            ids: () => (string | number | undefined)[];
        };
        shows: {
            length: () => number;
            ids: () => (string | number | undefined)[];
        };
    };
}

type EngineProperties = {
    updates: Update[];
    shows: Show[];
    requestID: number;
    stop: boolean;
    timePassed: number;
    lastTime: number;
};
