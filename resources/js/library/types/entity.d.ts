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

interface Entity {
    properties: EntityProperties;
    sketch: EntitySketch;
    events: EntityEvents;
    handlers: EntityHandlers;
    listeners: EntityListeners;
}

interface EntityHandlers {
    // down: (event: EntityEvents) => void;
    // up: (event: EntityEvents) => void;
    down: (event: MouseEvent) => void;
    up: (event: MouseEvent) => void;
}

type EntityConfig = EntitySketch &
    EntityProperties & {
        click: Partial<EntityHandlers>;
    };

type InternalEntity = Omit<Entity, 'events'> & {
    engine: Engine;
    context: CanvasRenderingContext2D;
};
