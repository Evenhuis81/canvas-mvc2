interface EntityEvents {
    show: () => void;
    hide: () => void;
    destroy: () => void;
    enable: () => void;
    disable: () => void;
}

// all, except internal properties are part of the config object (incoming, user defined | undefined = all default entity properties)
interface EntitySketch {
    id: number | string;
    name: string;
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

interface EntityStatic {
    handlers: EntityHandlers;
    events: EntityEvents;
}

interface EntityInstance {
    disabled: boolean;
    show: boolean;
    click: Partial<EntityHandlers>;
}

interface InternalEntity {
    entity: Omit<EntityConfig, 'disabled' | 'show' | 'click'>;
    events: EntityEvents;
    disabled: boolean;
    show: boolean;
    handlers: EntityHandlers;
}

type EntityHandlers = {
    down: (event: EntityEvents) => void;
    up: (event: EntityEvents) => void;
};

// Good naming conventions for entity:
// 1. Sketch
// 2. Drawing Object
// 3. Drawing List
// 4. Illustration
// 5. EntityInstance (for internal)
// 6.config = options ?
// 7.
//
