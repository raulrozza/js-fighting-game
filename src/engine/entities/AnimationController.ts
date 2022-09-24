import { Animation } from 'engine/entities/Animation';
import { Composable } from 'engine/entities/Composable';
import { Sprite } from 'engine/entities/Sprite';

interface AnimatedSprite<T extends string> {
    key: T;
    frames: number;
    image: CanvasImageSource;
    loop?: boolean;
}

interface Constructor<T extends string> {
    animations: AnimatedSprite<T>[];
    sprite: Sprite;
}

const COMPONENTS = {
    SPRITE: 'sprite',
};

export class AnimationController<T extends string> extends Composable {
    private animations: Record<T, AnimatedSprite<T>>;
    private current: {
        key: T;
        animation: Animation;
    };

    constructor({ animations, sprite }: Constructor<T>) {
        super();
        const [initialSprite] = animations;
        this.current = {
            animation: new Animation({
                frames: initialSprite.frames,
                loop: initialSprite.loop,
            }),
            key: initialSprite.key,
        };
        this.animations = animations.reduce(
            (acc, animation) => ({
                ...acc,
                [animation.key]: animation,
            }),
            {} as Record<T, AnimatedSprite<T>>,
        );
        this.addComponent(COMPONENTS.SPRITE, sprite);
    }

    public jumpTo(animation: T) {
        if (this.current.key === animation) return;

        const sprite = this.getComponent<Sprite>(COMPONENTS.SPRITE);
        const target = this.animations[animation];

        sprite.image = target.image;
        this.current.key = target.key;
        this.current.animation.frames = target.frames;
        this.current.animation.reset();
    }

    public isFinished() {
        return this.current.animation.isFinished();
    }
}
