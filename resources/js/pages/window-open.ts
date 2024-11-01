import {l} from 'vite/dist/node/types.d-aGj9QkWt';

// TODO::Add all possible features, map feature for incoming option/change and stringify for use
const stringifyObject = (obj: Partial<Record<string, number | string | boolean>>) => {
    let result = '';

    const entries = Object.entries(obj);

    entries.forEach((entry, index) => {
        result += `${entry[0]}=${entry[1]}${index !== entries.length - 1 ? ', ' : ''}`;
    });

    return result;
};

const defaults: WindowOpener = {
    properties: {
        baseUrl: `http://localhost:8000/`,
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

export const createWindowOpener = (route: string, options?: Partial<WindowOpener['features']>) => {
    // set custom features/options here (optional parameter user input)
    const properties = {...defaults.properties};
    const features = {...defaults.features};

    const openWindow = () => {
        if (options) {
            const windowFeatures = stringifyObject(features);

            properties.window = window.open(`http://localhost:8000/${route}`, `${route}Window`, windowFeatures);

            handler(properties.window);

            return;
        }

        properties.window = window.open(`http://localhost:8000/${route}`, `${route}Window`);

        handler(properties.window);

        return;
    };

    const openWindowCenter = (expand: boolean = false) => {
        // Until options gets configoptions, this is experimental/unfinished
        // const screenHeight = window.screen.height * window.devicePixelRatio;
        // const screenWidth = window.screen.width * window.devicePixelRatio;
        features.left = window.screen.width / 2 - features.width / 2;
        features.top = window.screen.height / 2 - features.height;

        const windowFeatures = stringifyObject(features);

        properties.window = window.open(`http://localhost:8000/${route}`, `${route}Window`, windowFeatures);

        if (properties.window && expand) {
            properties.window.onload = () => {
                let inter;

                const addInter = () =>
                    (inter = setInterval(() => {
                        resizeBy(1, 1);

                        features.width++;
                        if (features.width >= 200) {
                            features.width = 200;
                            features.height = 200;
                            removeInter();
                        }
                    }, 16));

                const removeInter = () => clearInterval(inter);

                addInter();
            };
        }
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
