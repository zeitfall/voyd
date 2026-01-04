import Transform from './Transform';

import type SceneComponent from './SceneComponent';

class SceneNode {
    #parent: SceneNode | null;
    #children: Set<SceneNode>;
    #components: Set<SceneComponent>;

    #transform: Transform;

    constructor() {
        this.#parent = null;
        this.#children = new Set();
        this.#components = new Set();

        this.#transform = new Transform();
    }

    get parent() {
        return this.#parent;
    }

    get transform() {
        return this.#transform;
    }

    get children() {
        return this.#children;
    }

    get components() {
        return this.#components;
    }

    addChild(child: SceneNode) {
        if (child === this) {
            return this;
        }

        const childParent = child.parent;

        if (childParent && childParent !== this) {
            childParent.removeChild(child);
        }

        child.#parent = this;

        this.#children.add(child);

        return this;
    }

    removeChild(child: SceneNode) {
        if (child.#parent === this) {
            child.#parent = null;

            this.#children.delete(child);
        }

        return this;
    }

    hasChild(child: SceneNode) {
        return this.#children.has(child);
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

    addComponent(component: SceneComponent) {
        const componentNode = component.node;

        if (componentNode !== this) {
            component.attachTo(this);
        }
        else {
            this.#components.add(component);
        }

        return this;
    }

    removeComponent(component: SceneComponent) {
        const componentNode = component.node;

        if (componentNode === this) {
            component.detach();
        }

        if (this.hasComponent(component)) {
            this.#components.delete(component);
        }

        return this;
    }

    hasComponent(component: SceneComponent) {
        return this.#components.has(component);
    }

    update() {
        const transform = this.#transform;
        const parent = this.#parent;
        const children = this.#children;
        const components = this.#components;

        const parentWorldMatrix = parent ? parent.transform.worldMatrix : null;

        transform.update(parentWorldMatrix);

        children.forEach((child) => {
            child.update();
        });

        components.forEach((component) => {
            component.update();
        });
    }
}

export default SceneNode;
