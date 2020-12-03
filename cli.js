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

