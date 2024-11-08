export type StatisticViewType = 'popup' | 'overlay' | 'tab' | 'dual';

export interface StatisticOptions {
    type: StatisticViewType;
    button?: boolean; // expand with options (position, ...)
    // keyup options:
    code?: string; // no button & no code = autoset KeyJ to toggle + log/warning
    ctrl?: boolean; //
    // popup options:
    top?: number; // top & left | width & height -> when type = popup, else ignore
    left?: number;
    width?: number;
    height?: number;
}

export type Statistic = {
    id: string | number;
    name: string;
    fn: () => string;
};

export type StatisticResource = {
    id: string | number;
    statistics: Statistic[];
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
    draw: Draw;
    active: boolean;
};

export type StatProperties = {
    id: number;
    name: string;
    minY: number;
    stepY: number;
    minX: number;
    text: {
        fontSize: string;
        fontWeight: string;
        fontFamily: string;
        fontFamilyBackup: string;
        align: CanvasTextAlign;
        baseLine: CanvasTextBaseline;
        fillStyle: string;
    };
};
