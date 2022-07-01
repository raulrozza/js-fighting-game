import { Animation } from 'engine/entities/Animation';
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
    ctx: CanvasRenderingContext2D;
    dimensions: Dimensions;
    imageOptions: ImageOptions;
    animationOptions?: AnimationOptions;
};

export class Sprite {
    private ctx: CanvasRenderingContext2D;
    private dimensions: Required<Dimensions>;
    private imageOptions: Required<ImageOptions>;
    private image: CanvasImageSource;
    private animation?: Animation;

    constructor({
        ctx,
        dimensions,
        animationOptions,
        imageOptions,
    }: BuildValues) {
        const { position, size, offset = VECTOR.ZERO } = dimensions;
        const { src, scale = 1 } = imageOptions;

        this.ctx = ctx;
        this.dimensions = { position, size, offset };
        this.imageOptions = { src, scale };

        this.image = new Image();
        this.image.src = this.imageOptions.src;

        if (animationOptions) this.animation = new Animation(animationOptions);
    }

    draw() {
        const { width, height } = this.image as HTMLImageElement;

        const position: Vector = {
            x: this.dimensions.position.x - this.dimensions.offset.x,
            y: this.dimensions.position.y - this.dimensions.offset.y,
        };
        const size: Size = {
            width: width * this.imageOptions.scale,
            height: height * this.imageOptions.scale,
        };

        const picture = this.animation
            ? new Picture({
                  ctx: this.ctx,
                  dimensions: {
                      position,
                      size: {
                          width: size.width / this.animation.frames,
                          height: size.height,
                      },
                  },
                  src: this.imageOptions.src,
                  spriting: {
                      position: {
                          x:
                              this.animation.currentFrame *
                              (width / this.animation.frames),
                          y: 0,
                      },
                      size: {
                          width: width / this.animation.frames,
                          height,
                      },
                  },
              })
            : new Picture({
                  ctx: this.ctx,
                  dimensions: {
                      position,
                      size,
                  },
                  src: this.imageOptions.src,
              });

        picture.draw();
    }

    update() {
        this.draw();
        this.animation?.update();
    }
}
