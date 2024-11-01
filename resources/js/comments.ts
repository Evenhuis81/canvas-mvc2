// Statistics module:
// This should become a reesource, but with different 'themes' or statistic variants. (for different kind of options)
// Create text object according to StaticView, with calculated options (like button, possible to 'lend' those)

// OpenWindoHandler:
// const addInter = () =>
//     (inter = setInterval(() => {
//         resizeBy(1, 1);

//         features.width++;
//         if (features.width >= 200) {
//             features.width = 200;
//             features.height = 200;
//             removeInter();
//         }
//     }, 16));

// Actual screensize (scale * pixeldensity)
// const screenHeight = window.screen.height * window.devicePixelRatio;
// const screenWidth = window.screen.width * window.devicePixelRatio;
// const removeInter = () => clearInterval(inter);

// addInter();

// const testEntity = entity.create({
//     listeners: {
//         mouseup: evt => {
//             testEntity.hide();
//         },
//         keyup: evt => {
//             console.log('keyup', evt.keyProp);
//         },
//         touchstart: evt => {
//             console.log('touchstart', evt.touchProp);
//         },
//         touchmove: evt => {
//             console.log('touchmove', evt.touchProp);
//         },
//         startTransitionEnd: evt => {
//             console.log('startTransitionEnd', evt.startTransitionProp);
//         },
//         endTransitionEnd: evt => {
//             console.log('endTransitionEnd', evt.endTransitionProp);
//         },
//         touchend: evt => {
//             console.log('touchend', evt.touchProp);
//         },
//         // keyup: undefined,
//     },
//     startType: 'fadein1',
//     endType: 'fadeout1',
//     hoverType: 'bold',
// });

// type KeyWithCallback<A extends object> = {
//     [K in keyof A]: [K, (_: A[K]) => void];
// }[keyof A];

// const testTr = {
//     startTransitionEnd: (args: ['startTransitionEnd', (evt: StartEntityTransitionEvent) => void]) => {},
//     endTransitionEnd: (args: ['endTransitionEnd', (evt: EndEntityTransitionEvent) => void]) => {},
// };

// function on(...args: KeyWithCallback<CustomEventMap>) {
// testTr[args[0]](args);
// if (args[0] === 'startTransitionEnd') {
//     const [_, clb] = args; // destructuring inside condition
//     clb({transitionProp: 'transition startEnd'}); // here clb allows on string only (string) => void
// } else {
//     const [_, clb] = args; // destructuring inside condition
//     clb({transitionProp: 'transition endEnd'}); // here clb allows on number only (number) => void
// }
// }

// const err = {
//     clickdownconflict: () => {
//         throw Error('unable set mousedown or touchstart with clickdown');
//     },
//     clickupconflict: () => {
//         throw Error('unable to set mouseup or touchend with clickup');
//     },
// };

// const throwError = (type: keyof typeof err) => err[type];

// interface Entity {
//     sketch: EntitySketch;
//     properties: EntityProperties;
//     userListeners: Partial<UserListeners>;
//     listeners: EntityListeners;
//     callbacks: EntityCallbacks;
//     visualProperties: EntityVisualProperties;
//     colors: EntityColors;
//     engine: Engine;
//     context: CanvasRenderingContext2D;
//     input: Input;
// }

// type EntityTemp = Omit<Entity, 'entityListeners' | 'callbacks' | 'visuals'>;

// const throwError2 = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
//     throw Error(`${subject} with id '${id}' already ${action}`);
// };

// const propertiesLength = [6, 5]; // [Mixed Internal Properties, Transition Properties]

//     const internal = {id: options.id ?? `entity-${uid()}`, ...getProperties(options, defaultSketchProperties)};

//     const splitObject = (obj: {}, ids: []) => {
//         const returnObj = {};

//         ids.forEach(idd => {
//             // const {idd: } = obj;
//             // returnObj[id] = idd;
//         });
//     };

//     console.log(internal.id);

//     type Propp = {id: string | number};

//     const properties: Propp = {id: 0};

// const properties = splitObject(internal, Object.keys(internal).splice(0, propertiesLength[0]));

// ({id: properties.id} = internal);

// console.log(internal.animation);

// const {animation} = internal;

// console.log(internal.animation);

// const {id, name, disabled, show, showDelay, animation} = internal;

// const propertyKeys = ['id', 'name', 'disabled', 'show', 'showDelay', 'animation'];

// Object.keys(internal));

// export const statistics: Record<string | number, Statistic[]> = {};

// const tvUpdate = tv.moveTo(player.middlePos);
// engine.setUpdate(tvUpdate);

// const setHandlers = <T extends {}>(handlers: T) => ({
//     down: () => {},
//     up: () => {},
//     onStartEnd: () => {},
//     onEndEnd: () => {},
//     button: 0,
//     ...handlers,
// });

// const getButtonLines = (x: number, y: number, w: number, h: number) => {
//     const mTB = h / 3;
//     const mLR = w / 5;
//     const yStep = (h - mTB * 2) / 2;

//     const line1 = {x: x + mLR, y: y + mTB, x2: x + w - mLR, y2: y + mTB};
//     const line2 = {x: x + mLR, y: y + mTB + yStep, x2: x + w - mLR, y2: y + mTB + yStep};
//     const line3 = {x: x + mLR, y: y + mTB + yStep * 2, x2: x + w - mLR, y2: y + mTB + yStep * 2};

//     return [line1, line2, line3];
// };

// const menuBorder = {
//     x: 250,
//     y: 40,
//     w: 240,
//     h: 210,
//     r: 5,
// };

// const openMenu = () => {
//     // menu border (slide-in from above)
//     const {x, y, w, h, r} = menuBorder;
//     const {context: ctx} = gameStore.state;

//     const show = () => {
//         ctx.fillStyle = '555';
//         ctx.strokeStyle = '#fff';
//         ctx.lineWidth = 2;

//         ctx.beginPath();
//         ctx.roundRect(x, y, w, h, r);
//         ctx.fill();
//         ctx.stroke();
//     };

//     return show;
// };

// export const getMenuButton = (ctx: CanvasRenderingContext2D) => {
//     const {w, h, r, lw, stroke} = menuButton;
//     let fill = 0;
//     const fillAcc = 5;
//     const fillMax = 100;
//     const fillMin = 0;
//     const x = ctx.canvas.width - 30;
//     const y = 10;

//     const lines = getButtonLines(x, y, w, h);

//     const show = () => {
//         const newFill = `rgb(${fill}, ${fill}, ${fill})`;
//         ctx.strokeStyle = stroke;
//         ctx.fillStyle = newFill;
//         ctx.lineWidth = lw;

//         ctx.beginPath();
//         ctx.roundRect(x, y, w, h, r);
//         ctx.fill();
//         ctx.stroke();

//         for (const line of lines) {
//             ctx.strokeStyle = '#fff';
//             ctx.lineWidth = 1;

//             ctx.beginPath();
//             ctx.moveTo(line.x, line.y);
//             ctx.lineTo(line.x2, line.y2);
//             ctx.stroke();
//         }
//     };

//     const update = () => {
//         if (inside() && fill < fillMax) fill += fillAcc;

//         if (!inside() && fill > fillMin) fill -= fillAcc;
//     };

//     const inside = () => mouse.x >= x && mouse.x < x + w && mouse.y >= y && mouse.y < y + h;

//     addEventListener('mouseup', ({button}) => {
//         if (button === 0 && inside()) gameStore.state.engine.setDraw({id: 0, name: 'open menu', fn: openMenu()});
//     });

//     return {show, update};
// };

// Ideas for buttons:
// 01. Transition from 1 button to the other
// 02. Fade out/in
// 03. Active/inactive mode
// 04. Make module that shows which button is currently active (or alive as you will)

// const createButtonShow: Record<
//     ButtonType,
//     (props: ButtonOptionsRequired, ctx: CanvasRenderingContext2D) => () => void
// > = {
//     fill: (props, ctx) => () => {
//         // button
//         ctx.beginPath();
//         ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
//         ctx.fill();

//         // text
//         ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//         ctx.font = props.font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.beginPath();
//         ctx.fillText(props.text, props.x, props.y);
//     },
//     stroke: (props, ctx) => () => {
//         ctx.strokeStyle = props.stroke;
//         ctx.lineWidth = props.lw;

//         ctx.beginPath();
//         ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
//         ctx.stroke();

//         ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//         ctx.font = props.font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.beginPath();
//         ctx.fillText(props.text, props.x, props.y);
//     },
//     fillStroke: (props, ctx) => () => {
//         ctx.fillStyle = props.fill;
//         ctx.strokeStyle = props.stroke;
//         ctx.lineWidth = props.lw;

//         ctx.beginPath();
//         ctx.rect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h);
//         ctx.fill();
//         ctx.stroke();

//         ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//         ctx.font = props.font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.beginPath();
//         ctx.fillText(props.text, props.x, props.y);
//     },
//     fillStrokeRound: (props, ctx) => () => {
//         ctx.fillStyle = props.fill;
//         ctx.strokeStyle = props.stroke;
//         ctx.lineWidth = props.lw;

//         ctx.beginPath();
//         ctx.roundRect(props.x - props.w / 2, props.y - props.h / 2, props.w, props.h, props.r);
//         ctx.fill();
//         ctx.stroke();

//         ctx.fillStyle = `rgba(${props.textFill.r}, ${props.textFill.g}, ${props.textFill.b}, 1)`;
//         ctx.font = props.font;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         ctx.beginPath();
//         ctx.fillText(props.text, props.x, props.y);
//     },
// };

// const createFadeOutUpdate = (props: ButtonOptionsRequired) => {
//     const onTransitionFinished = () => {
//         console.log('transition finished');
//     };

//     const transitionUpdate = createTransitionUpdate(props, onTransitionFinished);

//     return transitionUpdate;
// };

// export const menu: MenuButtons = {
//     main: {
//         buttons: [],
//         handlers: [],
//     },
// };

// menu.main.handlers[4].up = () => {
//     startSurvival();
// };

// createStartMenuButtons();

// interface MenuButtons {
//     main: {
//         buttons: Omit<ButtonOptions, 'click' | 'colors'>[];
//         handlers: Required<ButtonHandlers>[];
//     };
// }
