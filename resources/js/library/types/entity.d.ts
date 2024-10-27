// TODO::MultiType with generic objects
export type Sketch = {
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

export interface GeneralProperties {
    id: number | string;
    name: string;
    disabled: boolean;
    show: boolean;
    showDelay: number;
    clicked: boolean;
    hideTime: number;
}

export type Animations = 'noise';
export type Transitions = 'fadein1' | 'fadeout1' | 'slideinleft' | 'explode';
export type Hovers = 'bold';

export type VisualType = Animations | Transitions | Hovers;

export type Colors = {
    fill: RGBA;
    stroke: RGBA;
    textFill: RGBA;
};

export type SetHideTime = (time: number) => void;
export type SetVisual = (kind: Exclude<keyof Visuals, 'draw'>, type: VisualType) => void;
export type SetEntityListener = <K extends keyof EntityEventMap>(
    type: K,
    listener: (evt: EntityEventMap[K]) => void,
) => void;

export interface EntityMethods {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    setListener: SetEntityListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
}

export type Entity = EntityMethods;

export interface Callbacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

type EntityMouseEvent = {mouseProp: string};
type EntityKeyboardEvent = {keyProp: string};
type EntityTouchEvent = {touchProp: string};

export type EntityEventMap = {
    mousedown: EntityMouseEvent;
    mousemove: EntityMouseEvent;
    mouseup: EntityMouseEvent;
    keydown: EntityKeyboardEvent;
    keyup: EntityKeyboardEvent;
    touchstart: EntityTouchEvent;
    touchmove: EntityTouchEvent;
    touchend: EntityTouchEvent;
    // clickup: (evt: MouseEvent | TouchEvent) => void; // mouse & touch combined
    // startTransitionEnd: () => void;
    // endTransitionEnd: () => void;
};

export interface ListenerMethods {
    addListeners: () => void;
    removeListeners: () => void;
}

export type ListenerHandler = {type: keyof EntityEventMap; add: () => void; remove: () => void};

export type EntityListeners<T extends keyof EntityEventMap> = {
    [K in T]: (evt: EntityEventMap[K]) => void;
};

export type ConfigOptions = Partial<
    Sketch &
        GeneralProperties &
        VisualProperties & {
            listeners: Partial<EntityListeners<keyof EntityEventMap>>;
        }
>;

export interface VisualProperties {
    animateAtStart: boolean;
    animateAtEnd: boolean;
    animationType?: Animations;
    hoverType?: Hovers;
    startType?: Transitions;
    startSpeed: TransitionSpeed;
    endType?: Transitions;
    endSpeed: TransitionSpeed;
}
export type TransitionSpeed = 1 | 2 | 3 | 4 | 5;

export type Renderer = {
    update: Required<Update>;
    prepare?: () => void;
};

export interface Visuals {
    entity?: Renderer;
    hover?: Renderer;
    start?: Renderer;
    end?: Renderer;
    draw: Required<Draw>;
}

export type EngineState = 'on' | 'off'; // Future states: 'pauze' | 'continue'?;

export type SetEngine = (type: keyof Visuals, state: EngineState) => void;
