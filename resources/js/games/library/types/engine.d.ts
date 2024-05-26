import {Show, Update} from '.';

export interface Engine {
    setUpdate: (update: Update) => void;
    setShow: (show: Show) => void;
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    showsOverview: () => void;
    updatesOverview: () => void;
}
