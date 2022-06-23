import { Drawable } from 'engine/types/Drawable';
import { Size } from 'engine/types/Size';
import { Vector } from 'engine/types/Vector';

const DEFAULT_CANVAS_STYLE = 'transparent';

interface Constructor {
    ctx: CanvasRenderingContext2D;
    position: Vector;
    size: Size;
    color?: string;
}

export class Rect implements Drawable {
    private ctx: CanvasRenderingContext2D;
    private position: Vector;
    private size: Size;
    private color: string;

    constructor({
        ctx,
        position,
        size,
        color = DEFAULT_CANVAS_STYLE,
    }: Constructor) {
        this.ctx = ctx;
        this.position = position;
        this.size = size;
        this.color = color;
    }

    public draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height,
        );
    }
}
