[![npm version](https://badge.fury.io/js/finabel.png)](https://badge.fury.io/js/finabel)
[![NPM Downloads](https://img.shields.io/npm/dw/finabel)](https://www.npmjs.com/package/finabel)
[![Build Status](https://travis-ci.com/gardhr/finabel.png)](https://travis-ci.com/gardhr/finabel)
[![Known Vulnerabilities](https://snyk.io/test/github/gardhr/finabel/badge.svg?targetFile=package.json)](https://snyk.io/test/github/gardhr/finabel?targetFile=package.json)
[![GitHub license](https://img.shields.io/badge/license-UNLICENSE-blue.svg)](https://github.com/gardhr/finabel/blob/master/LICENSE)

Try it [live](https://gardhr.github.io/finabel)!

Finabel is a relatively simple password hashing algorithm based on cyclic abelian groups (finite fields). The primary motivation here was to implement something which is hopefully easier to analyze and verify than some of the more typical functions in common use.

## Usage

```js
const finabel = require("./finabel");
let argv = process.argv.slice(1);
let argc = argv.length;
if (argc <= 1)
  console.log("Usage:", argv[0], "[KEY] [SALT] [ROUNDS] [DIGITS] [COST]");
let key = "";
if (argc > 1) key = argv[1];
let salt = "";
if (argc > 2) salt = argv[2];
let rounds = 0;
if (argc > 3) rounds = Number(argv[3]);
let digits = 0;
if (argc > 4) digits = Number(argv[4]);
let cost = 0;
if (argc > 5) cost = Number(argv[5]);
console.log(finabel(key, salt, rounds, digits, cost));
```

NOTE: If _rounds_ is zero or unspecified, a default of 1024 rounds is used. If _cost_ is zero or unspecified, a default of 256 (kilobytes) is used.

## How it works

A bird's-eye view looks something like this. We start by defining three large (public) prime numbers, A, B, and C. Next we define the function E(X) which "stretches" some X by repeated concatenation until the result contains at least as many bits as the largest prime. Let V represent our password and salt merged together and then reinterpreted as a large integer. We now apply the following transform to calculate our hash, H(V):

```
Q = E(V)

R = (Q * A) mod B

S = E(R)

H(V) = (Q * S) mod C
```

The finabel algorithm demonstrates some very useful properties:

(1) [Irreversibility](https://en.wikipedia.org/wiki/One-way_function).

(2) Non-malleability (primary and secondary [preimage resistance](https://en.wikipedia.org/wiki/Preimage_attack)).

(3) Strong [collision resistance](https://en.wikipedia.org/wiki/Collision_resistance).

(4) Satisfies the [strict avalanche and bit independence criteria](https://en.wikipedia.org/wiki/Confusion_and_diffusion).

(5) Not susceptible to [length extension attacks](https://en.wikipedia.org/wiki/Length_extension_attack).

## Implementation

This reference implementation currently supports the following languages (UTF-8 fully supported unless otherwise indicated):

- Python 3
- Javascript
- C++ (requires [GNU Multiple Precision Arithmetic library](https://gmplib.org/#DOWNLOAD))
- Java

In the future I may include other languages as well. Until then, developers are encouraged to create their own implementations based on the straightforward examples given here.

