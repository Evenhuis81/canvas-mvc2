/* eslint-disable max-lines-per-function */
import {initialize} from 'library/index';
import imgg from 'library/images/ff7bae45720c68b1f35e5d826e44a9d2.png';
import type {LibraryOptions} from 'library/types';

const libraryID = 'shmup';

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    full: true,
    center: true,
    clear: true,
    backgroundColor: '#000',
    engineStats: true,
};

export default () => ({
    run: async () => {
        const {canvas, context, engine} = initialize(libraryID, libraryOptions);

        player.x = canvas.width / 2 - 32;
        player.y = canvas.height - 96;

        sprPlayer.src = imgg;
        await sprPlayer.decode();

        engine.setUpdate({
            fn: () => {
                if (player.up) player.y -= player.speed;
                if (player.down) player.y += player.speed;
                if (player.left) player.x -= player.speed;
                if (player.right) player.x += player.speed;
            },
        });

        engine.setDraw({
            fn: () => {
                for (let i = 0; i < starAmount; i++) {
                    context.fillStyle = i < 50 ? '#aaa' : '#fff';
                    arrayStars[i].y += worldSpeed * (i < 50 ? 0.8 : 1);
                    if (arrayStars[i].y > canvas.height) {
                        arrayStars[i].x = Math.random() * canvas.width;
                        arrayStars[i].y = 0;
                    }

                    context.beginPath();
                    context.rect(arrayStars[i].x, arrayStars[i].y, 2, 2);
                    context.fill();
                }

                context.drawImage(sprPlayer, player.x, player.y, 64, 64);
            },
        });

        addEventListener('keydown', ({code}) => {
            if (code === 'KeyW') player.up = true;
            if (code === 'KeyS') player.down = true;
            if (code === 'KeyA') player.left = true;
            if (code === 'KeyD') player.right = true;
        });

        addEventListener('keyup', ({code}) => {
            if (code === 'KeyW') player.up = false;
            if (code === 'KeyS') player.down = false;
            if (code === 'KeyA') player.left = false;
            if (code === 'KeyD') player.right = false;
        });

        for (let i = 0; i < starAmount; i++)
            arrayStars.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height});

        engine.run();
    },
});

const player = {x: 0, y: 0, speed: 5, up: false, down: false, left: false, right: false};

const sprPlayer = new Image();

const starAmount = 500;
const arrayStars: {x: number; y: number}[] = [];

const worldSpeed = 1;
//

type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;

interface IdLabel {
    id: number /* some fields */;
}
interface NameLabel {
    name: string /* other fields */;
}

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
    throw 'unimplemented';
}

const a = createLabel('typescript');

let a: NameLabel;

const b = createLabel(2.8);

let b: IdLabel;

const c = createLabel(Math.random() ? 'hello' : 42);
let c: NameLabel | IdLabel;
