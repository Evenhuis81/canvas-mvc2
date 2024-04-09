import {
    HistoryState,
    LocationQueryRaw,
    NavigationGuard,
    NavigationHookAfter,
    RouteLocationRaw,
    RouteRecordRaw,
    createRouter,
    createWebHistory,
} from 'vue-router';
import {createApp} from 'vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [],
});

export const mountRouter = (app: ReturnType<typeof createApp>) => {
    app.use(router);
};

export const goToRoute = (
    name: string,
    options: {id?: number; query?: LocationQueryRaw; state?: HistoryState} = {},
) => {
    const {id, query, state} = options;
    if (onPage(name) && !query && !id && !state) return;
    router.push(createRoute(name, id, query, state));
};

const createRoute = (name: string, id?: number, query?: LocationQueryRaw, state?: HistoryState) => {
    const route: RouteLocationRaw = {name};
    if (id) route.params = {userId: id};
    if (query) route.query = query;
    if (state) route.state = state;

    return route;
};

const beforeRouteMiddleware: NavigationGuard[] = [];

router.beforeEach(async (to, from, next) => {
    for (const middlewareFunc of beforeRouteMiddleware) {
        // MiddlewareFunc will return true if it encountered problems
        if (await middlewareFunc(to, from, next)) return next(false);
    }

    return next();
});

router.afterEach(async (to, from, failure) => {
    for (const middlewareFunc of routerAfterMiddleware) {
        // MiddlewareFunc will return true if it encountered problems
        if (await middlewareFunc(to, from, failure)) return;
    }
});

export const addRoutes = (routes: RouteRecordRaw[]) => {
    for (const route of routes) router.addRoute(route);
};

/** Get the current route */
export const getCurrentRoute = () => router.currentRoute;
/** Get the query from the current route */
export const getCurrentRouteQuery = () => router.currentRoute.value.query;
/** Get the id from the params from the current route */
export const getCurrentRouteId = () => parseInt(router.currentRoute.value.params?.userId?.toString());

/** Get the token from the params from the current route */
export const getCurrentRouteToken = () => router.currentRoute.value.params.token.toString();
/** Get the name from the current route */
export const getCurrentRouteName = () => router.currentRoute.value.name?.toString();

/** checks if the given string is in the current routes name */
const onPage = (pageName: string) => router.currentRoute.value.name?.toString().includes(pageName);

/** go back one page */
export const goBack = () => router.back();

const routerAfterMiddleware: NavigationHookAfter[] = [];
export const registerBeforeRouteMiddleware = (middleware: NavigationGuard) => beforeRouteMiddleware.push(middleware);
export const registerAfterMiddleware = (middleware: NavigationHookAfter) => routerAfterMiddleware.push(middleware);

export const pushState = (state: HistoryState) => router.push({state});
