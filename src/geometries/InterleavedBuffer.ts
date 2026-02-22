class InterleavedBuffer {
    #data: ArrayBuffer;
    #byteStride: number;
    #itemCount: number;

    constructor(data: ArrayBuffer, byteStride: number) {
        const dataByteLength = data.byteLength;

        if (dataByteLength % byteStride !== 0) {
            throw new Error(`[InterleavedBuffer]: Data byte length must be a multiple of byte stride.`);
        }

        this.#data = data;
        this.#byteStride = byteStride;
        this.#itemCount = dataByteLength / byteStride;
    }

    get data() {
        return this.#data;
    }

    get byteStride() {
        return this.#byteStride;
    }

    get byteLength() {
        return this.data.byteLength;
    }

    get itemCount() {
        return this.#itemCount;
    }
}

export default InterleavedBuffer;
