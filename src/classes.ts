import { Animation } from 'engine/entities/Animation';
import { Picture } from 'engine/entities/Picture';
import { Vector } from 'engine/types/Vector';

const gravity = 0.7;
export class Sprite {
    public position: any;
    public width: any;
    public height: any;
    public image: any;
    public scale: any;
    public offset: any;
    protected canvas: any;
    protected animation: Animation;

    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        canvas,
    }: Record<string, any>) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.offset = offset;
        this.canvas = canvas;
        this.animation = new Animation({
            frames: framesMax,
        });
    }

    draw() {
        new Picture({
            dimensions: {
                position: {
                    x: this.position.x - this.offset.x,
                    y: this.position.y - this.offset.y,
                },
                size: {
                    width:
                        (this.image.width / this.animation.frames) * this.scale,
                    height: this.image.height * this.scale,
                },
            },
            src: this.image.src,
            spriting: {
                position: {
                    x:
                        this.animation.currentFrame *
                        (this.image.width / this.animation.frames),
                    y: 0,
                },
                size: {
                    width: this.image.width / this.animation.frames,
                    height: this.image.height,
                },
            },
        }).draw();
    }

    update() {
        this.draw();
        this.animation.update();
    }
}

type KeyControllers = {
    left: string;
    right: string;
    up: string;
    down: string;
};

type Constructor = Record<string, any> & {
    position: Vector;
    velocity: Vector;
    keys: KeyControllers;
};

type KeysType = Record<keyof KeyControllers, { key: string; pressed: boolean }>;
export class Fighter extends Sprite {
    public velocity: Vector;
    public width: any;
    public height: any;
    public lastKey: any;
    public attackBox: any;
    public color: any;
    public isAttacking: any;
    public health: any;
    public sprites: any;
    public dead: any;
    public keys: KeysType;

    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
        keys,
        canvas,
    }: Constructor) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
            canvas,
        });

        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.color = color;
        this.health = 100;
        this.sprites = sprites;
        this.dead = false;
        this.keys = Object.entries(keys).reduce<KeysType>(
            (acc, [key, value]) => ({
                ...acc,
                [key]: {
                    key: value,
                    pressed: false,
                },
            }),
            {} as KeysType,
        );

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

        window.addEventListener('keydown', event => {
            if (!this.dead) {
                switch (event.key) {
                    case this.keys.left.key:
                        this.keys.left.pressed = true;
                        this.lastKey = this.keys.left.key;
                        break;
                    case this.keys.right.key:
                        this.keys.right.pressed = true;
                        this.lastKey = this.keys.right.key;
                        break;
                    case this.keys.up.key:
                        this.velocity.y = -20;
                        break;
                    case this.keys.down.key:
                        this.attack();
                        break;
                }
            }
        });

        window.addEventListener('keyup', event => {
            switch (event.key) {
                case this.keys.left.key:
                    this.keys.left.pressed = false;
                    break;
                case this.keys.right.key:
                    this.keys.right.pressed = false;
                    break;
            }
        });
    }

    update() {
        this.draw();
        if (!this.dead) this.animation.update();

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // draw the attack box
        // c.fillRect(
        //   this.attackBox.position.x,
        //   this.attackBox.position.y,
        //   this.attackBox.width,
        //   this.attackBox.height
        // )

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // gravity function
        if (
            this.position.y + this.height + this.velocity.y >=
            this.canvas.height - 96
        ) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else this.velocity.y += gravity;

        this.velocity.x = 0;

        if (this.keys.left.pressed && this.lastKey === this.keys.left.key) {
            this.velocity.x = -5;
            this.switchSprite('run');
        } else if (
            this.keys.right.pressed &&
            this.lastKey === this.keys.right.key
        ) {
            this.velocity.x = 5;
            this.switchSprite('run');
        } else {
            this.switchSprite('idle');
        }

        if (this.velocity.y < 0) {
            this.switchSprite('jump');
        } else if (this.velocity.y > 0) {
            this.switchSprite('fall');
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20;

        if (this.health <= 0) {
            this.switchSprite('death');
        } else this.switchSprite('takeHit');
    }

    switchSprite(sprite: any) {
        if (this.image === this.sprites.death.image) {
            if (
                this.animation.currentFrame ===
                this.sprites.death.framesMax - 1
            )
                this.dead = true;
            return;
        }

        // overriding all other animations with the attack animation
        if (
            this.image === this.sprites.attack1.image &&
            this.animation.currentFrame < this.sprites.attack1.framesMax - 1
        )
            return;

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.animation.currentFrame < this.sprites.takeHit.framesMax - 1
        )
            return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.animation.frames = this.sprites.idle.framesMax;
                    this.animation.reset();
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.animation.frames = this.sprites.run.framesMax;
                    this.animation.reset();
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.animation.frames = this.sprites.jump.framesMax;
                    this.animation.reset();
                }
                break;

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.animation.frames = this.sprites.fall.framesMax;
                    this.animation.reset();
                }
                break;

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.animation.frames = this.sprites.attack1.framesMax;
                    this.animation.reset();
                }
                break;

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.animation.frames = this.sprites.takeHit.framesMax;
                    this.animation.reset();
                }
                break;

            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.animation.frames = this.sprites.death.framesMax;
                    this.animation.reset();
                }
                break;
        }
    }

    get animationProp() {
        return this.animation;
    }
}
