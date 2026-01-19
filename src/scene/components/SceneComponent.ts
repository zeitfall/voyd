import SceneNode from '../SceneNode';

// https://docs.unity3d.com/ScriptReference/Component.html
abstract class SceneComponent {
    #node: SceneNode | null;

    constructor() {
        this.#node = null;
    }

    get node() {
        return this.#node;
    }

    attachTo(node: SceneNode) {
        const currentNode = this.#node;

        if (currentNode && currentNode !== node) {
            currentNode.removeComponent(this);
        }        

        this.#node = node;

        node.addComponent(this);

        return this;
    }

    detach() {
        const node = this.#node;

        if (node) {
            this.#node = null;

            node.removeComponent(this);
        }
    }

    abstract update(deltaTime: number): void;
}

export default SceneComponent;
