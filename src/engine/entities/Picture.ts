import { Canvas } from 'engine/entities/Canvas';
import { Drawable } from 'engine/types/Drawable';
import { Size } from 'engine/types/Size';
import { Vector } from 'engine/types/Vector';

type Dimensions = {
    position: Vector;
    size: Size;
};

interface Constructor {
    dimensions: Dimensions;
    src: string;
    spriting?: Dimensions;
}

export class Picture implements Drawable {
    public dimensions: Dimensions;
    public spriting?: Dimensions;
    private ctx: CanvasRenderingContext2D;
    private image: CanvasImageSource;

    constructor({ dimensions, spriting, src }: Constructor) {
        this.ctx = Canvas.getInstance().context;
        this.dimensions = dimensions;
        this.spriting = spriting;
        const image = new Image();
        image.src = src;
        this.image = image;
    }

    public draw(): void {
        if (this.spriting)
            return this.ctx.drawImage(
                this.image,
                this.spriting.position.x,
                this.spriting.position.y,
                this.spriting.size.width,
                this.spriting.size.height,
                this.dimensions.position.x,
                this.dimensions.position.y,
                this.dimensions.size.width,
                this.dimensions.size.height,
            );

        this.ctx.drawImage(
            this.image,
            this.dimensions.position.x,
            this.dimensions.position.y,
            this.dimensions.size.width,
            this.dimensions.size.height,
        );
    }
}
