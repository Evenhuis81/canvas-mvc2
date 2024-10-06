// TODO::MultiType with generic objects
type EntitySketch = {
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
};

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
type EntityTransitionTypes = 'fadein1' | 'fadeout1' | 'slideinleft' | 'none';
type EntityHoverTransitionTypes = 'bold' | 'none';
// type EntityRenderTypes = EntityAnimationType | EntityTransitionTypes | EntityHoverTransitionTypes;

type EntityColors = {
    fill: RGBA;
    stroke: RGBA;
    textFill: RGBA;
};

type EntityHandlersTypes = 'startTransitionEnd' | 'endTransitionEnd' | 'mouseup' | 'mousedown';

// click = mouse & touch (touch not yet implemented): see comments.txt for notes (expand into instructions)
// MouseEvent => ButtonEvent (see button.ts)
interface UserHandlers {
    mouseup: (event: MouseEvent) => void;
    mousedown: (event: MouseEvent) => void;
    button: number; // make part of each handler
}

interface EntityHandlers {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

interface Entity {
    properties: EntityProperties;
    handlers: EntityHandlers;
    listeners: EntityListeners;
    events: EntityEvents;
    animations: EntityAnimationProperties;
    colors: EntityColors;
    sketch: EntitySketch;
}

type InternalEntity = Omit<Entity, 'events'> & {
    // sketch: EntityShape;
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
};

type EntityConfig = EntitySketch & EntityProperties & EntityHandlers & EntityAnimationProperties;

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

type RenderFunctions = {
    update: Required<Update>;
    prepare?: () => void;
};

interface EntityRenders {
    animation: RenderFunctions;
    hover: RenderFunctions;
    start: RenderFunctions;
    end: RenderFunctions;
    draw: Required<Draw>;
}

// Future states: 'pauze' | 'continue';
type EntityEngineState = 'on' | 'off';

type EntitySetEngine = (type: keyof EntityRenders | 'draw', state: EntityEngineState) => void;
