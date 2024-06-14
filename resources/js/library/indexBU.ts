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
