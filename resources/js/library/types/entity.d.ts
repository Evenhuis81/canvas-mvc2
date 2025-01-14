import {EngineDraw, EngineUpdate} from './engine';
import {ShapesConfig} from './shapes';

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
export type AddListener = <K extends keyof EntityListenerEvents>(
    key: K,
    listener: (evt: EntityListenerEvents[K]) => void,
) => void;

export type RemoveListener = () => void;

export interface Entity {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    addListener: AddListener;
    removeListener: RemoveListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
}

export interface Callbacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

export type ListenerHandler = {type: keyof EntityListenerEvents; add: () => void; remove: () => void};

export interface EventHandler {
    addListeners: () => void;
    removeListeners: () => void;
    startTransitionEnd?: (evt: StartEndTransitionEvent) => void;
    endTransitionEnd?: (evt: EndEndTransitionEvent) => void;
    addListener: AddListener;
}

// Props are for testing for now, eventually these events should be filled with entity related properties
export type StartEndTransitionEvent = {startEndProp: string};
export type EndEndTransitionEvent = {endEndProp: string};

export type EntityListenerEvents = EntityEvents & HTMLElementEventMap;

export type EntityEvents = {
    startTransitionEnd: StartEndTransitionEvent;
    endTransitionEnd: EndEndTransitionEvent;
};

export type EntityListeners<Type extends keyof EntityListenerEvents> = {
    [Key in Type]: (evt: EntityListenerEvents[Key]) => void;
};

export type EntityConfig = Partial<
    {sketch: ShapesConfig} & GeneralProperties &
        VisualProperties & {
            listeners: Partial<EntityListeners<keyof EntityListenerEvents>>;
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
    update: Required<EngineUpdate>;
    prepare?: () => void;
};

export interface Visuals {
    entity?: Renderer;
    hover?: Renderer;
    start?: Renderer;
    end?: Renderer;
    draw: Required<EngineDraw>;
}

export type EngineState = 'on' | 'off'; // Future states: 'pauze' | 'continue'?;

export type SetEngine = (type: keyof Visuals, state: EngineState) => void;
