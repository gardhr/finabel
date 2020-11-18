# finabel

Finabel is a relatively simple password hashing algorithm based on cyclic abelian groups (finite fields). The primary motivation here was to implement something which is (hopefully) easier to analyze and verify than some of the more typical functions in common use (I mean, does anyone *really* undertsand how SHA-2 works?). That said, it's still very much in the experimental stage. Which is to say you probably shouldn't be using it just yet to replace what's currently protecting your user's passwords! 

Much thanks to all of the awesome folks at [crypto.stackexchange.com](crypto.stackexchange.com) for their assistance in fleshing things out. 

## Usage

```js
var hash = finabel(password, salt, rounds, digits);
```

