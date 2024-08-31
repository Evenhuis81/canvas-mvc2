import {Vector, Vector2} from './vector';

type Zoom = 'in' | 'out';

interface StaticView {
    paint: Paint;
}

interface TransformedView extends PropertiesTV, PaintMethods, MethodsTV {}

interface MethodsTV {
    screen2World: (x: number, y: number) => void;
    world2Screen: (x: number, y: number) => void;
    world2Screen2: (x: number, y: number, x2: number, y2: number) => void;
    zoomMechanic: {
        in: () => void;
        out: () => void;
    };
    zoom: (scalePos: Vector, type: Zoom) => void;
    getMiddleScreen: () => Vector;
    setWorldView: (x: number, y: number, x2: number, y2: number) => void;
    setScale: (scale: Vector) => void;
    setScaleFactor: (factor: number) => void;
    setScreenSize: (size: Vector) => void;
    setWorldBorders: (borders: Vector2) => void;
    setOffset: (offset: Vector) => void;
    setDefaults: (canvas: HTMLCanvasElement) => void;
    // getGrid: (context: CanvasRenderingContext2D) => Show;
    setMiddle: (target: Vector) => void;
    moveTo: (target: Vector, slowR?: number) => Update;
    setUnitWeight: (unitLw: Vector) => void;
}

interface PropertiesTV {
    offset: Vector;
    scale: Vector;
    screen: Vector;
    screen2: Vector2;
    world: Vector;
    screenSize: Vector;
    worldTL: Vector;
    worldBR: Vector;
    startPan: Vector;
    worldBeforeZoom: Vector;
    worldAfterZoom: Vector;
    scaleFactor: number;
    worldView: Vector2;
    unitWeight: Vector;
}
