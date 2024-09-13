interface EntitySketch {
    x: number;
    y: number;
    w: number;
    h: number;
    lw: number;
    r: number;
    stroke: string;
    fill: string;
    textFill: string;
    text: string;
    font: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
}

interface EntityEvents {
    show: () => void;
    hide: () => void;
    destroy: () => void;
    enable: () => void;
    disable: () => void;
}

interface EntityProperties {
    id: number | string;
    name: string;
    disabled: boolean;
    show: boolean;
}

interface EntityListeners {
    add: () => void;
    remove: () => void;
    listening: boolean;
}

// handlers = user input, listeners = browser implemented
interface Entity {
    properties: EntityProperties;
    sketch: EntitySketch;
    events: EntityEvents;
    handlers: MouseHandlers;
    listeners: EntityListeners;
}

// click = mouse & touch (touch not yet implemented): see comments.txt for notes (expand into instructions)
// MouseEvent => ButtonEvent (see button.ts)

interface MouseHandlers {
    mouseup: (event: MouseEvent) => void;
    mousedown: (event: MouseEvent) => void;
    mousebutton: number;
}

interface EntityHandlers {
    mouse: Partial<MouseHandlers>;
}

type EntityConfig = EntitySketch & EntityProperties & EntityHandlers;

type InternalEntity = Omit<Entity, 'events'> & {
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
};
