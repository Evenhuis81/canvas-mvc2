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
    showDelay: number;
    animationType: EntityAnimationType | 'none';
}

interface EntityListeners {
    add: () => void;
    remove: () => void;
}

type EntityAnimationType = 'noise';

type EntityTransitionTypes = 'fadein1' | 'fadeout1';

type EntityHoverTransitionTypes = 'bold';

type EntityTypes = EntityAnimationType | EntityTransitionTypes | EntityHoverTransitionTypes | 'none';

interface EntityTransitions {
    startType: EntityTransitionTypes | 'none';
    startSpeed: 1 | 2 | 3;
    endType: EntityTransitionTypes | 'none';
    endSpeed: 1 | 2 | 3;
    hoverType: EntityHoverTransitionTypes | 'none';
}

interface TransitionHandlers {
    onStartEnd: () => void;
    onEndEnd: () => void;
}

// handlers = user input, listeners = browser implemented
interface Entity {
    properties: EntityProperties;
    sketch: EntitySketch;
    events: EntityEvents;
    handlers: MouseHandlers & TransitionHandlers;
    listeners: EntityListeners;
    transitions: EntityTransitions;
    colors: {
        fill: RGBA;
        stroke: RGBA;
        textFill: RGBA;
    };
}

// click = mouse & touch (touch not yet implemented): see comments.txt for notes (expand into instructions)
// MouseEvent => ButtonEvent (see button.ts)
interface MouseHandlers {
    up: (event: MouseEvent) => void;
    down: (event: MouseEvent) => void;
    button: number;
}

interface EntityHandlers extends TransitionHandlers {
    mouse: Partial<MouseHandlers>;
}

type EntityConfig = EntitySketch & EntityProperties & EntityHandlers & EntityTransitions;

type InternalEntity = Omit<Entity, 'events'> & {
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
    setEngine: (renders: EntityRenders) => void;
};

type EntityRenders = {
    animation: Update | void;
    hover: Update | void;
    start: Update | void;
    end: Update | void;
    draw: Draw | void;
};
