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

type UserEntity = EntityEvents & {setHandler: (handler: UserHandler) => void};

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

// click = mouse & touch (touch not yet implemented): see comments.txt for notes (expand into instructions)
// MouseEvent => ButtonEvent (see button.ts)
type HandlerTypes = 'mouseup' | 'mousedown' | 'startTransitionEnd' | 'endTransitionEnd';

type UserHandler = {
    type: HandlerTypes;
    handler: () => void;
    button?: number; // TODO::Only on mouse handlers (ts extends)
};

type EntityHandlers = {
    [Property in HandlerTypes]: {
        handler: () => void;
        button: number; // wrong
    };
};

interface EntityCallBacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

interface Entity {
    sketch: EntitySketch;
    properties: EntityProperties;
    handlers: EntityHandlers;
    listeners: EntityListeners;
    animations: EntityAnimationProperties;
    colors: EntityColors;
    events: EntityEvents;
}

type InternalEntity = Omit<Entity, 'events'> & {
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
};

type EntityConfig = EntitySketch & EntityProperties & EntityAnimationProperties & {handlers: UserHandler[]};

// Preferably animation types can be undefined, but this needs proper defaults on typescript
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
