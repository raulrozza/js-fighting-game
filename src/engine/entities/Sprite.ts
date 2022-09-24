import { Animation } from 'engine/entities/Animation';
import { Canvas } from 'engine/entities/Canvas';
import { Composable } from 'engine/entities/Composable';
import { Picture } from 'engine/entities/Picture';
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

type AnimationOptions = {
    frames: number;
    loop?: boolean;
};

type BuildValues = {
    dimensions: Dimensions;
    imageOptions: ImageOptions;
    animationOptions?: AnimationOptions;
};

const COMPONENTS = {
    ANIMATION: 'animation',
};

export class Sprite extends Composable {
    private ctx: CanvasRenderingContext2D;
    private dimensions: Required<Dimensions>;
    private imageOptions: Required<ImageOptions>;
    private image: CanvasImageSource;

    constructor({ dimensions, animationOptions, imageOptions }: BuildValues) {
        super();
        const { position, size, offset = VECTOR.ZERO } = dimensions;
        const { src, scale = 1 } = imageOptions;

        this.ctx = Canvas.getInstance().context;
        this.dimensions = { position, size, offset };
        this.imageOptions = { src, scale };

        this.image = new Image();
        this.image.src = this.imageOptions.src;

        if (animationOptions)
            this.addComponent(
                COMPONENTS.ANIMATION,
                new Animation(animationOptions),
            );
    }

    draw() {
        const { width, height } = this.image as HTMLImageElement;
        const animation = this.getComponent<Animation>(COMPONENTS.ANIMATION);

        const position: Vector = {
            x: this.dimensions.position.x - this.dimensions.offset.x,
            y: this.dimensions.position.y - this.dimensions.offset.y,
        };
        const size: Size = {
            width: width * this.imageOptions.scale,
            height: height * this.imageOptions.scale,
        };

        const picture = animation
            ? new Picture({
                  dimensions: {
                      position,
                      size: {
                          width: size.width / animation.frames,
                          height: size.height,
                      },
                  },
                  src: this.imageOptions.src,
                  spriting: {
                      position: {
                          x:
                              animation.currentFrame *
                              (width / animation.frames),
                          y: 0,
                      },
                      size: {
                          width: width / animation.frames,
                          height,
                      },
                  },
              })
            : new Picture({
                  dimensions: {
                      position,
                      size,
                  },
                  src: this.imageOptions.src,
              });

        picture.draw();
    }

    update() {
        super.update();
        this.draw();
    }
}
