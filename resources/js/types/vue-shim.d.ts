// is used when importing from vue-files, so that typescript can declare the type
declare module '*.vue' {
    import type {DefineComponent} from 'vue';

    const component: DefineComponent<unknown, unknown, unknown>;

    export default component;
}

// Make new window methods global without use of 'windows.method()'.
// interface Window {
//     log: (param1: any) => void;
// }
