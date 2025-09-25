class Quaternion {
    constructor(
        public x = 0,
        public y = 0,
        public z = 0,
        public w = 1,
    ) {}

    get lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }

    get length() {
        return Math.sqrt(this.lengthSquared);
    }

    // set length(length: number) {
    //     this.normalize().scale(length);
    // }

    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    set(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    }

    setX(x: number) {
        this.x = x;

        return this;
    }

    setY(y: number) {
        this.y = y;
        
        return this;
    }

    setZ(z: number) {
        this.z = z;

        return this;
    }

    setW(w: number) {
        this.w = w;
        
        return this;
    }

    copy(q0: Quaternion) {
        return this.set(q0.x, q0.y, q0.z, q0.w);
    }

    add(q0: Quaternion) {
        return this.set(this.x + q0.x, this.y + q0.y, this.z + q0.z, this.w + q0.w);
    }

    subtract(q0: Quaternion) {
        return this.set(this.x - q0.x, this.y - q0.y, this.z - q0.z, this.w - q0.w);
    }
}

export default Quaternion;
