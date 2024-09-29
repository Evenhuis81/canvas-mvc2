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
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
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

// TODO::Dynamically add 'none' unionType
type EntityAnimationType = 'noise' | 'none';
type EntityTransitionTypes = 'fadein1' | 'fadeout1' | 'none';
type EntityHoverTransitionTypes = 'bold' | 'none';
type EntityTypes = EntityAnimationType | EntityTransitionTypes | EntityHoverTransitionTypes;

type EntityColors = {
    fill: RGBA;
    stroke: RGBA;
    textFill: RGBA;
};

// type EntityAnimationsConfig<Type> = {
//     [Property in keyof Type as `${string & Property}Type`]: Type[Property];
// };
// TODO::Use type of EntityCallBacks
type TransitionHandlers = {
    onStartEnd: () => void;
    onEndEnd: () => void;
};

interface EntityCallBacks {
    start: (quickShow: boolean) => void;
    startEnd: () => void;
    end: (quickHide: boolean) => void;
    endEnd: () => void;
}

// handlers = user input, listeners = browser implemented
interface Entity {
    properties: EntityProperties;
    sketch: EntitySketch;
    handlers: MouseHandlers & TransitionHandlers;
    listeners: EntityListeners;
    events: EntityEvents;
    animations: EntityAnimationProperties;
    colors: EntityColors;
}

// click = mouse & touch (touch not yet implemented): see comments.txt for notes (expand into instructions)
// MouseEvent => ButtonEvent (see button.ts)
interface MouseHandlers {
    up: (event: MouseEvent) => void;
    down: (event: MouseEvent) => void;
    button: number;
}

interface EntityHandlers extends TransitionHandlers {
    mouse: MouseHandlers;
}

type EntityConfig = EntitySketch & EntityProperties & EntityHandlers & EntityAnimationProperties;

type InternalEntity = Omit<Entity, 'events'> & {
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
};

// Preferably animation types can be undefined, but this needs proper defaults on typescript (previously stuck)
interface EntityAnimationProperties {
    animateAtStart: boolean;
    animateAtEnd: boolean;
    animationType: EntityAnimationType;
    hoverType: EntityHoverTransitionTypes;
    startType: EntityTransitionTypes;
    startSpeed: 1 | 2 | 3;
    endType: EntityTransitionTypes;
    endSpeed: 1 | 2 | 3;
}

type EntityAnimationUpdate = {
    set: boolean;
    update: Required<Update>;
};
interface EntityUpdates {
    animation: EntityAnimationUpdate;
    hover: EntityAnimationUpdate;
    start: EntityAnimationUpdate;
    end: EntityAnimationUpdate;
}

interface EntityDraw {
    set: boolean;
    draw: Required<Draw>;
}

// possible future states: 'pauze', 'continue'
// type Render = (type: Exclude<keyof EntityRenders, 'callBacks'>, state: boolean) => void;
