import { Picture } from 'engine/entities/Picture';

const gravity = 0.7;

export class Sprite {
    public position: any;
    public width: any;
    public height: any;
    public image: any;
    public scale: any;
    public framesMax: any;
    public framesCurrent: any;
    public framesElapsed: any;
    public framesHold: any;
    public offset: any;
    protected canvas: any;

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
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
        this.canvas = canvas;
    }

    draw() {
        new Picture({
            ctx: this.canvas.context,
            dimensions: {
                position: {
                    x: this.position.x - this.offset.x,
                    y: this.position.y - this.offset.y,
                },
                size: {
                    width: (this.image.width / this.framesMax) * this.scale,
                    height: this.image.height * this.scale,
                },
            },
            src: this.image.src,
            spriting: {
                position: {
                    x: this.framesCurrent * (this.image.width / this.framesMax),
                    y: 0,
                },
                size: {
                    width: this.image.width / this.framesMax,
                    height: this.image.height,
                },
            },
        }).draw();
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

export class Fighter extends Sprite {
    public velocity: any;
    public width: any;
    public height: any;
    public lastKey: any;
    public attackBox: any;
    public color: any;
    public isAttacking: any;
    public health: any;
    public framesCurrent: any;
    public framesElapsed: any;
    public framesHold: any;
    public sprites: any;
    public dead: any;

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
        canvas,
    }: Record<string, any>) {
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
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        if (!this.dead) this.animateFrames();

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
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true;
            return;
        }

        // overriding all other animations with the attack animation
        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
            return;

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;

            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }
    }
}
