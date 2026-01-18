import { Matrix4, Quaternion, Vector3 } from '~/math';

class Transform {
    #position: Vector3;
    #rotation: Quaternion;
    #scale: Vector3;
    #directionToTarget: Vector3;

    #localMatrix: Matrix4;
    #worldMatrix: Matrix4;

    constructor() {
        this.#position = new Vector3();
        this.#rotation = new Quaternion();
        this.#scale = new Vector3(1, 1, 1);
        this.#directionToTarget = new Vector3();

        this.#localMatrix = new Matrix4();
        this.#worldMatrix = new Matrix4();
    }

    get position() {
        return this.#position;
    }

    get rotation() {
        return this.#rotation;
    }

    get scale() {
        return this.#scale;
    }

    get localMatrix() {
        return this.#localMatrix;
    }

    get worldMatrix() {
        return this.#worldMatrix;
    }

    extractRight(right: Vector3) {
        const matrixElements = this.#worldMatrix.elements;

        const rx = matrixElements[0];
        const ry = matrixElements[1];
        const rz = matrixElements[2];

        right.set(rx, ry, rz).normalize();
    }

    extractUp(up: Vector3) {
        const matrixElements = this.#worldMatrix.elements;

        const ux = matrixElements[4];
        const uy = matrixElements[5];
        const uz = matrixElements[6];

        up.set(ux, uy, uz).normalize();
    }

    extractForward(forward: Vector3) {
        const matrixElements = this.#worldMatrix.elements;

        const fx = matrixElements[8];
        const fy = matrixElements[9];
        const fz = matrixElements[10];

        forward.set(fx, fy, fz).normalize();
    }

    lookAt(target: Vector3) {
        const position = this.#position;
        const rotation = this.#rotation;
        const directionToTarget = this.#directionToTarget;

        directionToTarget.copy(target).directionFrom(position);
        rotation.setFromDirection(directionToTarget);

        return this;
    }

    update(parentWorldMatrix: Matrix4 | null = null) {
        this.updateLocalMatrix().updateWorldMatrix(parentWorldMatrix);
    }

    updateLocalMatrix() {
        // TODO: We do not always need to update local matrix.
        this.#localMatrix.setFromTRS(this.#position, this.#rotation, this.#scale);

        return this;
    }

    updateWorldMatrix(parentWorldMatrix: Matrix4 | null = null) {
        const localMatrix = this.#localMatrix;
        const worldMatrix = this.#worldMatrix;

        worldMatrix.copy(localMatrix);

        if (parentWorldMatrix) {
            worldMatrix.premultiply(parentWorldMatrix);
        }

        return this;
    }
}

export default Transform;
