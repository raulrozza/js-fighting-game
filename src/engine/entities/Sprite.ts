import { Animation } from 'engine/entities/Animation';
import { Composable } from 'engine/entities/Composable';
import { Picture } from 'engine/entities/Picture';
import { Rect } from 'engine/entities/Rect';
import { Drawable } from 'engine/types/Drawable';
import { Size } from 'engine/types/Size';
import { VECTOR, Vector } from 'engine/types/Vector';

type Dimensions = {
    position: Vector;
    size: Size;
    offset?: Vector;
};

type ImageOptions = {
    src: string;
    scale?: number;
};

type RectOptions = {
    color?: string;
};

type AnimationOptions = {
    frames: number;
    loop?: boolean;
};

type BuildValues = {
    dimensions: Dimensions;
    imageOptions?: ImageOptions;
    rectOptions?: RectOptions;
    animationOptions?: AnimationOptions;
};

const COMPONENTS = {
    ANIMATION: 'animation',
};

export class Sprite extends Composable {
    private dimensions: Required<Dimensions>;
    private rectOptions: RectOptions;
    private imageOptions?: Required<ImageOptions>;
    public image?: CanvasImageSource;

    constructor({
        dimensions,
        animationOptions,
        imageOptions,
        rectOptions = {},
    }: BuildValues) {
        super();
        const { position, size, offset = VECTOR.ZERO } = dimensions;

        if (imageOptions) {
            const { src, scale = 1 } = imageOptions;
            this.imageOptions = { src, scale };

            this.image = new Image();
            this.image.src = this.imageOptions.src;
        }

        this.dimensions = { position, size, offset };

        this.rectOptions = rectOptions;

        if (animationOptions)
            this.addComponent(
                COMPONENTS.ANIMATION,
                new Animation(animationOptions),
            );
    }

    private draw() {
        const drawable = this.imageOptions ? this.getPicture() : this.getRect();

        drawable.draw();
    }

    public update() {
        super.update();
        this.draw();
    }

    private getPicture(): Drawable {
        const { width, height } = this.image as HTMLImageElement;
        const options = this.imageOptions as Required<ImageOptions>;
        const animation = this.getComponent<Animation>(COMPONENTS.ANIMATION);

        const position: Vector = {
            x: this.dimensions.position.x - this.dimensions.offset.x,
            y: this.dimensions.position.y - this.dimensions.offset.y,
        };
        const size: Size = {
            width: width * options.scale,
            height: height * options.scale,
        };

        if (animation)
            return new Picture({
                dimensions: {
                    position,
                    size: {
                        width: size.width / animation.frames,
                        height: size.height,
                    },
                },
                src: options.src,
                spriting: {
                    position: {
                        x: animation.currentFrame * (width / animation.frames),
                        y: 0,
                    },
                    size: {
                        width: width / animation.frames,
                        height,
                    },
                },
            });

        return new Picture({
            dimensions: {
                position,
                size,
            },
            src: options.src,
        });
    }

    private getRect(): Drawable {
        return new Rect({
            position: this.dimensions.position,
            size: this.dimensions.size,
            color: this.rectOptions.color,
        });
    }
}
