import { Animation } from 'engine/entities/Animation';
import { Composable } from 'engine/entities/Composable';
import { Sprite } from 'engine/entities/Sprite';

interface AnimatedSprite {
    frames: number;
    image: CanvasImageSource;
    loop?: boolean;
}

interface Constructor<T extends string> {
    animations: Record<T, AnimatedSprite>;
    sprite: Sprite;
}

const COMPONENTS = {
    SPRITE: 'sprite',
};

export class AnimationController<T extends string> extends Composable {
    private animation: Animation;
    private animations: Record<T, AnimatedSprite>;

    constructor({ animations, sprite }: Constructor<T>) {
        super();
        const [initialSprite] = Object.values(animations);
        this.animation = new Animation({
            frames: initialSprite.frames,
            loop: initialSprite.loop,
        });
        this.animations = animations;
        this.addComponent(COMPONENTS.SPRITE, sprite);
    }

    public jumpTo(animation: T) {
        const sprite = this.getComponent<Sprite>(COMPONENTS.SPRITE);
        const target = this.animations[animation];

        if (sprite.image === target.image) return;

        sprite.image = target.image;
        this.animation.frames = target.frames;
        this.animation.reset();
    }
}
