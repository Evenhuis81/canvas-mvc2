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

interface EntityProperties {
    id: number | string;
    name: string;
    disabled: boolean;
    show: boolean;
    showDelay: number;
    clicked: boolean;
    hideTime: number;
}

type EntityAnimations = 'noise';
type EntityTransitions = 'fadein1' | 'fadeout1' | 'slideinleft' | 'explode';
type EntityHovers = 'bold';

type EntityVisualType = EntityAnimations | EntityTransitions | EntityHovers;

type EntityColors = {
    fill: RGBA;
    stroke: RGBA;
    textFill: RGBA;
};

type SetHideTime = (time: number) => void;
type SetVisual = (kind: Exclude<keyof EntityVisuals, 'draw'>, type: EntityVisualType) => void;

interface UserEntity {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    setListener: SetUserListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
    // destroy: () => void;
    // enable: () => void;
    // disable: () => void;
}

interface EntityCallBacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

type EntityEvent<Evt> = {
    clicked: boolean;
    evt: Evt;
};

interface ListenerMethods {
    add: () => void;
    remove: () => void;
}

type ParseListener = <K extends keyof UserListeners, V extends UserListeners[K]>(
    key: K,
    listener: V,
) => {
    type: K;
    listener: NonNullable<V>;
};

type SetUserListener = <K extends keyof UserListeners, V extends UserListeners[K]>(key: K, listener: V) => void;

type ParsedListener = Extract<ReturnType<ParseListener>, {}>;

type Listeners = {listeners: ParsedListener[]} & ListenerMethods;

interface UserListeners {
    mouseup: (evt: EntityEvent<MouseEvent>) => void;
    mousedown: (evt: EntityEvent<MouseEvent>) => void;
    startTransitionEnd: (clicked: boolean) => void;
    endTransitionEnd: (clicked: boolean) => void;
    touchstart: (evt: EntityEvent<TouchEvent>) => void;
    touchend: (evt: EntityEvent<TouchEvent>) => void;
    clickdown: (evt: EntityEvent<MouseEvent & TouchEvent>) => void; // mouse & touch combined
    clickup: (evt: EntityEvent<MouseEvent & TouchEvent>) => void; // mouse & touch combined
}

type EntityConfig = EntitySketch & EntityProperties & EntityVisualProperties & {listeners: Partial<UserListeners>};

interface EntityVisualProperties {
    animateAtStart: boolean;
    animateAtEnd: boolean;
    animationType?: EntityAnimations;
    hoverType?: EntityHovers;
    startType?: EntityTransitions;
    startSpeed: TransitionSpeed;
    endType?: EntityTransitions;
    endSpeed: TransitionSpeed;
}

type TransitionSpeed = 1 | 2 | 3 | 4 | 5;

type Renderer = {
    update: Required<Update>;
    prepare?: () => void;
    // finish?: () => void;
};

interface EntityVisuals {
    entity?: Renderer;
    hover?: Renderer;
    start?: Renderer;
    end?: Renderer;
    draw: Required<Draw>;
}

// Future states: 'pauze' | 'continue';
type EntityEngineState = 'on' | 'off';

type EntitySetEngine = (type: keyof EntityVisuals, state: EntityEngineState) => void;

// interface Entity {
//     sketch: EntitySketch;
//     properties: EntityProperties;
//     userListeners: Partial<UserListeners>;
//     listeners: EntityListeners;
//     callBacks: EntityCallBacks;
//     visualProperties: EntityVisualProperties;
//     colors: EntityColors;
//     engine: Engine;
//     context: CanvasRenderingContext2D;
//     input: Input;
// }

// type EntityTemp = Omit<Entity, 'entityListeners' | 'callBacks' | 'visuals'>;
