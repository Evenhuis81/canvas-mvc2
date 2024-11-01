// TODO::Add all possible features, map feature for incoming option/change and stringify for use
const windowFeatures = {
    left: 200,
    top: 100,
    width: 480,
    height: 320,
    popup: false,
};

const stringify = (obj: typeof windowFeatures) => {
    let result = '';
    console.log(Object.entries(windowFeatures));
    // Object.entries(obj).forEach((value, index) => {
    //     result += `${value[0]}=${value}${}`
    // })
};

const properties = {
    baseUrl: `http://localhost:8000/`,
    route: '',
};

const createWindow = (route: string, popup?: boolean, features?: string) => {
    properties.route = route;

    if (popup) {
        const windowFeatures = features ?? 'left=200,top=100,width=480,height=320';

        const handle = window.open(`http://localhost:8000/`, `${route}Window`, windowFeatures);

        handler(handle);

        return;
    }

    const handle = window.open(`http://localhost:8000/`, `${route}Window`);

    handler(handle);
};

const handler = (handle: Window | null) => {
    if (!handle) {
        // The window wasn't allowed to open. (built-in) popup blockers, settings?) handle error
        console.log('window open statistics failed');
    }

    console.log('window open statistics succeeded');
    // set handle in properties and make rssuable
};
