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

            properties.window = window.open(`${properties.baseUrl}/${route}`, `${route}Window`, windowFeatures);

            handler(properties.window);

            return;
        }

        properties.window = window.open(`${properties.baseUrl}/${route}`, `${route}Window`);

        handler(properties.window);

        return;
    };

    const openWindowCenter = (expand: boolean = false, options?: Partial<WindowOpener['features']>) => {
        // Until options gets configoptions, this is experimental/unfinished
        const newFeatures = {...features};

        if (options) {
            newFeatures.width = options.width ?? defaults.features.width;
            newFeatures.height = options.height ?? defaults.features.height;
        }

        newFeatures.left = window.screen.width / 2 - newFeatures.width / 2;
        newFeatures.top = window.screen.height / 2 - newFeatures.height / 2;

        let parsedFeatures = stringifyObject(newFeatures);

        properties.window = window.open(`${properties.baseUrl}/${route}`, `${route}Window`, parsedFeatures);

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
