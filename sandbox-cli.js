const finabel = require("./sandbox");
let argv = process.argv.slice(1);
let argc = argv.length;
console.log("Usage:", argv[0], "[PASSWORD] [SALT] [ROUNDS] [DIGITS] [EXPENSE]");
let password = "";
if (argc > 1) password = argv[1];
let salt = "";
if (argc > 2) salt = argv[2];
let rounds = 0;
if (argc > 3) rounds = Number(argv[3]);
let digits = 0;
if (argc > 4) digits = Number(argv[4]);
let expense = 0;
if (argc > 5) expense = Number(argv[5]);
console.log(
  finabel({
    password: password,
    salt: salt,
    rounds: rounds,
    digits: digits,
    expense: expense,
  })
);
