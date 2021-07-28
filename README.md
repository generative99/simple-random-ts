# simple-random-ts
Seedable random number generator in Typescript for Deno

The Mersenne Twister is a pseudo-random number generator invented by Makoto Matsumoto in 1997. Details can be found on the [Wikipedia page](http://en.wikipedia.org/wiki/Mersenne_twister) and on Matsumoto's [website](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html).

This implementation is based on Sean McCullough's [port](https://gist.github.com/banksean/300494) of the original C code written by Makato Matsumoto and Takuji Nishimura and Raphael Pigulla's [continuation](https://github.com/pigulla/mersennetwister).

Improvements over Sean's version are

  - more idiomatic, [jshint](http://www.jshint.com/)-compliant and [jsdoc](http://usejsdoc.org/)-annotated code
  - compatible with [Node.js](http://nodejs.org/), [requirejs](http://requirejs.org/)  and browser environments
  - available as a module for [npm](https://npmjs.org/), [Jam](http://jamjs.org/) and [Bower](http://bower.io/)
  - (somewhat) unit tested ;-)

Please note that the mersenne twister is [not cryptographically secure](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/efaq.html).

## Usage
Instantiate your own instance of the mersenne twister and use its methods:

```javascript
const mt = new MersenneTwister(seed); // if no seed is defined, seed randomly

mt.int();    // random 32-bit integer
mt.int31();  // random 31-bit integer

mt.rnd();       // random float in the interval [0;1[ with 32-bit resolution
mt.random();    // random float in the interval [0;1[ (same as mt.rnd() above)
mt.rndHiRes();  // random float in the interval [0;1[ with 53-bit resolution
mt.real();      // random float in the interval [0;1]
mt.realx();     // random float in the interval ]0;1[

mt.seed(seed);      // (re)seed the generator with an unsigned 32-bit integer
mt.seedArray(key);  // (re)seed using a state vector of unsigned 32-bit integers
```
Note: that the seed only affects output in integer increments.

Take a look at the inventor´s [website](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html) if more detailed information is required.

## Licensing
As indicated [here](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/elicense.html), the Mersenne Twister algorithm is free to be used for any purpose, including commercial use. The license file of this module contains the BSD 3-clause license found in the [C implementation](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/CODES/mt19937ar.c) on which it is based.