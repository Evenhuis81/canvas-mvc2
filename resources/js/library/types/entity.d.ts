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
type EntityTransitions = 'fadein1' | 'fadeout1' | 'slideinleft';
type EntityHovers = 'bold';

type EntityVisualTypes = EntityAnimations | EntityTransitions | EntityHovers;

type EntityColors = {
    fill: RGBA;
    stroke: RGBA;
    textFill: RGBA;
};

interface EntityListeners {
    add: () => void;
    remove: () => void;
}

type SetUserListener = <K extends keyof UserListeners>(type: K, listener?: UserListeners[K]) => void;
type SetHideTime = (time: number) => void;

interface UserEntity {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    destroy: () => void;
    enable: () => void;
    disable: () => void;
    setListener: SetUserListener;
    setHideTime: SetHideTime;
}

interface EntityCallBacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

type UserListenerTypes = 'mouseup' | 'mousedown' | 'startTransitionEnd' | 'endTransitionEnd';

// click = mouse & touch (touch not yet implemented): see comments.txt for notes (expand into instructions)
type UserListeners = {
    mouseup: (evt: MouseEvent) => void;
    mousedown: (evt: MouseEvent) => void;
    startTransitionEnd: (clicked: boolean) => void;
    endTransitionEnd: (clicked: boolean) => void;
};

interface Entity {
    sketch: EntitySketch;
    properties: EntityProperties;
    userListeners: UserListeners;
    entityListeners: EntityListeners;
    callBacks: EntityCallBacks;
    visualProperties: EntityVisualProperties;
    visuals: EntityVisuals;
    colors: EntityColors;
    engine: Engine;
    context: CanvasRenderingContext2D;
    input: Input;
}

type EntityTemp = Omit<Entity, 'entityListeners' | 'callBacks' | 'visuals'>;

type EntityConfig = EntitySketch & EntityProperties & EntityVisualProperties & {listeners: Partial<UserListeners>};

// Preferably animation types can be undefined, but this needs proper defaults on typescript
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
