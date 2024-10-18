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

export interface Properties {
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
export type SetUserListener = <K extends keyof UserListeners, V extends UserListeners[K]>(key: K, handler: V) => void;

export interface UserMethods {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    setListener: SetUserListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
}

export interface Callbacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

// export type ListenerEvent<Evt> = {
//     clicked: boolean;
//     evt: Evt;
// };

export interface ListenerMethods {
    addListeners: () => void;
    removeListeners: () => void;
}

export type ParseListener = <K extends keyof UserListeners, V extends UserListeners[K]>(
    key: K,
    listener: V,
) => {
    type: K;
    listener: NonNullable<V>;
};

export type EntityListener = Extract<ReturnType<ParseListener>, {}>;

// export type EventHandler = {
//     user: {
//         native: EntityListener[];
//         custom: EntityListener[]; // clickup-down/startEnd/etc
//     };
// } & ListenerMethods &
//     Callbacks;

export interface UserListeners {
    clickdown: (evt: MouseEvent | TouchEvent) => void; // mouse & touch combined
    clickup: (evt: MouseEvent | TouchEvent) => void; // mouse & touch combined
    mousedown: (evt: MouseEvent) => void;
    mouseup: (evt: MouseEvent) => void;
    touchstart: (evt: TouchEvent) => void;
    touchend: (evt: TouchEvent) => void;
    startTransitionEnd: () => void;
    endTransitionEnd: () => void;
}

export type UserConfig = Sketch & Properties & VisualProperties & {listeners: Partial<UserListeners>};

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
