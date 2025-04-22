import {TransformedView} from 'library/types/views';

export const createCharacter = (ctx: CanvasRenderingContext2D, tv: TransformedView) => {
    const {pos, vel, tri, ...props} = createCharacterProperties();

    const draw = {
        id: `reverse-character-draw`,
        name: 'Draw Character',
        fn: () => {
            tv.paint.triangle(tri.x1, tri.y1, tri.x2, tri.y2, tri.x3, tri.y3, props.fill, props.stroke, props.lw);
        },
    };

    // vel.y < 0 ? faceUp() : faceDown();

    const faceUp = () => {
        // ctx.moveTo(props.scaledX + props.scaledW / 2, props.scaledY);
        // ctx.lineTo(props.scaledX + props.scaledW, props.scaledY + props.scaledH);
        // ctx.lineTo(props.scaledX, props.scaledY + props.scaledH);
    };

    const faceDown = () => {
        // ctx.moveTo(props.scaledX + props.scaledW / 2, props.scaledY + props.scaledH); //  + props.scaledH
        // ctx.lineTo(props.scaledX + props.scaledW, props.scaledY); // -props.scaledH
        // ctx.lineTo(props.scaledX, props.scaledY); // -props.scaledH
    };

    let lastWorldOffsetX = world.xOffset;
    let xInterval = 0;

    const update = {
        id: `reverse-character-update`,
        name: 'Update Character',
        fn: () => {
            xInterval = world.xOffset - lastWorldOffsetX;
            lastWorldOffsetX = world.xOffset;

            // if (!props.grounded) pos.y += vel.vy;
            pos.y += vel.y;

            collisions.topLeft = props.level.getRawTile(Math.floor(pos.x), Math.floor(pos.y));
            collisions.bottomLeft = props.level.getRawTile(Math.floor(pos.x), Math.floor(pos.y) + 1);
            collisions.topRight = props.level.getRawTile(Math.floor(pos.x) + 1, Math.floor(pos.y));
            collisions.bottomRight = props.level.getRawTile(Math.floor(pos.x) + 1, Math.floor(pos.y) + 1);

            // X Movement Check, before Y check, else it may 'snap' into unwanted position
            if (
                false
                // props.level.getTile(Math.floor(pos.x + world.xOffset + 0.95), Math.floor(pos.y)) === 'X' ||
                // props.level.getTile(Math.floor(pos.x + world.xOffset + 0.95), Math.floor(pos.y + 0.95)) === 'X'
            ) {
                pos.x += xInterval;
            }

            if (
                false
                // props.level.getTile(Math.floor(pos.x - world.xOffset), Math.floor(pos.y + 0.95)) === 'X' ||
                // props.level.getTile(Math.floor(pos.x - world.xOffset + 0.95), Math.floor(pos.y + 0.95)) === 'X'
            ) {
                props.grounded = true;
                props.face = 'up';
                pos.y = Math.floor(pos.y);
            }

            if (
                // props.level.getTile(Math.floor(pos.x - world.xOffset), Math.floor(pos.y)) === 'X' ||
                // props.level.getTile(Math.floor(pos.x - world.xOffset + 0.95), Math.floor(pos.y)) === 'X'
                false
            ) {
                props.grounded = true;
                props.face = 'down';
                pos.y = Math.floor(pos.y + 1);
            }

            props.scaledX = pos.x * world.unitScale;
            props.scaledY = pos.y * world.unitScale;
        },
    };

    canvas.addEventListener('keyup', ({code}) => {
        if (code === 'Space' && props.grounded) {
            // See comment in update, can be fixed here with a check before 'ungrounding'.
            // Needs a different check while not gorounded? (depends on playstyle)
            vel.y = -vel.y;
            props.grounded = false;
            props.face = vel.y > 0 ? 'down' : 'up';
        }
    });

    return {draw, update, properties: props, pos, vel};
};

const createCharacterProperties = () =>
    // startPosition: {x: number; y: number},
    // world: WorldProperties,
    // level: ReverseLevel,
    ({
        pos: {x: 0, y: 0},
        vel: {x: 0, y: 0.01},
        tri: {
            x1: 0.5,
            y1: 0,
            x2: 1,
            y2: 1,
            x3: 0,
            y3: 1,
        },
        speed: 0.05,
        grounded: true,
        fill: '#009',
        stroke: '#930',
        lw: 0.05,
        // pos: {x: startPosition.x, y: startPosition.y},
        // w: 1,
        // h: 1,
        // scaledX: startPosition.x * world.unitScale,
        // scaledY: startPosition.y * world.unitScale,
        // scaledW: world.unitScale,
        // scaledH: world.unitScale,
        // face: 'up',
        // level,
        // collisions: {
        //     topLeft: level.getRawTile(startPosition.x, startPosition.y),
        //     bottomLeft: level.getRawTile(startPosition.x, startPosition.y + 1),
        //     topRight: level.getRawTile(startPosition.x + 1, startPosition.y),
        //     bottomRight: level.getRawTile(startPosition.x + 1, startPosition.y + 1),
        // },
    });

// const groundCheck = (level: ReverseLevel, x: number, y: number): boolean => level.getRawTile(x, y) === 'X';

// if (pos.x === -1 || pos.y === -1) throw Error('Player Start Position not found on level map');

// props.grounded = groundCheck(level, startPosition.x, startPosition.y + 1);

// No ground means falling down with face down
// if (!props.grounded) {
//     props.face = 'down';
// }

// Positioning player in middle and shifting world view to fit player
// const middleMapX = Math.floor(world.xUnits / 2);
// const xDiff = middleMapX - pos.x;
// world.xOffset += xDiff;
// pos.x += xDiff;

// const setLevel = (level: ReverseLevel) => {
//     props.level = level;

//     const newStartPosition = level.startPos();

//     pos.x = newStartPosition.x;
//     pos.y = newStartPosition.y;

//     props.scaledX = pos.x * world.unitScale;
//     props.scaledY = pos.y * world.unitScale;

//     props.grounded = groundCheck(level, pos.x, pos.y + 1);
// };

// type Pointers = {
//     topLeft: EntityElement<ShapeMap, 'circle-pointer'>;
//     bottomLeft: EntityElement<ShapeMap, 'circle-pointer'>;
//     topRight: EntityElement<ShapeMap, 'circle-pointer'>;
//     bottomRight: EntityElement<ShapeMap, 'circle-pointer'>;
// };

// const setPointers = (pointers: Pointers) => {
//     const t = Object.entries(pointers);
//     console.log(t);
// };
