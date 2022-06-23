import { Size } from 'engine/types/Size';

export class Canvas {
    private canvas: HTMLCanvasElement;
    public width: number;
    public height: number;
    public context: CanvasRenderingContext2D;

    constructor(size: Size) {
        this.canvas = this.getCanvasElement(size);
        this.width = size.width;
        this.height = size.height;
        this.context = this.getContext();
    }

    private getContext() {
        const context = this.canvas.getContext('2d');

        if (!context) throw new Error('Could not get canvas context');

        return context;
    }

    private getCanvasElement(size: Size): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;

        document.body.appendChild(canvas);

        return canvas;
    }
}
