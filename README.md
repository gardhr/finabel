[![npm version](https://badge.fury.io/js/finabel.png)](https://badge.fury.io/js/finabel)
[![NPM Downloads](https://img.shields.io/npm/dm/finabel)](https://www.npmjs.com/package/finabel)
[![Known Vulnerabilities](https://snyk.io/test/github/gardhr/finabel/badge.svg?targetFile=package.json)](https://snyk.io/test/github/gardhr/finabel?targetFile=package.json)
[![GitHub license](https://img.shields.io/badge/license-UNLICENSE-blue.svg)](https://github.com/gardhr/finabel/blob/master/LICENSE)

Try it [live](https://gardhr.github.io/)!

Finabel is a relatively simple password hashing algorithm based on cyclic abelian groups (finite fields). The primary motivation here was to implement something which is (hopefully) easier to analyze and verify than some of the more typical functions in common use (I mean, does anyone _really_ understand how SHA-2 works?). That said, it's still very much in the experimental stage. Which is to say you probably shouldn't be using it just yet to replace what's currently protecting your user's passwords!
Many thanks to all of the awesome folks at [crypto.stackexchange.com](https://crypto.stackexchange.com) for their assistance in fleshing things out.

## Usage

```js
const finabel = require("./finabel");
let argv = process.argv.slice(1);
let argc = argv.length;
console.log("Usage:", argv[0], "[KEY] [SALT] [ROUNDS] [DIGITS]");
let key = "";
if (argc > 1) key = argv[1];
let salt = "";
if (argc > 2) salt = argv[2];
let rounds = 0;
if (argc > 3) rounds = Number(argv[3]);
let digits = 0;
if (argc > 4) digits = Number(argv[4]);
console.log(finabel(key, salt, rounds, digits));
```

## How it works

The finabel algorithm is incredibly simple. A bird's-eye view looks something like this. We start by defining three large (public) prime numbers, A, B, and C. Next we define the function E(X) which "stretches" some X by repeated concatenation until the result contains at least as many bits as the largest prime. Let V represent some password and salt merged together and then reinterpreted as a large integer. Now we apply the following transform to calculate the hash, H(V):

Q = E(V)

R = (Q * A) mod B

S = E(R)  

H(V) = (Q * S) mod C

That's basically it! The hash function exibits some very useful properties:

(1) Irreversibility.

(2) Non-malleability (first and secondary preimage resistance).

(3) Strong collision resistance.

