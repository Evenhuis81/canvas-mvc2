import type {WorldProperties} from '.';
import type {ReverseLevel} from './level';
import type {CreateElement, EntityElement} from 'library/entity';
import type {ShapeMap} from 'library/entity/defaults/shapes';

const groundCheck = (level: ReverseLevel, x: number, y: number): boolean => level.getTile(x, y) === 'X';

export const createCharacter = (
    world: WorldProperties,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    level: ReverseLevel,
    createElement: CreateElement<ShapeMap>,
) => {
    const startPosition = level.startPos(level.map);

    const {pos, collisions, vel, tri, ...props} = createCharacterProperties(startPosition, world, level);

    props.grounded = groundCheck(level, startPosition.x, startPosition.y + 1);

    // No ground means falling down with face down
    if (!props.grounded) {
        props.face = 'down';
    }

    if (pos.x === -1 || pos.y === -1) throw Error('Player Start Position not found on level map');

    // Positioning player in middle and shifting world view to fit player
    const middleMapX = Math.floor(world.xUnits / 2);
    const xDiff = middleMapX - pos.x;
    world.xOffset += xDiff;
    pos.x += xDiff;

    const setLevel = (lvl: ReverseLevel) => {
        props.level = lvl;

        const newStartPosition = level.startPos(level.map);

        pos.x = newStartPosition.x;
        pos.y = newStartPosition.y;

        props.scaledX = pos.x * world.unitScale;
        props.scaledY = pos.y * world.unitScale;

        props.grounded = groundCheck(level, pos.x, pos.y + 1);
    };

    type Pointers = {
        topLeft: EntityElement<ShapeMap, 'circle-pointer'>;
        bottomLeft: EntityElement<ShapeMap, 'circle-pointer'>;
        topRight: EntityElement<ShapeMap, 'circle-pointer'>;
        bottomRight: EntityElement<ShapeMap, 'circle-pointer'>;
    };

    const setPointers = (pointers: Pointers) => {
        const t = Object.entries(pointers);
        console.log(t);
    };

    const draw = {
        id: `reverse-character-draw`,
        name: 'Draw Character',
        fn: () => {
            ctx.fillStyle = '#009';

            ctx.beginPath();

            vel.y < 0 ? faceUp() : faceDown();

            ctx.fill();
        },
    };

    const faceUp = () => {
        ctx.moveTo(props.scaledX + props.scaledW / 2, props.scaledY);
        ctx.lineTo(props.scaledX + props.scaledW, props.scaledY + props.scaledH);
        ctx.lineTo(props.scaledX, props.scaledY + props.scaledH);
    };

    const faceDown = () => {
        ctx.moveTo(props.scaledX + props.scaledW / 2, props.scaledY + props.scaledH); //  + props.scaledH
        ctx.lineTo(props.scaledX + props.scaledW, props.scaledY); // -props.scaledH
        ctx.lineTo(props.scaledX, props.scaledY); // -props.scaledH
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

            collisions.topLeft = props.level.getTile(Math.floor(pos.x), Math.floor(pos.y));
            collisions.bottomLeft = props.level.getTile(Math.floor(pos.x), Math.floor(pos.y) + 1);
            collisions.topRight = props.level.getTile(Math.floor(pos.x) + 1, Math.floor(pos.y));
            collisions.bottomRight = props.level.getTile(Math.floor(pos.x) + 1, Math.floor(pos.y) + 1);

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

    return {draw, update, properties: props, pos, vel, collisions, setLevel};
};

const createCharacterProperties = (
    startPosition: {x: number; y: number},
    world: WorldProperties,
    level: ReverseLevel,
) => ({
    pos: {x: startPosition.x, y: startPosition.y},
    vel: {x: 0, y: 0},
    tri: {
        x1: startPosition.x + 0.5,
        y1: startPosition.y,
        x2: startPosition.x + 1,
        y2: startPosition.y + 1,
        x3: startPosition.x,
        y3: startPosition.y + 1,
    },
    w: 1,
    h: 1,
    scaledX: startPosition.x * world.unitScale,
    scaledY: startPosition.y * world.unitScale,
    scaledW: world.unitScale,
    scaledH: world.unitScale,
    speed: 0.05,
    face: 'up',
    grounded: true,
    fill: '#009',
    level,
    collisions: {
        topLeft: level.getTile(startPosition.x, startPosition.y),
        bottomLeft: level.getTile(startPosition.x, startPosition.y + 1),
        topRight: level.getTile(startPosition.x + 1, startPosition.y),
        bottomRight: level.getTile(startPosition.x + 1, startPosition.y + 1),
    },
});
