import { Canvas } from 'engine/entities/Canvas';
import { Rect } from 'engine/entities/Rect';
import { Sprite } from 'engine/entities/Sprite';
import { VECTOR } from 'engine/types/Vector';

import { Fighter } from './classes';
import { decreaseTimer, determineWinner, rectangularCollision } from './utils';

const canvas = new Canvas({
    width: 1024,
    height: 576,
});

new Rect({
    ctx: canvas.context,
    position: {
        x: 0,
        y: 0,
    },
    size: {
        width: canvas.width,
        height: canvas.height,
    },
}).draw();

const background = new Sprite({
    ctx: canvas.context,
    dimensions: {
        position: VECTOR.ZERO,
        size: {
            width: 50,
            height: 150,
        },
    },
    imageOptions: {
        src: './img/background.png',
    },
});

const shop = new Sprite({
    ctx: canvas.context,
    dimensions: {
        position: {
            x: 600,
            y: 128,
        },
        size: {
            width: 50,
            height: 150,
        },
    },
    imageOptions: {
        src: './img/shop.png',
        scale: 2.75,
    },
    animationOptions: {
        frames: 6,
    },
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 160,
        height: 50,
    },
    canvas,
    keys: {
        left: 'a',
        right: 'd',
        up: 'w',
        down: ' ',
    },
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50,
    },
    canvas,
    keys: {
        right: 'ArrowRight',
        left: 'ArrowLeft',
        up: 'ArrowUp',
        down: 'ArrowDown',
    },
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
};

decreaseTimer({ player, enemy });

function animate() {
    window.requestAnimationFrame(animate);

    background.update();
    shop.update();
    new Rect({
        ctx: canvas.context,
        color: 'rgba(255, 255, 255, 0.15)',
        position: VECTOR.ZERO,
        size: {
            width: canvas.width,
            height: canvas.height,
        },
    }).draw();
    player.update();
    enemy.update();

    // detect for collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.animation.currentFrame === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;

        gsap.to('#enemyHealth', {
            width: enemy.health + '%',
        });
    }

    // if player misses
    if (player.isAttacking && player.animation.currentFrame === 4) {
        player.isAttacking = false;
    }

    // this is where our player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.animation.currentFrame === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHealth', {
            width: player.health + '%',
        });
    }

    // if player misses
    if (enemy.isAttacking && enemy.animation.currentFrame === 2) {
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();
