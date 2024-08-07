// Menu, buttons:
// 1. start
// 2. settings
// 3. exit
// 4. admin options
// 5. show statistics
// 6. level editor
// 7. login
// 8. create account
// 9. load game
// 10. save game

// const startButton = getStartButton(resources.state.context);
// resources.state.engine.setShow(startButton.show);

// addEventListener('mouseup', () => {
//     if (startButton.inside()) startLevel(2);
// });

// 1. make all button properties optional
// 2. onhover:  -color (fill / stroke)
//              -size (scale out/in)
//              -dropShadow
// 3. onClick:  -loadAnimation
//              -dissapear / appear effects (slide / fade)
// 4. make button object dynamic for property changes for button methods (point 2 and 3)

// const tvUpdate = tv.moveTo(player.middlePos);
// engine.setUpdate(tvUpdate);

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

// const startButton = {
//     txt: 'Start',
//     x: 50,
//     y: 450,
//     w: 50,
//     h: 20,
//     r: 5,
//     lw: 2,
//     stroke: '#fff',
//     fill: '#000',
//     textFill: '#00f',
//     font: '20px normal sans-serif',
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
//         if (button === 0 && inside()) gameStore.state.engine.setShow({id: 0, name: 'open menu', fn: openMenu()});
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

// const eventHandler = (props: ButtonOptionsRequired) => {
//     {
//         const {click} = props;

//         let mouseupEvent: ((event: MouseEvent) => void) | undefined;
//         let touchendEvent: ((event: TouchEvent) => void) | undefined;

//         mouseupEvent = (evt: MouseEvent) => {
//             if (mouse.insideRect(props) && evt.button === 0) click({evt, button: {selfDestruct}});
//         };

//         touchendEvent = (evt: TouchEvent) => {
//             if (touch.insideRect(props)) click({evt, button: {id: props.id, selfDestruct}});
//         };

//         addEventListener('mouseup', mouseupEvent);
//         addEventListener('touchend', touchendEvent);
//     }

//     const internalMousedownEvent = ({button}: MouseEvent) => {
//         if (mouse.insideRect(props) && button === 0) {
//             props.pushed = true;
//             props.w *= 0.9;
//             props.h *= 0.9;
//         }
//     };

//     const internalMouseupEvent = () => {
//         if (props.pushed) {
//             props.w *= 1.1;
//             props.h *= 1.1;

//             props.pushed = false;
//         }
//     };

//     const internalTouchstartEvent = () => {
//         if (touch.insideRect(props)) {
//             props.pushed = true;
//             props.w *= 0.9;
//             props.h *= 0.9;
//         }
//     };

//     const internalTouchendEvent = () => {
//         if (props.pushed) {
//             props.w *= 1.1;
//             props.h *= 1.1;

//             props.pushed = false;
//         }
//     };

//     addEventListener('touchstart', internalTouchstartEvent);
//     addEventListener('touchend', internalTouchendEvent);
//     addEventListener('mouseup', internalMouseupEvent);
//     addEventListener('mousedown', internalMousedownEvent);

//     const selfDestruct = () => {
//         if (props.destructed) {
//             console.log(`Button ${props.id} is already destroyed!`);
//         }

//         removeEventListener('touchstart', internalTouchstartEvent);
//         removeEventListener('touchend', internalTouchendEvent);
//         removeEventListener('mouseup', internalMouseupEvent);
//         removeEventListener('mousedown', internalMousedownEvent);

//         if (mouseupEvent && touchendEvent) {
//             removeEventListener('touchend', touchendEvent);
//             removeEventListener('mouseup', mouseupEvent);
//         }

//         engine.removeUpdate(props.id);
//         engine.removeShow(props.id);

//         props.destructed = true;
//     };
// };

// const createFadeOutUpdate = (props: ButtonOptionsRequired) => {
//     const onTransitionFinished = () => {
//         console.log('transition finished');
//     };

//     const transitionUpdate = createTransitionUpdate(props, onTransitionFinished);

//     return transitionUpdate;
// };
