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
// TODO::Convert this to a mixed custom & native event listener type
export type SetUserListener = <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(
    key: K,
    listener: V,
) => void;

export interface EntityMethods {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    setListener: SetUserListener;
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

export interface ListenerMethods {
    addListeners: () => void;
    removeListeners: () => void;
}

export interface ListenerOptionsCustom {
    clickdown: (evt: MouseEvent | TouchEvent) => void; // mouse & touch combined
    clickup: (evt: MouseEvent | TouchEvent) => void; // mouse & touch combined
    startTransitionEnd: () => void;
    endTransitionEnd: () => void;
}

export type NativeEventListeners<Type extends keyof HTMLElementEventMap> = {
    [Key in Type]: (evt: HTMLElementEventMap[Key]) => void;
};

export type EntityEventListener<Type extends keyof HTMLElementEventMap> = {
    type: Type;
    listener: (evt: HTMLElementEventMap[Type]) => void;
};

export type ConfigOptions = Partial<
    Sketch &
        GeneralProperties &
        VisualProperties & {
            listeners: Partial<NativeEventListeners<keyof HTMLElementEventMap>>;
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
