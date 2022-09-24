import { Size } from 'engine/types/Size';
export class Canvas {
    private canvas: HTMLCanvasElement;
    public width: number;
    public height: number;
    public context: CanvasRenderingContext2D;

    private static instance: Canvas; // eslint-disable-line no-use-before-define

    private constructor(size: Size) {
        this.canvas = this.getCanvasElement(size);
        this.width = size.width;
        this.height = size.height;
        this.context = this.getContext();

        this.renderScreen(this.canvas);
    }

    public static create(size: Size) {
        if (!this.instance) {
            this.instance = new Canvas(size);
        }
        return this.instance;
    }

    public static getInstance() {
        if (!this.instance) throw new Error('Canvas is not created');

        return this.instance;
    }

    private getCanvasElement(size: Size): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;

        return canvas;
    }

    private getContext() {
        const context = this.canvas.getContext('2d');

        if (!context) throw new Error('Could not get canvas context');

        return context;
    }

    private renderScreen(canvas: HTMLCanvasElement) {
        const container = this.getContainer();
        container.appendChild(canvas);

        document.body.appendChild(container);
    }

    private getContainer(): HTMLDivElement {
        const container = document.createElement('div');
        container.id = 'root';
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        this.tempRenderUI(container);

        return container;
    }

    private tempRenderUI(container: HTMLDivElement) {
        container.innerHTML =
            '<!-- smaller red container div -->' +
            '<div style="position: absolute;display: flex;width: 100%;align-items: center;padding: 20px;">' +
            '<!-- player health -->' +
            '<div style="position: relative;width: 100%;display: flex;justify-content: flex-end;border-top: 4px solid white;border-left: 4px solid white;border-bottom: 4px solid white;">' +
            '<div style="background-color: red; height: 30px; width: 100%"></div><div id="playerHealth" style="position: absolute;background: #818cf8;top: 0;right: 0;bottom: 0;width: 100%;">' +
            '</div>' +
            '</div>' +
            '<!-- timer -->' +
            '<div id="timer" style="background-color: black;width: 100px;height: 50px;flex-shrink: 0;display: flex;align-items: center;justify-content: center;color: white;border: 4px solid white;">' +
            '10' +
            '</div>' +
            '<!-- enemy health -->' +
            '<div style="position: relative;width: 100%;border-top: 4px solid white;border-bottom: 4px solid white;border-right: 4px solid white;">' +
            '<div style="background-color: red; height: 30px"></div><div id="enemyHealth" style="position: absolute;background: #818cf8;top: 0;right: 0;bottom: 0;left: 0;">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="displayText" style="position: absolute;color: white;align-items: center;justify-content: center;top: 0;right: 0;bottom: 0;left: 0;display: none; ">Tie</div>';
    }
}
