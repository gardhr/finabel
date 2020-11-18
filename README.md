# finabel

Try it [live](https://gardhr.github.io/)!

Finabel is a relatively simple password hashing algorithm based on cyclic abelian groups (finite fields). The primary motivation here was to implement something which is (hopefully) easier to analyze and verify than some of the more typical functions in common use (I mean, does anyone _really_ understand how SHA-2 works?). That said, it's still very much in the experimental stage. Which is to say you probably shouldn't be using it just yet to replace what's currently protecting your user's passwords!
Much thanks to all of the awesome folks at [crypto.stackexchange.com](https://crypto.stackexchange.com) for their assistance in fleshing things out.

## Usage

```js
const finabel = require("finabel");
// ...
var hash = finabel(password, salt, rounds, digits);
```

## Implementation

The algorithm requires "big integer" maths, so much of the code is actually an imbedded version of [peterolson's BigInteger.js library](https://github.com/peterolson/BigInteger.js). The [actual hash function](https://github.com/gardhr/finabel/blob/main/finabel.js#L1489) is roughly 40 lines of code, so not much to work though in order to understand how it works.
