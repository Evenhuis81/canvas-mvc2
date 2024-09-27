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
}

interface EntityListeners {
    add: () => void;
    remove: () => void;
}

type EntityAnimationType = 'noise';

type EntityTransitionTypes = 'fadein1' | 'fadeout1';

type EntityHoverTransitionTypes = 'bold';

type EntityTypes = EntityAnimationType | EntityTransitionTypes | EntityHoverTransitionTypes;

// TODO::Use type of CallBacks
type TransitionHandlers = {
    onStartEnd: () => void;
    onEndEnd: () => void;
};

// part of Handlers?
interface EntityCallBacks {
    startEnd: () => void;
    endEnd: () => void;
}

// handlers = user input, listeners = browser implemented
interface Entity {
    properties: EntityProperties;
    sketch: EntitySketch;
    handlers: MouseHandlers & TransitionHandlers;
    listeners: EntityListeners;
    events: EntityEvents;
    animations: EntityAnimations;
    // part of EntitySketch?
    colors: {
        fill: RGBA;
        stroke: RGBA;
        textFill: RGBA;
    };
    // part of Handlers?
    // callBacks: {
    //     startEnd: () => void;
    //     endEnd: () => void;
    // };
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

// type EntityAnimationsConfig<Type> = {
//     [Property in keyof Type as `${string & Property}Type`]: Type[Property];
// };

type EntityConfig = EntitySketch & EntityProperties & EntityHandlers & EntityRenders & EntityAnimations;

type InternalEntity = Omit<Entity, 'events'> & {
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
};

// possible future states: 'pauze', 'continue'
type Render = (type: keyof EntityRenders, state: boolean) => void;

interface EntityAnimations {
    animationType?: EntityAnimationType;
    hoverType?: EntityHoverTransitionTypes;
    startType?: EntityTransitionTypes;
    startSpeed: 1 | 2 | 3;
    endType?: EntityTransitionTypes;
    endSpeed: 1 | 2 | 3;
}
interface EntityRenders {
    draw: Required<Draw>;
    animation: Required<Update>;
    hover: Required<Update>;
    start: Required<Update>;
    end: Required<Update>;
}
