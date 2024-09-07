interface Entity {
    id: string | number;
    show: () => void;
    hide: () => void;
    destroy: () => void;
    enable: () => void;
    disable: () => void;
}

interface EntityOptions {
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
    // becomes internal property:
    disabled: boolean;
    show: boolean;
}

interface InternalEntityProperties {
    entity: Omit<EntityOptions, 'disabled' | 'show'>;
    events: Entity;
    disabled: boolean;
    show: boolean;
    // draw: Draw;
    // update: Update;
}
