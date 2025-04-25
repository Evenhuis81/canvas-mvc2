import {LibraryInput} from 'library/types/input';
import {TransformedView} from 'library/types/views';

export const createCharacter = (tv: TransformedView, input: LibraryInput) => {
    const {pos, vel, ...props} = createCharacterProperties();

    const draw = {
        id: `reverse-character-draw`,
        name: 'Draw Character',
        fn: () => {
            tv.paint.triangle(pos.x, pos.y, props.fill, props.stroke, props.lw);
        },
    };

    const update = {
        id: `reverse-character-update`,
        name: 'Update Character',
        fn: () => {
            pos.y += vel.y;
        },
    };

    input.addListener({
        type: 'keyup',
        listener: ({code}) => {
            if (code === 'Space' && props.grounded) {
                vel.y = -vel.y;
                props.grounded = false;
            }
        },
        id: Symbol(),
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

// let lastWorldOffsetX = world.xOffset;
// let xInterval = 0;
// xInterval = world.xOffset - lastWorldOffsetX;
// lastWorldOffsetX = world.xOffset;

// if (!props.grounded) pos.y += vel.vy;

// collisions.topLeft = props.level.getRawTile(Math.floor(pos.x), Math.floor(pos.y));
// collisions.bottomLeft = props.level.getRawTile(Math.floor(pos.x), Math.floor(pos.y) + 1);
// collisions.topRight = props.level.getRawTile(Math.floor(pos.x) + 1, Math.floor(pos.y));
// collisions.bottomRight = props.level.getRawTile(Math.floor(pos.x) + 1, Math.floor(pos.y) + 1);

//         // X Movement Check, before Y check, else it may 'snap' into unwanted position
//         if (
//             false
//             // props.level.getTile(Math.floor(pos.x + world.xOffset + 0.95), Math.floor(pos.y)) === 'X' ||
//             // props.level.getTile(Math.floor(pos.x + world.xOffset + 0.95), Math.floor(pos.y + 0.95)) === 'X'
//         ) {
//             pos.x += xInterval;
//         }

//         if (
//             false
//             // props.level.getTile(Math.floor(pos.x - world.xOffset), Math.floor(pos.y + 0.95)) === 'X' ||
//             // props.level.getTile(Math.floor(pos.x - world.xOffset + 0.95), Math.floor(pos.y + 0.95)) === 'X'
//         ) {
//             props.grounded = true;
//             props.face = 'up';
//             pos.y = Math.floor(pos.y);
//         }

//         if (
//             // props.level.getTile(Math.floor(pos.x - world.xOffset), Math.floor(pos.y)) === 'X' ||
//             // props.level.getTile(Math.floor(pos.x - world.xOffset + 0.95), Math.floor(pos.y)) === 'X'
//             false
//         ) {
//             props.grounded = true;
//             props.face = 'down';
//             pos.y = Math.floor(pos.y + 1);
//         }

//         props.scaledX = pos.x * world.unitScale;
//         props.scaledY = pos.y * world.unitScale;
