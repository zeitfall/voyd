import Transform from './Transform';

class SceneNode {
    #parent: SceneNode | null;
    #children: Set<SceneNode>;

    #transform: Transform;

    constructor() {
        this.#parent = null;
        this.#children = new Set();

        this.#transform = new Transform();
    }

    get parent() {
        return this.#parent;
    }

    get transform() {
        return this.#transform;
    }

    attachTo(parent: SceneNode) {
        parent.addChild(this);

        return this;
    }

    detach() {
        const parent = this.#parent;

        if (parent) {
            parent.removeChild(this);
        }

        return this;
    }

    addChild(child: SceneNode) {
        if (child === this) {
            return this;
        }

        const childParent = child.parent;

        if (childParent) {
            childParent.removeChild(child);
        }

        child.#parent = this;

        this.#children.add(child);

        return this;
    }

    removeChild(child: SceneNode) {
        if (this.hasChild(child)) {
            child.#parent = null;

            this.#children.delete(child);
        }

        return this;
    }

    hasChild(child: SceneNode) {
        return this.#children.has(child);
    }

    update(updateChildren = true) {
        const transform = this.#transform;
        const parent = this.#parent;
        const children = this.#children;

        const parentWorldMatrix = parent ? parent.transform.worldMatrix : null;

        transform.update(parentWorldMatrix);

        if (updateChildren) {
            children.forEach((child) => {
                child.update();
            });
        }
    }
}

export default SceneNode;
