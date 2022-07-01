import { Component } from 'engine/types/Component';

type BuildValues = {
    frames: number;
    loop?: boolean;
};

const FRAME_FREQUENCY = 5;

export class Animation implements Component {
    public frames: number;
    public currentFrame = 0;
    private loop: boolean;
    private isPaused = false;

    private elapsedFrames = 0;

    constructor({ frames, loop = true }: BuildValues) {
        this.frames = frames;
        this.loop = loop;
    }

    public update(): void {
        if (!this.shouldUpdate()) return;

        const nextFrame = this.currentFrame + 1;
        if (!this.loop && nextFrame === this.frames) return;

        this.currentFrame = nextFrame % this.frames;
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        this.isPaused = false;
    }

    public reset(): void {
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.resume();
    }

    private shouldUpdate(): boolean {
        if (this.isPaused) return false;

        this.elapsedFrames++;

        return this.elapsedFrames % FRAME_FREQUENCY === 0;
    }
}
