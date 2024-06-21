// export const resources = <ID extends string>() => createStore<ID, Resources>();

// type ResourcesAndTV = Resources & {tv: TransformedView};

// type LibraryResources = {
//     canvas: HTMLCanvasElement;
//     context: CanvasRenderingContext2D;
//     engine: Engine;
// };

// type Resources<T> = T extends {withTV: true}
//     ? LibraryResources & {tv: TransformedView}
//     : T extends {withTV: false | undefined}
//     ? LibraryResources
//     : LibraryResources;

// export const resources: Resources = {};
// let id = 0;

// const getResources: <T extends {withTV: boolean}>(items: LibraryResources, opt?: T) => Resources<T>
//     = (items, opt) => {
//     if (!opt) return items;

//     const tv = getTV(items.context);

//     return {...items, tv};
// };

// setResources({canvas, context, engine}, );
// const returnObj = setResources<T>({canvas, context, engine}, resourceName, tvOn);
// if (resourceName) {
//     const resource = store.new(resourceName, {canvas, context, engine});
// }

// const setResources = <T extends string>(resource: Resource, resourceName?: T, tvOn?: boolean) => {
//     const {canvas, context, engine} = resource;

//     if (resourceName) {
//         if (tvOn) {
//             const tv = getTV(resources.context);

//             const resource = createStore<T, ResourcesAndTV>();

//             resource.set(resourceName, {canvas, context, engine, tv});

//             return resource;
//         }

//         const resource = createStore<T, Resources>();

//         resource.set(resourceName, {canvas, context, engine});

//         return resource;
//     }

//     const resource = createStore<number, Resources>();

//     resource.set(id++, {canvas, context, engine});

//     return resource;
// };

// export const runDemo = () => {
//     const {engine, context} = resources[id - 1];

//     clearOn(engine, context);

//     engine.run();

//     const update = demo.createDemoUpdate(context);
//     const show = demo.createDemoShow(context);

//     engine.setUpdate(update);
//     engine.setShow(show);

//     // New option
//     addEventListener('keydown', ({code}) => {
//         if (code === 'KeyQ') engine.halt();
//         if (code === 'KeyE') engine.run();
//         if (code === 'KeyR') engine.runOnce();
//     });
// };
