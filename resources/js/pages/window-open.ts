// TODO::Add all possible features, map feature for incoming option/change and stringify for use
const stringifyObject = (obj: Partial<Record<string, number | string | boolean>>) => {
    let result = '';

    const entries = Object.entries(obj);

    entries.forEach((entry, index) => {
        result += `${entry[0]}=${entry[1]}${index !== entries.length - 1 ? ', ' : ''}`;
    });

    return result;
};

export const createWindowOpener = (route: string, options?: Partial<WindowOpener['features']>) => {
    // set custom features/options here (optional parameter user input)
    const properties = {...defaults.properties};
    const features = {...defaults.features, ...options};

    const openWindow = () => {
        if (options) {
            properties.window = window.open(
                `${properties.baseUrl}/${route}`,
                `${route}Window`,
                stringifyObject(features),
            );

            handler(properties.window);

            return;
        }

        properties.window = window.open(`${properties.baseUrl}/${route}`, `${route}Window`);

        handler(properties.window);

        return;
    };

    // const openWindowCenter = (expand: boolean = false, options?: Partial<WindowOpener['features']>) => {
    const openWindowCenter = (options?: Partial<WindowOpener['features']>) => {
        // Until options gets configoptions, this is experimental/unfinished
        const newFeatures = {...features, ...options};

        newFeatures.left = window.screen.width / 2 - newFeatures.width / 2;
        newFeatures.top = window.screen.height / 2 - newFeatures.height / 2;

        properties.window = window.open(
            `${properties.baseUrl}/${route}`,
            `${route}Window`,
            stringifyObject(newFeatures),
        );

        handler(properties.window);

        const setSize = (win: Window) => {
            win.onload = () => {
                // On Safari this might get stuck in a loop:
                // win.resizeTo(480 + (win.outerWidth - win.innerWidth), 320 + (win.outerHeight - win.innerHeight));

                const width = win.outerWidth - win.innerWidth;
                const height = win.outerHeight - win.innerHeight;

                win.resizeTo(480 + width, 320 + height);
            };
        };

        if (properties.window) setSize(properties.window);
        // const optionsHandler = (options: WindowOpener['features'], defaultFeatures: WindowOpener['features']) => {
        //     const features = {defaultFeatures, ...options};
        // }
        // optionsHandler(options, newFeatures);

        // if (properties.window && expand) {
        //     properties.window.onload = () => {
        //         //
        //     };
        // }
    };

    const resizeTo = (width: number, height: number) => {
        if (!properties.window) return;

        properties.window.resizeTo(width, height);
    };

    const resizeBy = (xDelta: number, yDelta: number) => {
        if (!properties.window) return;

        properties.window.resizeBy(xDelta, yDelta);
    };

    return {openWindow, resizeTo, resizeBy, openWindowCenter};
};

const handler = (handle: Window | null) => {
    if (!handle) {
        // The window wasn't allowed to open. (built-in) popup blockers, settings?) handle error
        console.log('window open statistics failed');

        return;
    }

    console.log('window open statistics succeeded');
    // set handle in properties and make rssuable
};

const defaults: WindowOpener = {
    properties: {
        baseUrl: 'http://localhost:8000',
        route: '',
        window: null,
    },
    features: {
        left: 100,
        top: 50,
        width: 100,
        height: 100,
    },
};

type WindowOpenerConfig = PartialNested<WindowOpener>;

type PartialNested<T> = {[P in keyof T]?: PartialNested<T[P]>};

type PartialExcept<T, K extends keyof T> = PartialNested<T> & Pick<T, K>;

type WindowOpener = {
    properties: {
        baseUrl: string;
        route: string;
        window: null | Window;
    };
    features: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
};
