interface EntityEvents {
    show: () => void;
    hide: () => void;
    destroy: () => void;
    enable: () => void;
    disable: () => void;
}

interface EntityConfig {
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
    disabled: boolean;
    show: boolean;
}

interface InternalEntity {
    entity: Omit<EntityConfig, 'disabled' | 'show'>;
    events: EntityEvents;
    disabled: boolean;
    show: boolean;
}

type MappedInternalEntity<Type> = {
    [K in keyof Type]: Type[K];
};
