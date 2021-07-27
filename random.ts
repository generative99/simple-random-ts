/**
 * A standalone, pure Typescript implementation of the Mersenne Twister pseudo random number generator compatible with Deno. 
 *
 * @module MersenneTwister
 * @author Raphael Pigulla <pigulla@four66.com>
 * @license See the attached LICENSE file.
 * @version 0.2.3

 * Most comments were stripped from the source. If needed you can still find them in the original C code:
 * http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/CODES/mt19937ar.c
 *
 * The original port to JavaScript, on which this file is based, was done by Sean McCullough. It can be found at:
 * https://gist.github.com/banksean/300494
 */

const MAX_INT = 4294967296.0,
    N = 624,
    M = 397,
    UPPER_MASK = 0x80000000,
    LOWER_MASK = 0x7fffffff,
    MATRIX_A = 0x9908b0df;

export default class MersenneTwister {

    /**
     * Instantiates a new Mersenne Twister.
     * @param {number=} seed The initial seed value.
     */

    mt: number[]
    mti: number

    constructor(seed: number) {
        this.mt = new Array(N)
        this.mti = N + 1

        this.seed(seed)
    }

    static dateSeed() {
        return new Date().getTime()
    }
    /**
     * Initializes the state vector by using one unsigned 32-bit integer "seed", which may be zero.
     * @param {number} seed The seed value.
     */
    seed(seed: number) {
        let s

        this.mt[0] = seed >>> 0;

        for (this.mti = 1; this.mti < N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] =
                (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            this.mt[this.mti] >>>= 0;
        }
    }

    /**
     * Initializes the state vector by using an array key[] of unsigned 32-bit integers of the specified length. If
     * length is smaller than 624, then each array of 32-bit integers gives distinct initial state vector. This is
     * useful if you want a larger seed space than 32-bit word.
     * @param {array} vector The seed vector.
     */
    seedArray(vector: number[]) {
        var i = 1,
            j = 0,
            k = N > vector.length ? N : vector.length,
            s;

        this.seed(19650218);

        for (; k > 0; k--) {
            s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);

            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) +
                vector[j] + j;
            this.mt[i] >>>= 0;
            i++;
            j++;
            if (i >= N) {
                this.mt[0] = this.mt[N - 1];
                i = 1;
            }
            if (j >= vector.length) {
                j = 0;
            }
        }

        for (k = N - 1; k; k--) {
            s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] =
                (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
            this.mt[i] >>>= 0;
            i++;
            if (i >= N) {
                this.mt[0] = this.mt[N - 1];
                i = 1;
            }
        }

        this.mt[0] = 0x80000000;
    }

    /**
     * Generates a random unsigned 32-bit integer.
     * @returns {number}
     */
    int() {
        var y,
            kk,
            mag01 = new Array(0, MATRIX_A);

        if (this.mti >= N) {
            if (this.mti === N + 1) {
                this.seed(5489);
            }

            for (kk = 0; kk < N - M; kk++) {
                y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
                this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
            }

            for (; kk < N - 1; kk++) {
                y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
                this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
            }

            y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
            this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 1];
            this.mti = 0;
        }

        y = this.mt[this.mti++];

        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }

    /**
    * Generates a random real in the interval [0;1[ with 32-bit resolution.
    * Equivelant to Math.random()
    * @returns {number}
    */
    random() {
        return this.int() * (1.0 / MAX_INT);
    }

    /**
     * Generates a random unsigned 31-bit integer.
     *
     * @since 0.1.0
     * @returns {number}
     */
    int31() {
        return this.int() >>> 1;
    }

    /**
     * Generates a random real in the interval [0;1] with 32-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
    real() {
        return this.int() * (1.0 / (MAX_INT - 1));
    }

    /**
     * Generates a random real in the interval ]0;1[ with 32-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
    realx() {
        return (this.int() + 0.5) * (1.0 / MAX_INT);
    }

    /**
     * Generates a random real in the interval [0;1[ with 53-bit resolution.
     *
     * @returns {number}
     */
    rndHiRes() {
        var a = this.int() >>> 5,
            b = this.int() >>> 6;

        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
}