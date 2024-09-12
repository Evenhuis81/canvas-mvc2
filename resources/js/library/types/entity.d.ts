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

interface InternalEntity {
    id: number | string;
    name: string;
    disabled: boolean;
    show: boolean;
    sketch: EntitySketch;
    events: EntityEvents;
    handlers: EntityHandlers;
}

interface EntityHandlers {
    down: (event: EntityEvents) => void;
    up: (event: EntityEvents) => void;
}

type EntityConfig = EntitySketch &
    Omit<InternalEntity, 'sketch' | 'events' | 'handlers'> & {
        click: Partial<EntityHandlers>;
    };

type TempInternalEntity = Omit<InternalEntity, 'events' | 'handlers'> & {
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
};
