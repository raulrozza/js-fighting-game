import { Component } from 'engine/types/Component';

export class Composable implements Component {
    private components: Record<string, Component> = {};

    protected addComponent(key: string, component: Component): void {
        this.components[key] = component;
    }

    protected getComponent<T extends Component>(key: string): T {
        return this.components[key] as T;
    }

    public update(): void {
        Object.values(this.components).forEach(component => component.update());
    }
}
