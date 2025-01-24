import {EngineDraw, EngineUpdate} from './engine';
import {InputListenerEventMap, InputListenerType} from './input';
import {ShapesConfig} from './shapes';

export type GeneralProperties = {
    id: number | string;
    name: string;
    disabled: boolean;
    show: boolean;
    showDelay: number;
    clicked: boolean;
    hideTime: number;
};

export interface VisualProperties {
    animateAtStart: boolean;
    animateAtEnd: boolean;
    animationType?: EntityAnimations;
    hoverType?: EntityHovers;
    startType?: EntityTransitions;
    startSpeed: TransitionSpeed;
    endType?: EntityTransitions;
    endSpeed: TransitionSpeed;
}

export type EntityAnimations = 'noise';
export type EntityTransitions = 'fadein1' | 'fadeout1' | 'slideinleft' | 'explode';
export type EntityHovers = 'bold';

export type VisualType = EntityAnimations | EntityTransitions | EntityHovers;

export type SetHideTime = (time: number) => void;
export type SetVisual = (kind: Exclude<keyof Visuals, 'draw'>, type: VisualType) => void;

export type StartEndTransitionEvent = {startEndProp: string};
export type EndEndTransitionEvent = {endEndProp: string};

// export type ListenerTemplate<T extends object, K extends keyof T> = {
//     type: K; // = ID (1 type per entity)
//     listener: (evt: T[K]) => void;
// };

// export type NativeListener = ListenerTemplate<HTMLElementEventMap, keyof HTMLElementEventMap>;
// export type EntityListener = ListenerTemplate<EntityListenerEventMap, EntityListenerType>;

export type EntityListenerEventMap = InputListenerEventMap & {
    startTransitionEnd: StartEndTransitionEvent;
    endTransitionEnd: EndEndTransitionEvent;
};

export type EntityListenerMap<T extends keyof EntityListenerEventMap> = {
    [K in T]: (evt: EntityListenerEventMap[K]) => void;
};

export type EntityConfig = Partial<
    {sketch: ShapesConfig} & GeneralProperties &
        VisualProperties & {
            listeners: Partial<EntityListenerMap<keyof EntityListenerEventMap>>;
        }
>;

type ActivateListener = () => void;
type DeactivateListener = () => boolean;
type ListenerActive = boolean;

export type InputListenerHandler = [symbol, ActivateListener, DeactivateListener, ListenerActive];
export type EntityListeners = {
    startTransitionEnd: ((evt: StartEndTransitionEvent) => void) | undefined;
    endTransitionEnd: ((evt: EndEndTransitionEvent) => void) | undefined;
};

export type AddNativeListener = <K extends InputListenerType>(
    type: K, // = ID (1 type per entity)
    listener: (evt: InputListenerEventMap[K]) => void,
    activate?: boolean,
) => void;

export type AddEntityListener = <K extends keyof EntityListenerEventMap>(
    type: K, // = ID (1 type per entity)
    listener: (evt: EntityListenerEventMap[K]) => void,
    activate?: boolean,
) => void;

export type RemoveNativeListener = (type: InputListenerType) => void;
export type RemoveEntityListener = (type: keyof EntityListenerEventMap) => void;

export interface EventHandler {
    addListener: AddEntityListener;
    removeListener: RemoveEntityListener;
    addNativeListener: AddNativeListener;
    removeNativeListener: RemoveNativeListener;
    activateNativeListeners: () => void;
    deactivateNativeListeners: () => void;
    startTransitionEnd: () => void;
    endTransitionEnd: () => void;
}

export interface Entity {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    addListener: AddEntityListener;
    removeListener: RemoveEntityListener;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
}

export interface Callbacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
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
