/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
export const runDemo = (resources: Resources) => {
    const {context, engine, canvas} = resources;
    const blockLength = canvas.width / map[0].length;

    const player = getPlayer(getSinglePositionFromMap('P'), context, blockLength);

    let counter = 0;
    const bullets: Vector[] = [];

    const cannons = getPositionsFromMap('C');

    engine.setUpdate({
        id: 0,
        name: 'map-update',
        fn: () => {
            player.update();
        },
    });

    const fireBullet = (bullet: Vector) => {
        console.log(bullet, cannons);
    };

    engine.setUpdate({
        id: 1,
        name: 'bullets-update',
        fn: () => {
            counter++;

            if (counter > 1000) {
                counter = 0;

                fireBullet(bullets[4]);
            } else if (counter > 750) {
                //
            }
        },
    });

    engine.setDraw({
        id: 0,
        name: 'map-draw',
        fn: () => {
            context.strokeStyle = 'red';
            context.fillStyle = 'blue';
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    switch (map[y][x]) {
                        case 'X':
                            context.beginPath();
                            context.lineWidth = 2;
                            context.strokeStyle = 'red';
                            context.fillStyle = 'blue';
                            context.rect(x * blockLength, y * blockLength, blockLength, blockLength);
                            context.fill();
                            context.stroke();
                            break;
                        case 'P':
                            player.draw();
                            break;
                        case 'C':
                            context.beginPath();
                            context.fillStyle = 'orange';
                            context.rect(x * blockLength, y * blockLength, blockLength, blockLength);
                            context.fill();
                            break;
                        default:
                            break;
                    }
                }
            }
        },
    });

    addEventListener('keydown', ({code}) => {
        if (player.movement.dir !== 'none') return;
        if (code === 'KeyW') player.move('up');
        else if (code === 'KeyS') player.move('down');
        else if (code === 'KeyA') player.move('left');
        else if (code === 'KeyD') player.move('right');
    });

    addEventListener('keyup', () => {
        // player.move('none');
    });
};

type BlockType = 'P' | 'X' | 'C';

const map = [
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['C', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'X'],
    ['X', '.', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['C', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'P', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '.', 'X'],
    ['C', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'X'],
    ['X', '.', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['C', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
];

const getPositionsFromMap = (type: BlockType) => {
    const foundBlocks: Vector[] = [];

    for (let y = 0; y < map.length; y++)
        for (let x = 0; x < map[y].length; x++) if (map[y][x] === type) foundBlocks.push({x, y});

    return foundBlocks;
};

const getSinglePositionFromMap = (type: BlockType) => {
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) if (map[y][x] === type) return {x, y};

    throw Error('position not found');
};

const createCollisionCheck: CollisionCheck = (pos, vel, cur, mov) => ({
    up: () => {
        pos.y -= vel.y;

        if (map[cur.y][cur.x] === 'X') {
            pos.y = cur.y + 1;

            mov.dir = 'none';
        }
    },
    down: () => {
        pos.y += vel.y;

        if (map[cur.y + 1][cur.x] === 'X') {
            pos.y = cur.y;

            mov.dir = 'none';
        }
    },
    left: () => {
        pos.x -= vel.x;

        if (map[cur.y][cur.x] === 'X') {
            pos.x = cur.x + 1;

            mov.dir = 'none';
        }
    },
    right: () => {
        pos.x += vel.x;

        if (map[cur.y][cur.x + 1] === 'X') {
            pos.x = cur.x;

            mov.dir = 'none';
        }
    },
});

const getPlayer = (startPos: {x: number; y: number}, context: CanvasRenderingContext2D, blockLength: number) => {
    const pos = {...startPos};
    const vel = {x: 0.2, y: 0.2};
    const cur = {x: 0, y: 0};
    const mov: {dir: MoveDirection} = {
        dir: 'none',
    };

    const collisionCheck = createCollisionCheck(pos, vel, cur, mov);

    const move = (dir: MoveDirection) => {
        mov.dir = dir;
    };

    const update = () => {
        if (mov.dir === 'none') return;

        cur.x = Math.floor(pos.x);
        cur.y = Math.floor(pos.y);

        collisionCheck[mov.dir]();
    };

    const draw = () => {
        context.beginPath();
        context.fillStyle = 'purple';
        context.rect(pos.x * blockLength, pos.y * blockLength, blockLength, blockLength);
        context.fill();
    };

    return {draw, update, movement: mov, move};
};
