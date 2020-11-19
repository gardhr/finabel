# finabel

Try it [live](https://gardhr.github.io/)!

Finabel is a relatively simple password hashing algorithm based on cyclic abelian groups (finite fields). The primary motivation here was to implement something which is (hopefully) easier to analyze and verify than some of the more typical functions in common use (I mean, does anyone _really_ understand how SHA-2 works?). That said, it's still very much in the experimental stage. Which is to say you probably shouldn't be using it just yet to replace what's currently protecting your user's passwords!
Much thanks to all of the awesome folks at [crypto.stackexchange.com](https://crypto.stackexchange.com) for their assistance in fleshing things out.

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
console.log(finabel(key, salt, rounds, digits, true));
```

