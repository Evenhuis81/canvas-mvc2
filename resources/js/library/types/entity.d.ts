import {BaseID} from '.';
import {EngineDraw, EngineUpdate} from './engine';
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

export type ListenerTemplate<T extends object, K extends keyof T> = {
    type: K;
    listener: (evt: T[K]) => void;
    id?: BaseID;
};

export type NativeListener = ListenerTemplate<HTMLElementEventMap, keyof HTMLElementEventMap>;
export type CustomListener = ListenerTemplate<CustomEventMap, keyof CustomEventMap>;
export type EntityListeners = NativeListeners<keyof HTMLElementEventMap> & CustomListeners<keyof CustomEventMap>;

export type StartEndTransitionEvent = {startEndProp: string};
export type EndEndTransitionEvent = {endEndProp: string};

export type CustomEventMap = {
    startTransitionEnd: StartEndTransitionEvent;
    endTransitionEnd: EndEndTransitionEvent;
};

export type NativeListeners<T extends keyof HTMLElementEventMap> = {
    [K in T]: (evt: HTMLElementEventMap[K]) => void;
};

export type CustomListeners<T extends keyof CustomEventMap> = {
    [K in T]: (evt: CustomEventMap[K]) => void;
};

export type EntityConfig = Partial<
    {sketch: ShapesConfig} & GeneralProperties &
        VisualProperties & {
            listeners: Partial<EntityListeners>;
        }
>;

export type AddListener = <K extends keyof EntityListeners>(
    type: K,
    listener: EntityListeners[K],
    id?: BaseID,
) => BaseID | void;
export type RemoveListener = (id: BaseID) => boolean;
export type RemoveListeners = () => boolean;

export interface Entity {
    show: (quickShow?: boolean) => void;
    hide: (quickHide?: boolean) => void;
    addListener: AddListener;
    removeListener: RemoveListener;
    removeListeners: RemoveListeners;
    setHideTime: SetHideTime;
    setVisual: SetVisual;
}

export interface Callbacks {
    start: (quickShow: boolean, prepare?: () => void) => void;
    startEnd: () => void;
    end: (quickHide: boolean, prepare?: () => void) => void;
    endEnd: () => void;
}

export type ListenerHandler = {type: keyof HTMLElementEventMap; add: () => void; remove: () => void};

export interface EventHandler {
    addListeners: () => void;
    removeListeners: () => void;
    startTransitionEnd?: (evt: StartEndTransitionEvent) => void;
    endTransitionEnd?: (evt: EndEndTransitionEvent) => void;
    addListener: AddListener;
    removeListener: RemoveListener;
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
